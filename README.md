# ✨ Bobby Sales

Welcome to **Bobby Sales** — a modern, minimal, and luxurious fashion discovery & affiliate marketing platform. 
*Think Pinterest meets Zara, Nike, and Vogue.* 👗👟

---

## 📖 What is Bobby Sales and Why does it exist?

**The Problem:** Shopping for fashion online is fragmented. If you want to find the perfect outfit, you have to open Amazon, Myntra, AJIO, Nykaa, and Meesho separately, search each one, and compare. It's exhausting!

**The Solution (Bobby Sales):** We've built a single, beautifully curated platform that brings the absolute best fashion pieces from *all* these stores into one unified feed. 
We do the hard work of finding the trending items and the best deals, so the user just enjoys a seamless discovery experience. 

When a user finds something they love, they click "Buy Now" and are seamlessly redirected to the original store (via an affiliate link) to complete their purchase. 

> **Important:** This is *not* an e-commerce store! There are no carts, checkouts, or payment gateways here—just pure discovery, curation, and inspiration.

---

## 🛠️ Tech Stack & Why We Chose It

We wanted this platform to be lightning-fast, easy to maintain, and visually stunning. Here is the technology we used to achieve that:

### Frontend (User Interface)
- ⚛️ **React 19 + Vite:** React allows us to build complex, interactive UI components, while Vite provides an incredibly fast development server and optimized production builds.
- 💅 **Tailwind CSS v4:** Allows us to rapidly style the application with utility classes, keeping our design system consistent and our CSS footprint tiny.
- 🛣️ **React Router:** Provides smooth, instant page transitions without reloading the browser.
- 🎬 **Framer Motion:** Adds buttery-smooth scroll reveals and micro-interactions that give the site a premium, "luxurious" feel.

### Backend (API & Data)
- ⚡ **Python FastAPI:** One of the fastest Python frameworks available. It automatically generates API documentation and handles data validation effortlessly.
- 🗄️ **Supabase PostgreSQL:** A robust, cloud-hosted PostgreSQL database that powers the platform seamlessly.
- 🔐 **JWT (python-jose) & bcrypt:** Industry-standard security for protecting the Admin Dashboard, ensuring only authorized users can add or edit products.

---

## 🚀 Quick Start Guide

Let's get you up and running in minutes!

### 1. Start the Backend API
Open your terminal and run the following:

```bash
cd backend
python3 -m venv venv 
source venv/bin/activate       # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                 # Populates the DB with sample products & an admin user
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend (in a new terminal tab)
```bash
cd frontend
npm install
npm run dev
```

### 3. Explore! 🎉
- **Main Site:** Open `http://localhost:5173` in your browser.
- **Admin Dashboard:** Go to `http://localhost:5173/admin/login` (Login: `admin` / `bobbysales123`)

---

## 💎 What's Included?

- 🎨 **Public Pages:** Hero sections, Trending Categories, Deals, Featured items, and Masonry grids. Live Search and robust category filters (price, brand, store, rating).
- 🎛️ **Admin Dashboard:** Secure portal to manage products (add/edit/delete), handle image uploads, and control toggles for "Featured", "Trending", and "Deals".
- ✨ **Premium Design:** Glassmorphism, rounded cards, sleek typography (Poppins & Inter), and beautiful shimmer loading states.

---

## 🌍 Deploying to Production

- **Frontend:** Run `npm run build` inside `frontend/` → Deploy `dist/` to Vercel, Netlify, or Cloudflare Pages.
- **Backend:** Deploy `backend/` to Render, Railway, or Fly.io. Ensure you set a secure `BOBBY_SALES_SECRET_KEY` environment variable.

---
---
*Curated with style. Built with passion.*

---

## 🛠️ Complete Tech Stack Summary

Here is the final set of technologies used across the entire Bobby Sales platform:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, React Router | Modern, responsive, and luxurious UI with micro-animations and smooth routing |
| **Backend** | Python FastAPI, Uvicorn | High-performance async API server |
| **Database** | Supabase (PostgreSQL) | Secure and scalable cloud-based relational database |
| **Cloud Storage** | Supabase Storage | Bypasses local filesystem constraints to store product images publicly |
| **Authentication** | JWT, bcrypt, Google OAuth | Secure admin logins, custom user registrations, and Google Sign-in popup integration |
| **Deployment** | Vercel | Hosting for both the React frontend and serverless FastAPI backend |
| **Integrations** | Make.com (formerly Integromat) | Webhook automation for sending contact form messages directly to your Gmail |

---

## 🔌 API Endpoints Documentation

The FastAPI backend exposes the following RESTful API endpoints at `/api`:

### 1. Products
- **`GET /api/products`**: Fetch products with optional filtering (by category, store, brand, featured, trending, deals, and query search).
- **`GET /api/products/{id}`**: Fetch details of a single product.
- **`POST /api/products/{id}/click`**: Register a click event for product affiliate links (analytics).
- **`POST /api/products`** *(Admin Token)*: Create a new product.
- **`PUT /api/products/{id}`** *(Admin Token)*: Update an existing product.
- **`DELETE /api/products/{id}`** *(Admin Token)*: Delete a product.

### 2. Categories
- **`GET /api/categories`**: Fetch all available product categories.
- **`POST /api/categories`** *(Admin Token)*: Add a new category.
- **`PUT /api/categories/{id}`** *(Admin Token)*: Edit a category.
- **`DELETE /api/categories/{id}`** *(Admin Token)*: Remove a category.

### 3. User Authentication
- **`POST /api/auth/user/register`**: Register a new user (requires name, email, password, and confirm password on the frontend).
- **`POST /api/auth/user/login`**: Authenticate a user with email and password.
- **`POST /api/auth/user/google`**: Securely authenticate a user with Google OAuth (verifies Google token payload on the server and returns a session JWT).

### 4. Admin Authentication
- **`POST /api/auth/register-first`**: Register the very first admin user (disabled once any admin exists).
- **`POST /api/auth/login`**: Authenticate an admin user and return a JWT access token.
- **`GET /api/auth/status`**: Returns whether an admin account has been configured.

### 5. Miscellaneous
- **`POST /api/upload`** *(Admin Token)*: Upload a product image. Automatically saves to Supabase Storage (public `products` bucket) and returns the public CDN URL.
- **`GET /api/admin/scrape`** *(Admin Token)*: Scrapes product data (Title, Price, Image, Brand) from external shop links (Amazon, Myntra, etc.) for quick auto-fill.
- **`GET /api/health`**: Simple health check endpoint for checking backend live status.

