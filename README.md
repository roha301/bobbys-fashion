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
*Curated with style. Built with passion.*
