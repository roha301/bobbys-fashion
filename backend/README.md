# 🛍️ Bobby Sales — Backend API

Welcome to the **Bobby Sales** backend! This is the engine that powers our beautiful fashion discovery platform. 🚀

Built with speed and simplicity in mind, this REST API handles everything from products and categories to admin authentication, image uploads, and contact messages. 

---

## 🛠️ Tech Stack

We keep it simple, fast, and modern:
- ⚡ **[FastAPI](https://fastapi.tiangolo.com/)** — A lightning-fast REST API framework for Python.
- 🗄️ **SQLite (Local) & Supabase Postgres (Production)** — Local file for development (`bobby_sales.db`), scaling up to Supabase for production.
- 🔐 **JWT (python-jose)** — Secure admin authentication.
- 🛡️ **bcrypt** — Robust password hashing to keep our admins safe.

---

## 🚀 Getting Started

Follow these easy steps to get the backend running locally on your machine!

### 1. Install Dependencies
First, let's set up a virtual environment and install the required packages.

```bash
cd backend
python3 -m venv venv

# Activate the virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 2. Seed the Database
We don't want an empty store! Let's fill the database with categories, 12 sample fashion products, and a default admin user.

```bash
python seed.py
```

> **🔑 Default Admin Login:**
> - **Username:** `admin`
> - **Password:** `bobbysales123`
> *(Make sure to change this immediately in production!)*

*Optional: If you want to use your own credentials right away, you can set them before running the script:*
```bash
export BOBBY_SALES_ADMIN_USER=youradmin
export BOBBY_SALES_ADMIN_PASSWORD=super-secret-password
python seed.py
```

### 3. Run the Server! 🎉
Start up the FastAPI server:

```bash
uvicorn app.main:app --reload --port 8000
```

**That's it!** The API is now live at `http://127.0.0.1:8000`. 
- 📚 Want to explore the API? Check out the interactive documentation at `http://127.0.0.1:8000/docs`.

*(Note: The frontend's Vite dev server automatically proxies `/api` and `/uploads` to this backend. Just ensure both are running!)*

---

## ⚙️ Environment Variables

Here are the environment variables you can configure:

| Variable | Default | Purpose |
|---|---|---|
| `BOBBY_SALES_SECRET_KEY` | `dev-secret-change-me-in-production` | JWT signing secret — **crucial for production security!** |
| `BOBBY_SALES_ADMIN_USER` | `admin` | Default admin username (created by `seed.py`). |
| `BOBBY_SALES_ADMIN_PASSWORD` | `bobbysales123` | Default admin password (created by `seed.py`). |

---

## 🗺️ API Overview

A quick glance at our available routes:

| Method | Path | Auth | Description |
|---|---|---|---|
| **GET** | `/api/products` | — | List products. Filters available: `category`, `brand`, `store`, `featured`, `trending`, `deal`, `q`, `minPrice`, `maxPrice`, `minRating`, `sort` |
| **GET** | `/api/products/{id}` | — | Get specific product details |
| **POST** | `/api/products` | Admin | Create a new product |
| **PUT** | `/api/products/{id}` | Admin | Update an existing product |
| **DELETE** | `/api/products/{id}` | Admin | Delete a product |
| **GET** | `/api/categories` | — | List all categories |
| **GET** | `/api/search?q=` | — | Search across products |
| **POST** | `/api/auth/login` | — | Admin login → Returns JWT |
| **GET** | `/api/admin/stats` | Admin | Dashboard stats |
| **POST** | `/api/upload` | Admin | Upload a product image |
| **POST** | `/api/contact` | — | Submit contact form |
| **GET** | `/api/health` | — | Server health check |

*(Admin routes expect an `Authorization: Bearer <token>` header obtained from `/api/auth/login`)*

---

## 📁 Project Structure

Here is how our files are organized:

```text
backend/
├── app/
│   ├── main.py            # FastAPI app setup, CORS, static mounts
│   ├── database.py        # SQLAlchemy engine and session management
│   ├── models.py          # Database models (Product, Category, AdminUser)
│   ├── schemas.py         # Pydantic validation models
│   ├── auth.py            # JWT and bcrypt utilities
│   ├── routers/           # API Endpoints
│   │   ├── products.py
│   │   ├── categories.py
│   │   ├── search.py
│   │   ├── auth_router.py
│   │   └── misc.py
│   └── uploads/           # Directory for uploaded product images
├── seed.py                # Database population script
└── requirements.txt       # Python dependencies
```

---

## 🚀 Going to Production? 

Keep these important tips in mind:
1. **Change the Secret:** Swap `BOBBY_SALES_SECRET_KEY` for a long, random value and store it outside of version control.
2. **Database:** While SQLite is great for local development, we strongly recommend using a robust database like **Supabase (PostgreSQL)** for production. You can seamlessly switch to Supabase by setting the `DATABASE_URL` environment variable to your Supabase connection string. (Check out `migrate.py` for easily migrating your local SQLite data straight to Supabase!).
3. **Storage:** Uploaded images are currently stored locally. Move to AWS S3 or Google Cloud Storage before scaling past one server.
4. **CORS:** Update the `allow_origins` list in `main.py` to only include your real frontend domain before deploying. 

---
*Happy Coding! ✨*
