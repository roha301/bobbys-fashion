import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Category from './pages/Category'
import ProductDetails from './pages/ProductDetails'
import Search from './pages/Search'
import Deals from './pages/Deals'
import About from './pages/About'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import { WishlistProvider } from './context/WishlistContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { UserAuthProvider } from './context/UserAuthContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Admin-only routes — no site Navbar or Footer, full-screen dark layout */
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  )
}

import HomeDecor from './pages/HomeDecor'
import HomeDecorCategory from './pages/HomeDecorCategory'
import HomeDecorProductDetails from './pages/HomeDecorProductDetails'

/** Public site routes — wrapped in Navbar + Footer */
function SiteRoutes() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/home-decor" element={<HomeDecor />} />
          <Route path="/home-decor/category/:id" element={<HomeDecorCategory />} />
          <Route path="/home-decor/product/:id" element={<HomeDecorProductDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <UserAuthProvider>
      <AdminAuthProvider>
        <WishlistProvider>
          <ScrollToTop />
          {isAdminRoute ? (
            <Routes>
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          ) : (
            <SiteRoutes />
          )}
        </WishlistProvider>
      </AdminAuthProvider>
    </UserAuthProvider>
  )
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-32 text-center">
      <p className="font-display text-4xl font-semibold text-[var(--color-ink)]">404</p>
      <p className="mt-3 text-sm text-[var(--color-ink-soft)]">This page doesn't exist. Let's get you back to discovering fashion.</p>
      <a href="/" className="mt-6 inline-block rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--color-gold-dark)]">
        Back to home
      </a>
    </div>
  )
}
