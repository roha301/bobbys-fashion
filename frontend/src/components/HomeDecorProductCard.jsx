import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowUpRight } from 'lucide-react'
import RatingStars from './RatingStars'
import StoreBadge from './StoreBadge'
import { useWishlist } from '../context/WishlistContext'
import { homeDecorApi } from '../api/homeDecorClient'

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export default function HomeDecorProductCard({ product, index = 0 }) {
  const wishlist = useWishlist()
  const wished = wishlist.has(product.id)
  const image = Array.isArray(product.images) ? product.images[0] : product.image

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3), ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-18px_rgba(13,13,13,0.25)]"
    >
      <Link to={`/home-decor/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-[var(--color-paper-dim)] p-2">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-ink)] px-2.5 py-1 text-[11px] font-medium text-white">
            -{product.discount}%
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            wishlist.toggle(product.id)
          }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className="glass absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
        >
          <Heart size={15} className={wished ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-[var(--color-ink)]'} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[11px] uppercase tracking-wide text-[var(--color-ink-soft)]">{product.brand}</p>
            <Link to={`/home-decor/product/${product.id}`} className="line-clamp-2 font-display text-sm font-medium leading-snug text-[var(--color-ink)] hover:underline decoration-[var(--color-gold)] underline-offset-4">
              {product.name}
            </Link>
          </div>
        </div>

        <RatingStars rating={product.rating} />

        <div className="flex items-baseline gap-2">
          <span className="font-display text-base font-semibold text-[var(--color-ink)]">{INR.format(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-[var(--color-ink-soft)] line-through">{INR.format(product.mrp)}</span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <StoreBadge store={product.store} />
        </div>

        <a
          href={product.affiliateLink || '#'}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={(e) => {
            e.stopPropagation()
            homeDecorApi.registerClick(product.id).catch(() => {})
          }}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--color-ink)] px-4 py-2.5 text-xs font-medium tracking-wide text-white transition-colors duration-200 hover:bg-[var(--color-gold-dark)]"
        >
          Buy Now <ArrowUpRight size={13} />
        </a>
      </div>
    </motion.div>
  )
}
