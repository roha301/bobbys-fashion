import re
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/search", tags=["search"])


def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = text.replace("-", " ")
    text = re.sub(r"[^\w\s]", "", text)
    return " ".join(text.split())


@router.get("", response_model=List[schemas.ProductOut])
def search(q: str, db: Session = Depends(get_db)):
    like = f"%{q}%"
    return (
        db.query(models.Product)
        .filter(or_(models.Product.name.ilike(like), models.Product.brand.ilike(like), models.Product.category.ilike(like)))
        .all()
    )


@router.get("/predict", response_model=List[str])
def predict(q: str, db: Session = Depends(get_db)):
    q_clean = q.strip()
    if not q_clean:
        return []
    
    q_norm = normalize_text(q_clean)
    if not q_norm:
        return []

    predictions = set()

    # 1. Matches in categories
    categories = db.query(models.Category).all()
    matched_cat_ids = set()
    for cat in categories:
        cat_name_norm = normalize_text(cat.name)
        cat_id_norm = normalize_text(cat.id)
        if q_norm in cat_name_norm or q_norm in cat_id_norm:
            predictions.add(cat.name.lower())
            matched_cat_ids.add(cat.id)

    # 2. Distinct subcategories matching query or categories
    subcategories = (
        db.query(models.Product.subcategory, models.Product.category)
        .filter(models.Product.subcategory != "")
        .filter(models.Product.subcategory != None)
        .distinct()
        .all()
    )

    for subcat, cat_id in subcategories:
        subcat_norm = normalize_text(subcat)
        cat_obj = next((c for c in categories if c.id == cat_id), None)
        cat_name = cat_obj.name if cat_obj else cat_id

        # Match: query is in subcategory
        if q_norm in subcat_norm:
            predictions.add(subcat.lower())
            predictions.add(f"{cat_name.lower()} {subcat.lower()}")
            predictions.add(f"{cat_name.lower()}s {subcat.lower()}")

        # Match: query is in category, suggest category + its subcategory
        if cat_id in matched_cat_ids:
            predictions.add(f"{cat_name.lower()} {subcat.lower()}")
            predictions.add(f"{cat_name.lower()}s {subcat.lower()}")

    # 3. Brands matching query
    brands = (
        db.query(models.Product.brand)
        .filter(models.Product.brand != "")
        .filter(models.Product.brand != None)
        .distinct()
        .all()
    )
    for (brand,) in brands:
        brand_norm = normalize_text(brand)
        if q_norm in brand_norm:
            predictions.add(brand.lower())
            
            brand_cats = (
                db.query(models.Product.category)
                .filter(models.Product.brand == brand)
                .distinct()
                .all()
            )
            for (cat_id,) in brand_cats:
                cat_obj = next((c for c in categories if c.id == cat_id), None)
                cat_name = cat_obj.name if cat_obj else cat_id
                predictions.add(f"{brand.lower()} {cat_name.lower()}")

    # 4. Product names matching query (extract phrases)
    like = f"%{q_clean}%"
    products = (
        db.query(models.Product.name)
        .filter(models.Product.name.ilike(like))
        .limit(30)
        .all()
    )

    for (name,) in products:
        parts = re.split(r"\|\||\||-|:|,", name)
        for part in parts:
            part_clean = part.strip()
            part_norm = normalize_text(part_clean)
            if q_norm in part_norm:
                words = part_clean.split()
                if len(words) <= 6:
                    predictions.add(part_clean.lower())
                else:
                    words_norm = [normalize_text(w) for w in words]
                    q_words = q_norm.split()
                    for idx in range(len(words_norm) - len(q_words) + 1):
                        sub_slice = words_norm[idx : idx + len(q_words)]
                        if sub_slice == q_words:
                            start = max(0, idx - 2)
                            end = min(len(words), idx + len(q_words) + 2)
                            predictions.add(" ".join(words[start:end]).lower())
                            break

    # Filter predictions to contain the query keywords
    results = []
    for p in predictions:
        p_clean = p.strip()
        if not p_clean or len(p_clean) > 40:
            continue
        p_norm = normalize_text(p_clean)
        all_words_present = True
        for qw in q_norm.split():
            if qw not in p_norm:
                all_words_present = False
                break
        if all_words_present:
            results.append(p_clean)

    # Sort results
    def sort_key(item):
        item_norm = normalize_text(item)
        starts_with = item_norm.startswith(q_norm)
        return (not starts_with, len(item), item)

    results.sort(key=sort_key)
    
    unique_results = []
    seen = set()
    for r in results:
        if r not in seen:
            seen.add(r)
            unique_results.append(r)
            if len(unique_results) >= 8:
                break

    return unique_results

