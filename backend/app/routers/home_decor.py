from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from .. import schemas, database
from ..models_home_decor import HomeDecorCategory, HomeDecorProduct
from ..database import get_db
from ..auth import require_admin

router = APIRouter(prefix="/api/home-decor", tags=["home-decor"])


@router.get("/categories", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(HomeDecorCategory).all()


@router.get("/products", response_model=List[schemas.ProductOut])
def list_products(
    db: Session = Depends(get_db),
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    brand: Optional[str] = None,
    store: Optional[str] = None,
    featured: Optional[bool] = None,
    trending: Optional[bool] = None,
    deal: Optional[bool] = None,
    q: Optional[str] = None,
    minPrice: Optional[float] = Query(None),
    maxPrice: Optional[float] = Query(None),
    minRating: Optional[float] = Query(None),
    sort: Optional[str] = None,
):
    query = db.query(HomeDecorProduct)

    if category:
        query = query.filter(HomeDecorProduct.category == category)
    if subcategory:
        query = query.filter(HomeDecorProduct.subcategory.ilike(subcategory))
    if brand:
        query = query.filter(HomeDecorProduct.brand.ilike(brand))
    if store:
        query = query.filter(HomeDecorProduct.store.ilike(store))
    if featured is not None:
        query = query.filter(HomeDecorProduct.featured == featured)
    if trending is not None:
        query = query.filter(HomeDecorProduct.trending == trending)
    if deal is not None:
        query = query.filter(HomeDecorProduct.deal == deal)
    if minPrice is not None:
        query = query.filter(HomeDecorProduct.price >= minPrice)
    if maxPrice is not None:
        query = query.filter(HomeDecorProduct.price <= maxPrice)
    if minRating is not None:
        query = query.filter(HomeDecorProduct.rating >= minRating)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                HomeDecorProduct.name.ilike(like),
                HomeDecorProduct.brand.ilike(like),
                HomeDecorProduct.category.ilike(like),
            )
        )

    if sort == "price_low":
        query = query.order_by(HomeDecorProduct.price.asc())
    elif sort == "price_high":
        query = query.order_by(HomeDecorProduct.price.desc())
    elif sort == "popular":
        query = query.order_by(HomeDecorProduct.rating.desc())
    elif sort == "newest":
        query = query.order_by(HomeDecorProduct.id.desc())

    return query.all()


@router.get("/home", response_model=schemas.HomeDataOut)
def get_home_data(db: Session = Depends(get_db)):
    categories = db.query(HomeDecorCategory).all()
    trending = db.query(HomeDecorProduct).filter(HomeDecorProduct.trending == True).limit(8).all()
    deals = db.query(HomeDecorProduct).filter(HomeDecorProduct.deal == True).limit(8).all()
    featured = db.query(HomeDecorProduct).filter(HomeDecorProduct.featured == True).limit(8).all()

    return {
        "categories": categories,
        "trending": trending,
        "deals": deals,
        "featured": featured,
    }


@router.get("/products/brands", response_model=List[str])
def get_unique_brands(db: Session = Depends(get_db)):
    results = (
        db.query(HomeDecorProduct.brand)
        .filter(HomeDecorProduct.brand != "")
        .filter(HomeDecorProduct.brand != None)
        .distinct()
        .all()
    )
    brands_list = {r[0].strip() for r in results if r[0] and r[0].strip()}
    return sorted(list(brands_list))


@router.get("/products/stores", response_model=List[str])
def get_unique_stores(db: Session = Depends(get_db)):
    results = (
        db.query(HomeDecorProduct.store)
        .filter(HomeDecorProduct.store != "")
        .filter(HomeDecorProduct.store != None)
        .distinct()
        .all()
    )
    stores_list = {r[0].strip() for r in results if r[0] and r[0].strip()}
    return sorted(list(stores_list))


@router.get("/products/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(HomeDecorProduct).filter(HomeDecorProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Increment views
    product.views += 1
    db.commit()
    return product


@router.post("/products/{product_id}/click")
def register_click(product_id: int, db: Session = Depends(get_db)):
    product = db.query(HomeDecorProduct).filter(HomeDecorProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.clicks = (product.clicks or 0) + 1
    db.commit()
    return {"ok": True, "clicks": product.clicks}


# ── Admin CRUD: Products ──

@router.post("/products", response_model=schemas.ProductOut, status_code=201)
def create_hd_product(payload: schemas.ProductCreate, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    data = payload.model_dump(by_alias=False)
    data["affiliate_link"] = data.pop("affiliateLink", "")
    product = HomeDecorProduct(**data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=schemas.ProductOut)
def update_hd_product(product_id: int, payload: schemas.ProductCreate, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    product = db.query(HomeDecorProduct).filter(HomeDecorProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    data = payload.model_dump(by_alias=False)
    data["affiliate_link"] = data.pop("affiliateLink", "")
    for key, value in data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}", status_code=204)
def delete_hd_product(product_id: int, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    product = db.query(HomeDecorProduct).filter(HomeDecorProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()


# ── Admin CRUD: Categories ──

@router.post("/categories", response_model=schemas.CategoryOut, status_code=201)
def create_hd_category(payload: schemas.CategoryCreate, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    if db.query(HomeDecorCategory).filter(HomeDecorCategory.id == payload.id).first():
        raise HTTPException(status_code=400, detail="Category with this slug already exists.")
    cat = HomeDecorCategory(**payload.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/categories/{cat_id}", response_model=schemas.CategoryOut)
def update_hd_category(cat_id: str, payload: schemas.CategoryCreate, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    cat = db.query(HomeDecorCategory).filter(HomeDecorCategory.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat.name = payload.name
    cat.emoji = payload.emoji
    db.commit()
    return cat


@router.delete("/categories/{cat_id}", status_code=204)
def delete_hd_category(cat_id: str, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    cat = db.query(HomeDecorCategory).filter(HomeDecorCategory.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
