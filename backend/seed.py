"""
Seed the Bobby Sales database with categories, an admin user, and sample products.

Usage:
    source venv/bin/activate   (or venv\\Scripts\\activate on Windows)
    python seed.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app.database import Base, engine, SessionLocal  # noqa: E402
from app import models  # noqa: E402
from app.auth import hash_password  # noqa: E402

Base.metadata.create_all(bind=engine)

CATEGORIES = [
    {"id": "women", "name": "Women", "emoji": "👗"},
    {"id": "men", "name": "Men", "emoji": "👔"},
    {"id": "shoes", "name": "Shoes", "emoji": "👟"},
    {"id": "bags", "name": "Bags", "emoji": "👜"},
    {"id": "watches", "name": "Watches", "emoji": "⌚"},
    {"id": "beauty", "name": "Beauty", "emoji": "💄"},
    {"id": "jackets", "name": "Jackets", "emoji": "🧥"},
    {"id": "jeans", "name": "Jeans", "emoji": "👖"},
]

def img(seed, w=600, h=800):
    return f"https://picsum.photos/seed/{seed}/{w}/{h}"

PRODUCTS = [
    dict(name="Oversized Wool Blend Coat", brand="Zaraya", category="jackets", price=4299, mrp=6999, discount=39, rating=4.6, store="Myntra", featured=True, trending=True, deal=False, images=[img("coat1"), img("coat1b")], colors=["Camel", "Black"], sizes=["S", "M", "L", "XL"], description="A tailored oversized coat in a soft wool blend, cut for a relaxed silhouette.", affiliate_link="https://www.myntra.com/"),
    dict(name="Satin Slip Midi Dress", brand="Luvere", category="women", price=1899, mrp=3499, discount=46, rating=4.4, store="Ajio", featured=True, trending=True, deal=True, images=[img("dress1"), img("dress1b")], colors=["Champagne", "Black", "Emerald"], sizes=["XS", "S", "M", "L"], description="Bias-cut satin slip dress with adjustable straps.", affiliate_link="https://www.ajio.com/"),
    dict(name="Classic Leather Chelsea Boots", brand="Northgate", category="shoes", price=3599, mrp=4999, discount=28, rating=4.7, store="Amazon", featured=True, trending=False, deal=False, images=[img("boot1"), img("boot1b")], colors=["Tan", "Black"], sizes=["6", "7", "8", "9", "10"], description="Full-grain leather Chelsea boots with an elastic gusset.", affiliate_link="https://www.amazon.in/"),
    dict(name="Structured Top-Handle Bag", brand="Maison Cle", category="bags", price=5299, mrp=8999, discount=41, rating=4.5, store="Nykaa Fashion", featured=False, trending=True, deal=True, images=[img("bag1"), img("bag1b")], colors=["Ivory", "Tan", "Black"], sizes=["One Size"], description="Structured top-handle bag in saffiano-finish leather.", affiliate_link="https://www.nykaafashion.com/"),
    dict(name="Automatic Steel Chronograph", brand="Verlure", category="watches", price=7999, mrp=12999, discount=38, rating=4.8, store="Amazon", featured=True, trending=True, deal=False, images=[img("watch1"), img("watch1b")], colors=["Silver", "Gold"], sizes=["One Size"], description="Stainless steel chronograph with sapphire crystal.", affiliate_link="https://www.amazon.in/"),
    dict(name="Matte Velvet Lipstick Set", brand="Bloume", category="beauty", price=899, mrp=1499, discount=40, rating=4.3, store="Nykaa", featured=False, trending=True, deal=True, images=[img("lip1"), img("lip1b")], colors=["Nude Set", "Red Set"], sizes=["One Size"], description="A trio of long-wear matte lipsticks.", affiliate_link="https://www.nykaa.com/"),
    dict(name="Straight Fit Selvedge Jeans", brand="Denimhaus", category="jeans", price=2599, mrp=3999, discount=35, rating=4.5, store="Flipkart", featured=False, trending=False, deal=False, images=[img("jean1"), img("jean1b")], colors=["Indigo", "Black"], sizes=["28", "30", "32", "34", "36"], description="Rigid selvedge denim in a straight fit.", affiliate_link="https://www.flipkart.com/"),
    dict(name="Tailored Linen Blazer", brand="Fornara", category="men", price=3199, mrp=4999, discount=36, rating=4.6, store="Myntra", featured=True, trending=False, deal=False, images=[img("blazer1"), img("blazer1b")], colors=["Beige", "Navy"], sizes=["38", "40", "42", "44"], description="A breathable linen blazer with a soft shoulder.", affiliate_link="https://www.myntra.com/"),
    dict(name="Ribbed Knit Bodysuit", brand="Luvere", category="women", price=999, mrp=1799, discount=44, rating=4.2, store="Meesho", featured=False, trending=True, deal=True, images=[img("body1"), img("body1b")], colors=["Black", "Ecru"], sizes=["XS", "S", "M", "L"], description="A second-skin ribbed bodysuit.", affiliate_link="https://www.meesho.com/"),
    dict(name="Minimalist Canvas Sneakers", brand="Northgate", category="shoes", price=1799, mrp=2599, discount=31, rating=4.4, store="Ajio", featured=False, trending=True, deal=False, images=[img("sneak1"), img("sneak1b")], colors=["White", "Off-White"], sizes=["6", "7", "8", "9", "10", "11"], description="A low-profile canvas sneaker with a cupsole.", affiliate_link="https://www.ajio.com/"),
    dict(name="Quilted Crossbody Bag", brand="Maison Cle", category="bags", price=2299, mrp=3799, discount=39, rating=4.5, store="Myntra", featured=False, trending=False, deal=True, images=[img("bag2"), img("bag2b")], colors=["Black", "Blush"], sizes=["One Size"], description="A quilted crossbody with a signature gold-tone clasp.", affiliate_link="https://www.myntra.com/"),
    dict(name="Merino Wool Crewneck", brand="Fornara", category="men", price=2199, mrp=3299, discount=33, rating=4.6, store="Amazon", featured=False, trending=False, deal=False, images=[img("crew1"), img("crew1b")], colors=["Charcoal", "Camel", "Navy"], sizes=["S", "M", "L", "XL"], description="A fine-gauge merino crewneck.", affiliate_link="https://www.amazon.in/"),
]

def run():
    db = SessionLocal()
    try:
        if db.query(models.Category).count() == 0:
            for c in CATEGORIES:
                db.add(models.Category(**c))
            print(f"Seeded {len(CATEGORIES)} categories")

        if db.query(models.Product).count() == 0:
            for p in PRODUCTS:
                db.add(models.Product(**p))
            print(f"Seeded {len(PRODUCTS)} products")

        if db.query(models.AdminUser).count() == 0:
            admin_username = os.environ.get("BOBBY_SALES_ADMIN_USER", "admin")
            admin_password = os.environ.get("BOBBY_SALES_ADMIN_PASSWORD", "bobbysales123")
            db.add(models.AdminUser(username=admin_username, hashed_password=hash_password(admin_password)))
            print(f"Created admin user '{admin_username}' — change this password in production!")

        db.commit()
        print("Seed complete.")
    finally:
        db.close()

if __name__ == "__main__":
    run()
