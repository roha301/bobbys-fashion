from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("", response_model=List[schemas.ProductOut])
def search(q: str, db: Session = Depends(get_db)):
    like = f"%{q}%"
    return (
        db.query(models.Product)
        .filter(or_(models.Product.name.ilike(like), models.Product.brand.ilike(like), models.Product.category.ilike(like)))
        .all()
    )
