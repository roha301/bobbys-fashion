from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth import require_admin

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()


@router.post("", response_model=schemas.CategoryOut, status_code=201)
def create_category(
    payload: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    _admin: str = Depends(require_admin)
):
    # Check if category already exists
    existing = db.query(models.Category).filter(models.Category.id == payload.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")
    
    category = models.Category(id=payload.id, name=payload.name, emoji=payload.emoji)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/{category_id}", response_model=schemas.CategoryOut)
def update_category(
    category_id: str,
    payload: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    _admin: str = Depends(require_admin)
):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    category.name = payload.name
    category.emoji = payload.emoji
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}")
def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    _admin: str = Depends(require_admin)
):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if there are products in this category
    product_count = db.query(models.Product).filter(models.Product.category == category_id).count()
    if product_count > 0:
        raise HTTPException(status_code=400, detail=f"Cannot delete category: {product_count} products are using it.")

    db.delete(category)
    db.commit()
    return {"ok": True}


@router.get("/{category_id}/subcategories", response_model=List[str])
def list_subcategories(category_id: str, db: Session = Depends(get_db)):
    results = (
        db.query(models.Product.subcategory)
        .filter(models.Product.category == category_id)
        .filter(models.Product.subcategory != None)
        .filter(models.Product.subcategory != "")
        .distinct()
        .all()
    )
    return [r[0] for r in results]
