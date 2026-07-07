from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, AliasChoices


class ProductBase(BaseModel):
    name: str
    description: str = ""
    category: str
    subcategory: str = ""
    brand: str = ""
    price: float
    mrp: float = 0
    discount: int = 0
    rating: float = 4.5
    store: str = "Amazon"
    affiliateLink: str = Field(default="", validation_alias=AliasChoices("affiliateLink", "affiliate_link"))
    images: List[str] = []
    colors: List[str] = []
    sizes: List[str] = []
    featured: bool = False
    trending: bool = False
    deal: bool = False

    model_config = ConfigDict(populate_by_name=True)


class ProductCreate(ProductBase):
    pass


class ProductOut(ProductBase):
    id: int
    views: int = 0
    clicks: int = 0
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class CategoryCreate(BaseModel):
    id: str
    name: str
    emoji: str


class CategoryOut(BaseModel):
    id: str
    name: str
    emoji: str

    model_config = ConfigDict(from_attributes=True)


class HomeDataOut(BaseModel):
    categories: List[CategoryOut]
    trending: List[ProductOut]
    deals: List[ProductOut]
    featured: List[ProductOut]



class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str


class LoginIn(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AnalyticsStoreStats(BaseModel):
    store: str
    pct: float
    clicks: int
    color: str


class AnalyticsProductStats(BaseModel):
    name: str
    views: int


class StatsOut(BaseModel):
    total_products: int
    total_categories: int
    featured_products: int
    total_views: int
    total_clicks: int
    most_viewed: List[AnalyticsProductStats]
    store_clicks: List[AnalyticsStoreStats]


class UserRegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLoginIn(BaseModel):
    email: EmailStr
    password: str


class UserGoogleIn(BaseModel):
    credential: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    avatar: str
    provider: str

    model_config = ConfigDict(from_attributes=True)
