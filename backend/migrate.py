import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.dirname(__file__))

from app import models

# Setup engines
sqlite_engine = create_engine("sqlite:///./bobby_sales.db")
supabase_engine = create_engine("postgresql://postgres.qcxgpylocedhgjbsqlhw:BobbyFashion%231234@aws-1-ap-south-1.pooler.supabase.com:5432/postgres")

SqliteSession = sessionmaker(bind=sqlite_engine)
SupabaseSession = sessionmaker(bind=supabase_engine)

def migrate():
    sqlite_db = SqliteSession()
    supabase_db = SupabaseSession()
    
    try:
        # Guarantee all tables exist on Supabase
        models.Base.metadata.create_all(bind=supabase_engine)
        
        # 1. Migrate Categories
        print("Migrating categories...")
        sqlite_cats = sqlite_db.query(models.Category).all()
        cat_count = 0
        for cat in sqlite_cats:
            exists = supabase_db.query(models.Category).filter_by(id=cat.id).first()
            if not exists:
                new_cat = models.Category(id=cat.id, name=cat.name, emoji=cat.emoji)
                supabase_db.add(new_cat)
                cat_count += 1
        supabase_db.commit()
        print(f"Migrated {cat_count} categories.")

        # 2. Migrate Products
        print("Migrating products...")
        sqlite_products = sqlite_db.query(models.Product).all()
        prod_count = 0
        for prod in sqlite_products:
            exists = supabase_db.query(models.Product).filter_by(id=prod.id).first()
            if not exists:
                new_prod = models.Product(
                    id=prod.id,
                    name=prod.name,
                    brand=prod.brand,
                    category=prod.category,
                    subcategory=prod.subcategory,
                    price=prod.price,
                    mrp=prod.mrp,
                    discount=prod.discount,
                    rating=prod.rating,
                    store=prod.store,
                    affiliate_link=prod.affiliate_link,
                    images=prod.images,
                    colors=prod.colors,
                    sizes=prod.sizes,
                    description=prod.description,
                    featured=prod.featured,
                    trending=prod.trending,
                    deal=prod.deal,
                    views=prod.views,
                    clicks=prod.clicks
                )
                supabase_db.add(new_prod)
                prod_count += 1
            else:
                # Merge stats if product exists
                if (prod.views or 0) > (exists.views or 0) or (prod.clicks or 0) > (exists.clicks or 0):
                    exists.views = max(prod.views or 0, exists.views or 0)
                    exists.clicks = max(prod.clicks or 0, exists.clicks or 0)
                    supabase_db.add(exists)
        supabase_db.commit()
        print(f"Migrated {prod_count} products.")

        # 3. Migrate Users
        print("Migrating users...")
        sqlite_users = sqlite_db.query(models.User).all()
        usr_count = 0
        for usr in sqlite_users:
            exists = supabase_db.query(models.User).filter_by(id=usr.id).first()
            if not exists:
                new_usr = models.User(
                    id=usr.id,
                    name=usr.name,
                    email=usr.email,
                    avatar=usr.avatar,
                    provider=usr.provider
                )
                supabase_db.add(new_usr)
                usr_count += 1
        supabase_db.commit()
        print(f"Migrated {usr_count} users.")

        # 4. Migrate Admin Users
        print("Migrating admins...")
        sqlite_admins = sqlite_db.query(models.AdminUser).all()
        adm_count = 0
        for adm in sqlite_admins:
            exists = supabase_db.query(models.AdminUser).filter_by(id=adm.id).first()
            if not exists:
                new_adm = models.AdminUser(
                    id=adm.id,
                    username=adm.username,
                    hashed_password=adm.hashed_password
                )
                supabase_db.add(new_adm)
                adm_count += 1
        supabase_db.commit()
        print(f"Migrated {adm_count} admins.")
        
        print("Migration complete!")
    except Exception as e:
        supabase_db.rollback()
        print(f"Migration failed: {e}")
    finally:
        sqlite_db.close()
        supabase_db.close()

if __name__ == "__main__":
    migrate()
