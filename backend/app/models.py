from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func

from .database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, default="")
    category = Column(String, index=True, nullable=False)
    subcategory = Column(String, default="")
    brand = Column(String, index=True, default="")
    price = Column(Float, nullable=False)
    mrp = Column(Float, default=0)
    discount = Column(Integer, default=0)
    rating = Column(Float, default=4.5)
    store = Column(String, index=True, default="Amazon")
    affiliate_link = Column(String, default="")
    images = Column(JSON, default=list)
    colors = Column(JSON, default=list)
    sizes = Column(JSON, default=list)
    featured = Column(Boolean, default=False, index=True)
    trending = Column(Boolean, default=False, index=True)
    deal = Column(Boolean, default=False, index=True)
    views = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)  # slug, e.g. "women"
    name = Column(String, nullable=False)
    emoji = Column(String, default="🛍️")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    avatar = Column(String, default="")
    hashed_password = Column(String, nullable=True)
    provider = Column(String, default="credentials")

