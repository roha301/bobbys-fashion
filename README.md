<div align="center">
  <img src="frontend/public/logo.png" alt="Bobby's Fashion Logo" width="120" height="auto" style="margin-bottom: 20px;" />

  # 👔 Bobby's Fashion 👗
  
  **A luxurious, minimal, and premium fashion discovery & affiliate marketing platform.**
  
  *Curating the finest styles from top stores (Amazon, Myntra, AJIO, Flipkart, Nykaa) into a single, cohesive, premium experience.*
  
  [Live Website](https://bobbys-fashion.vercel.app) • [Admin Portal](https://bobbys-fashion.vercel.app/admin/login)

</div>

---

### 🎨 Frontend
| [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/) | [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/) | [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) |
| :---: | :---: | :---: |
| **React 19** | **Vite** | **Tailwind CSS v4** |

### ⚡ Backend
| [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/) | [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=WMY-YELLOW)](https://www.python.org/) | [![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/) |
| :---: | :---: | :---: |
| **FastAPI** | **Python 3** | **JSON Web Tokens (JWT)** |

### 🗄️ Database & Cloud Storage
| [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/) | [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) |
| :---: | :---: |
| **Supabase** | **PostgreSQL** |

### ☁️ Deployment & Integrations
| [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/) | [![Make](https://img.shields.io/badge/Make.com-6236FF?style=for-the-badge&logoColor=white)](https://www.make.com/) |
| :---: | :---: |
| **Vercel** | **Make.com** |

---

## 📖 Overview

**Bobby's Fashion** addresses a simple problem: fashion shopping online is highly fragmented. Comparing outfits across Amazon, Myntra, AJIO, Nykaa, and Flipkart requires opening dozens of tabs. 

This platform aggregates and curates the finest trending items and daily discounts into a single, unified, premium feed. 

> **Affiliate Model:** This is a discovery-first curation platform rather than an e-commerce store. Clicking **Buy Now** seamlessly redirects users to the host store (via affiliate links) to complete transactions.

---

## ✨ Features

- **💎 High-End Design System:** Premium dark-themed admin layout, glassmorphic public header, sleek cards, and elegant typography (Poppins & Outfit).
- **🛍️ Intelligent Scraper:** Paste an Amazon, Myntra, AJIO, Flipkart, or Nykaa link into the Admin Dashboard, and the system automatically pre-fills the Title, Description, Brand, Price, and Product Images.
- **☁️ Cloud Storage Integration:** Files uploaded via the dashboard are directly stored in a public Supabase Storage bucket, bypassing local filesystem constraints.
- **🔥 Trending, Deals & Featured Sections:** Easily flag products to showcase them in the homepage carousel, editor's picks grid, or daily deals section.
- **🔍 Advanced Search & Filters:** Live search input matching product names, brands, categories, price sorting, and store badges.
- **🔐 Dual-Authentication System:** 
  - **Admin Access:** Protected by standard secure JWT + bcrypt authentication.
  - **User Login:** Supports custom registration/login AND secure **Google Sign-in** popup authentication.
- **📬 Serverless Webhook Notifications:** User messages submitted via the Contact form are routed via a Supabase Database Webhook to Make.com, instantly delivering details to your Gmail.

---

## 🚀 Quick Start Guide

Set up the project locally in less than 5 minutes.

### 1. Start the Backend API
```bash
cd backend
python3 -m venv venv 
source venv/bin/activate       # On Windows use: .\venv\Scripts\activate
pip install -r requirements.txt
python seed.py                 # Seeds database with starting categories
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```

- **Main site:** `http://localhost:5173`
- **Backend API docs (Swagger):** `http://localhost:8000/docs`

---

## 🔌 API Endpoints Reference

The FastAPI server exposes the following RESTful routes under `/api`:

### Products
- `GET /api/products` - Fetch products with query parameters (category, store, brand, featured, trending, deals, and search query).
- `GET /api/products/{id}` - Fetch details of a single product.
- `POST /api/products/{id}/click` - Register click analytics for product redirect links.
- `POST /api/products` *(Admin Token Required)* - Create a new product.
- `PUT /api/products/{id}` *(Admin Token Required)* - Edit product details.
- `DELETE /api/products/{id}` *(Admin Token Required)* - Delete a product.

### Categories
- `GET /api/categories` - Fetch all categories.
- `POST /api/categories` *(Admin Token Required)* - Add a category.
- `PUT /api/categories/{id}` *(Admin Token Required)* - Edit a category name or emoji.
- `DELETE /api/categories/{id}` *(Admin Token Required)* - Remove a category.

### Auth
- `POST /api/auth/user/register` - Create a standard user account.
- `POST /api/auth/user/login` - Standard email/password user login.
- `POST /api/auth/user/google` - Sign in/register securely with Google JWT token.
- `POST /api/auth/login` - Admin dashboard token generation (JWT).
- `GET /api/auth/status` - Returns whether the primary admin user has been configured.

### Utilities
- `POST /api/upload` *(Admin Token Required)* - Uploads product images to Supabase CDN bucket.
- `GET /api/admin/scrape` *(Admin Token Required)* - Initiates the background metadata scraping parser.

---

## 🌍 Environment Variables

Create `.env` files in their respective folders to link your cloud environments.

#### Frontend (`frontend/.env.local`)
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

#### Backend (`backend/.env` & Vercel Dashboard)
```env
DATABASE_URL=postgresql+psycopg://postgres.[project-id]:[password]@[host]:6543/postgres
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_KEY=your-supabase-service-role-secret-key
```
