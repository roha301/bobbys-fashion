"""
Seed the Home Decor database with categories and products.
This file is completely separate from seed.py and only populates
the home_decor_categories and home_decor_products tables.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app.database import Base, engine, SessionLocal
from app.models_home_decor import HomeDecorCategory, HomeDecorProduct

Base.metadata.create_all(bind=engine)

CATEGORIES = [
    {"id": "bedding", "name": "Bedding & Linen", "emoji": "🛏️"},
    {"id": "lighting", "name": "Lighting & Lamps", "emoji": "💡"},
    {"id": "wall_decor", "name": "Wall Decor & Art", "emoji": "🖼️"},
    {"id": "kitchen_dining", "name": "Kitchen & Dining", "emoji": "🍽️"},
    {"id": "rugs_carpets", "name": "Rugs & Carpets", "emoji": "🧶"},
    {"id": "showpieces_vases", "name": "Showpieces & Vases", "emoji": "🏺"},
]

def hd_img(query, index):
    # Use Unsplash source imagery for beautiful home decor images
    # We use source.unsplash.com or standard unsplash premium URLs with specific IDs for reliable loading
    images = {
        "bedding": [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80",
        ],
        "lighting": [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80",
        ],
        "wall_decor": [
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80",
        ],
        "kitchen_dining": [
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=600&auto=format&fit=crop&q=80",
        ],
        "rugs_carpets": [
            "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=600&auto=format&fit=crop&q=80",
        ],
        "showpieces_vases": [
            "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1581781870027-04212e231e96?w=600&auto=format&fit=crop&q=80",
        ],
    }
    category_images = images.get(query, [])
    if index < len(category_images):
        return category_images[index]
    return f"https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"  # Fallback cozy room

PRODUCTS = [
    # Bedding
    dict(
        name="Luxury Egyptian Cotton Bedsheet",
        brand="Solimo Home",
        category="bedding",
        price=1899,
        mrp=3499,
        discount=45,
        rating=4.7,
        store="Amazon",
        featured=True,
        trending=True,
        deal=True,
        images=[hd_img("bedding", 0), hd_img("bedding", 1)],
        colors=["Pure White", "Slate Grey", "Blush Pink"],
        sizes=["Double", "King", "Single"],
        description="Crafted from 100% long-staple Egyptian cotton, this 400 thread count bedsheet offers cloud-like softness and durable breathability.",
        affiliate_link="https://www.amazon.in/"
    ),
    dict(
        name="All-Season Microfiber Comforter",
        brand="SleepyCat",
        category="bedding",
        price=2199,
        mrp=3999,
        discount=45,
        rating=4.5,
        store="Flipkart",
        featured=False,
        trending=True,
        deal=False,
        images=[hd_img("bedding", 1), hd_img("bedding", 0)],
        colors=["Grey & White", "Blue & Teal"],
        sizes=["Double", "Single"],
        description="Hypoallergenic comforter filled with 200 GSM hollow siliconized polyester microfiber. Box-stitched for uniform warmth.",
        affiliate_link="https://www.flipkart.com/"
    ),
    
    # Lighting
    dict(
        name="Minimalist Wooden Tripod Floor Lamp",
        brand="DeLight",
        category="lighting",
        price=3299,
        mrp=5999,
        discount=45,
        rating=4.6,
        store="Amazon",
        featured=True,
        trending=True,
        deal=False,
        images=[hd_img("lighting", 0), hd_img("lighting", 1)],
        colors=["Natural Oak", "Walnut Brown"],
        sizes=["Standard"],
        description="Elevate your living room aesthetics with this handcrafted wooden tripod floor lamp, complete with a premium flaxen fabric drum shade.",
        affiliate_link="https://www.amazon.in/"
    ),
    dict(
        name="Nordic Ceramic Pendant Light",
        brand="ArtisanCraft",
        category="lighting",
        price=1499,
        mrp=2499,
        discount=40,
        rating=4.4,
        store="Myntra",
        featured=False,
        trending=False,
        deal=True,
        images=[hd_img("lighting", 1), hd_img("lighting", 0)],
        colors=["Matte White", "Sage Green", "Peach"],
        sizes=["Single Pendant"],
        description="Scandinavian design pendant light crafted from clay with a warm wooden accent. Perfect for kitchen islands or dining tables.",
        affiliate_link="https://www.myntra.com/"
    ),

    # Wall Decor
    dict(
        name="Abstract Canvas Wall Painting (3-Piece)",
        brand="CraftStore",
        category="wall_decor",
        price=1299,
        mrp=2999,
        discount=56,
        rating=4.3,
        store="Flipkart",
        featured=False,
        trending=True,
        deal=True,
        images=[hd_img("wall_decor", 0), hd_img("wall_decor", 1)],
        colors=["Multicolor"],
        sizes=["12x18 inches each"],
        description="High-definition canvas print stretched on wooden frames. Modern minimalist abstract design to rejuvenate empty walls.",
        affiliate_link="https://www.flipkart.com/"
    ),
    dict(
        name="Vintage Brass Wall Mirror",
        brand="OrnateHome",
        category="wall_decor",
        price=2799,
        mrp=4500,
        discount=37,
        rating=4.8,
        store="Amazon",
        featured=True,
        trending=False,
        deal=False,
        images=[hd_img("wall_decor", 1), hd_img("wall_decor", 0)],
        colors=["Antique Gold"],
        sizes=["24 inches diameter"],
        description="Stunning circular wall mirror surrounded by an intricately designed antique brass border. A classic statement piece.",
        affiliate_link="https://www.amazon.in/"
    ),

    # Kitchen & Dining
    dict(
        name="Handcrafted Ceramic Dinner Set (18-Piece)",
        brand="Clay & Co.",
        category="kitchen_dining",
        price=4599,
        mrp=7999,
        discount=42,
        rating=4.7,
        store="Amazon",
        featured=True,
        trending=True,
        deal=False,
        images=[hd_img("kitchen_dining", 0), hd_img("kitchen_dining", 1)],
        colors=["Glazed Teal", "Matte Charcoal"],
        sizes=["18-Piece Set"],
        description="Elegant lead-free ceramic dining set containing dinner plates, salad plates, and bowls. Microwave and dishwasher safe.",
        affiliate_link="https://www.amazon.in/"
    ),
    dict(
        name="Eco-Friendly Bamboo Salad Bowl Set",
        brand="NatureCore",
        category="kitchen_dining",
        price=1199,
        mrp=1999,
        discount=40,
        rating=4.5,
        store="Myntra",
        featured=False,
        trending=True,
        deal=True,
        images=[hd_img("kitchen_dining", 1), hd_img("kitchen_dining", 0)],
        colors=["Natural Wood"],
        sizes=["Large Bowl + Servers"],
        description="Durable organic bamboo salad bowl set with serving spoons. 100% natural, biodegradable, and food-safe finish.",
        affiliate_link="https://www.myntra.com/"
    ),

    # Rugs & Carpets
    dict(
        name="Traditional Persian Area Rug",
        brand="WeaveMagic",
        category="rugs_carpets",
        price=5999,
        mrp=11999,
        discount=50,
        rating=4.9,
        store="Amazon",
        featured=True,
        trending=True,
        deal=False,
        images=[hd_img("rugs_carpets", 0), hd_img("rugs_carpets", 1)],
        colors=["Crimson Red", "Royal Blue"],
        sizes=["5x7 feet", "4x6 feet"],
        description="Rich, classic Persian motifs woven with high-density fibers for a luxurious feel underfoot and long-lasting durability.",
        affiliate_link="https://www.amazon.in/"
    ),
    dict(
        name="Boho Chic Handwoven Jute Rug",
        brand="WeaveMagic",
        category="rugs_carpets",
        price=2299,
        mrp=3999,
        discount=42,
        rating=4.4,
        store="Ajio",
        featured=False,
        trending=False,
        deal=True,
        images=[hd_img("rugs_carpets", 1), hd_img("rugs_carpets", 0)],
        colors=["Natural Tan"],
        sizes=["4 feet Round"],
        description="Eco-friendly circular rug braided from 100% natural jute fibers. Add a rustic, coastal charm to your study or entryway.",
        affiliate_link="https://www.ajio.com/"
    ),

    # Showpieces & Vases
    dict(
        name="Modern Ceramic Origami Vase Trio",
        brand="ArtisanCraft",
        category="showpieces_vases",
        price=1599,
        mrp=2999,
        discount=46,
        rating=4.6,
        store="Myntra",
        featured=True,
        trending=True,
        deal=True,
        images=[hd_img("showpieces_vases", 0), hd_img("showpieces_vases", 1)],
        colors=["Pastel Trio (Pink, Blue, Grey)"],
        sizes=["Set of 3"],
        description="Stunning geometric origami-style vases. Beautiful as stand-alone sculptures or styled with dried pampas grass.",
        affiliate_link="https://www.myntra.com/"
    ),
    dict(
        name="Handcrafted Brass Meditating Buddha Statue",
        brand="DivineArte",
        category="showpieces_vases",
        price=1899,
        mrp=2999,
        discount=36,
        rating=4.7,
        store="Amazon",
        featured=False,
        trending=True,
        deal=False,
        images=[hd_img("showpieces_vases", 1), hd_img("showpieces_vases", 0)],
        colors=["Metallic Brass"],
        sizes=["8 inches height"],
        description="Bring tranquility and mindfulness to your home office or entryway with this solid brass Buddha figurine.",
        affiliate_link="https://www.amazon.in/"
    )
]

def run():
    db = SessionLocal()
    try:
        if db.query(HomeDecorCategory).count() == 0:
            for c in CATEGORIES:
                db.add(HomeDecorCategory(**c))
            print(f"Seeded {len(CATEGORIES)} Home Decor categories")

        if db.query(HomeDecorProduct).count() == 0:
            for p in PRODUCTS:
                db.add(HomeDecorProduct(**p))
            print(f"Seeded {len(PRODUCTS)} Home Decor products")

        db.commit()
        print("Home Decor Seeding complete.")
    finally:
        db.close()

if __name__ == "__main__":
    run()
