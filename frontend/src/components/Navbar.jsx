import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Heart, Menu, X, ShieldCheck, User, LogOut } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useUserAuth } from '../context/UserAuthContext'
import WishlistDrawer from './WishlistDrawer'
import UserAuthModal from './UserAuthModal'

const LINKS = [
  { to: '/category/women', label: 'Women' },
  { to: '/category/men', label: 'Men' },
  { to: '/deals', label: 'Deals' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const navigate = useNavigate()
  const wishlist = useWishlist()
  const { isAuthed } = useAdminAuth()
  const { user, logout } = useUserAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-[0_1px_0_var(--color-line)]' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Bobby's Fashion" className="h-8 w-auto object-contain" />
          <span className="font-display text-base font-semibold tracking-tight text-[var(--color-ink)]">
            Bobby's <span className="text-[var(--color-gold-dark)]">Fashion</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={submitSearch} className="hidden items-center rounded-full border border-[var(--color-line)] bg-white/80 px-3 py-2 sm:flex">
            <Search size={15} className="text-[var(--color-ink-soft)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="ml-2 w-40 bg-transparent text-sm outline-none placeholder:text-[var(--color-ink-soft)] lg:w-56"
              aria-label="Search products"
            />
          </form>

          <Link to="/search" className="rounded-full border border-[var(--color-line)] p-2.5 sm:hidden" aria-label="Search">
            <Search size={17} />
          </Link>

          <button
            onClick={() => setWishlistOpen(true)}
            className="relative rounded-full border border-[var(--color-line)] p-2.5"
            aria-label="Wishlist"
          >
            <Heart size={17} />
            {wishlist.count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-gold)] text-[9px] font-semibold text-white">
                {wishlist.count}
              </span>
            )}
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex h-9 w-9 overflow-hidden rounded-full border border-[var(--color-line)] transition hover:border-[var(--color-gold)] cursor-pointer"
                aria-label="User menu"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--color-paper-dim)] text-[var(--color-gold-dark)] text-xs font-bold">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[var(--color-line)] bg-white p-3 shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-[var(--color-line)] mb-2">
                    <p className="text-xs font-bold text-[var(--color-ink)] truncate">{user.name || user.email || 'User'}</p>
                    <p className="text-[10px] text-[var(--color-ink-soft)] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setUserMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition cursor-pointer"
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-full border border-[var(--color-line)] p-2.5 text-[var(--color-ink-soft)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)] cursor-pointer"
              aria-label="User sign in"
              title="Sign In"
            >
              <User size={17} />
            </button>
          )}

          {/* Admin link — subtle icon */}
          <Link
            to={isAuthed ? '/admin/dashboard' : '/admin/login'}
            className="rounded-full border border-[var(--color-line)] p-2.5 text-[var(--color-ink-soft)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
            aria-label="Admin panel"
            title={isAuthed ? 'Admin Dashboard' : 'Admin Login'}
          >
            <ShieldCheck size={17} />
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-[var(--color-line)] p-2.5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass border-t border-[var(--color-line)] px-5 py-4 lg:hidden">
          <form onSubmit={submitSearch} className="mb-4 flex items-center rounded-full border border-[var(--color-line)] bg-white px-3 py-2">
            <Search size={15} className="text-[var(--color-ink-soft)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="ml-2 w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-ink)]">
                {l.label}
              </Link>
            ))}
            <Link
              to={isAuthed ? '/admin/dashboard' : '/admin/login'}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--color-gold-dark)]"
            >
              <ShieldCheck size={15} />
              {isAuthed ? 'Admin Dashboard' : 'Admin'}
            </Link>
          </div>
        </div>
      )}
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <UserAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  )
}
