import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ArrowUpRight, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useProducts } from '../hooks/useProducts'
import StoreBadge from './StoreBadge'
import { api } from '../api/client'

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export default function WishlistDrawer({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <motion.div
            key="wishlist-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="wishlist-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col border-l border-[var(--color-line)] bg-white shadow-2xl"
          >
            <WishlistContent onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function WishlistContent({ onClose }) {
  const wishlist = useWishlist()
  const { data: allProducts, loading } = useProducts()

  const likedProducts = allProducts.filter((p) => wishlist.has(p.id))

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-[var(--color-ink)]">My Wishlist</span>
          <span className="rounded-full bg-[var(--color-paper-dim)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-gold-dark)]">
            {wishlist.count}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-[var(--color-ink-soft)] transition hover:bg-[var(--color-paper-dim)] hover:text-[var(--color-ink)]"
          aria-label="Close wishlist"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-gold)] border-t-transparent" />
          </div>
        ) : likedProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-paper-dim)] text-[var(--color-ink-soft)]">
              <ShoppingBag size={24} />
            </div>
            <p className="mt-4 font-display text-base font-semibold text-[var(--color-ink)]">Your wishlist is empty</p>
            <p className="mt-2 max-w-xs text-sm text-[var(--color-ink-soft)]">
              Save items you love here to keep track of deals and compare prices.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-semibold tracking-wider uppercase text-white transition hover:bg-[var(--color-gold-dark)]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {likedProducts.map((product) => {
              const image = Array.isArray(product.images) ? product.images[0] : product.image
              return (
                <div
                  key={product.id}
                  className="flex gap-4 rounded-xl border border-[var(--color-line)] p-3 transition hover:shadow-sm"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-paper-dim)] p-1"
                  >
                    <img src={image} alt={product.name} className="h-full w-full object-contain" />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-soft)]">
                      {product.brand}
                    </p>
                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="truncate font-display text-sm font-semibold text-[var(--color-ink)] hover:underline"
                    >
                      {product.name}
                    </Link>
                    
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-[var(--color-ink)]">
                        {INR.format(product.price)}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-[10px] text-[var(--color-ink-soft)] line-through">
                          {INR.format(product.mrp)}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <StoreBadge store={product.store} />
                      <a
                        href={product.affiliateLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() => api.registerClick(product.id).catch(() => {})}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-gold-dark)] hover:underline"
                      >
                        Buy Now <ArrowUpRight size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => wishlist.toggle(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
