from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from .. import models, schemas
from ..database import get_db
from ..auth import require_admin

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=List[schemas.ProductOut])
def list_products(
    db: Session = Depends(get_db),
    category: Optional[str] = None,
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
    query = db.query(models.Product)

    if category:
        query = query.filter(models.Product.category == category)
    if brand:
        query = query.filter(models.Product.brand.ilike(brand))
    if store:
        query = query.filter(models.Product.store.ilike(store))
    if featured is not None:
        query = query.filter(models.Product.featured == featured)
    if trending is not None:
        query = query.filter(models.Product.trending == trending)
    if deal is not None:
        query = query.filter(models.Product.deal == deal)
    if minPrice is not None:
        query = query.filter(models.Product.price >= minPrice)
    if maxPrice is not None:
        query = query.filter(models.Product.price <= maxPrice)
    if minRating is not None:
        query = query.filter(models.Product.rating >= minRating)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(models.Product.name.ilike(like), models.Product.brand.ilike(like), models.Product.category.ilike(like))
        )

    if sort == "price_low":
        query = query.order_by(models.Product.price.asc())
    elif sort == "price_high":
        query = query.order_by(models.Product.price.desc())
    elif sort == "popular":
        query = query.order_by(models.Product.rating.desc())
    elif sort == "newest":
        query = query.order_by(models.Product.id.desc())

    return query.all()


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.views = (product.views or 0) + 1
    db.commit()
    db.refresh(product)
    return product


@router.post("/{product_id}/click")
def register_click(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.clicks = (product.clicks or 0) + 1
    db.commit()
    return {"ok": True, "clicks": product.clicks}


@router.post("", response_model=schemas.ProductOut, status_code=201)
def create_product(payload: schemas.ProductCreate, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    data = payload.model_dump(by_alias=False)
    data["affiliate_link"] = data.pop("affiliateLink", "")
    product = models.Product(**data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, payload: schemas.ProductCreate, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    data = payload.model_dump(by_alias=False)
    data["affiliate_link"] = data.pop("affiliateLink", "")
    for key, value in data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return None
