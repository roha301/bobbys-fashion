import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ArrowUpRight } from 'lucide-react'
import RatingStars from '../components/RatingStars'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useWishlist } from '../context/WishlistContext'
import { api } from '../api/client'

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export default function ProductDetails() {
  const { id } = useParams()
  const { loading, data: product } = useProduct(id)
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(null)
  const wishlist = useWishlist()

  const related = useProducts(product ? { category: product.category } : {})

  if (loading) {
    return <div className="mx-auto max-w-7xl px-5 py-24 text-center text-sm text-[var(--color-ink-soft)]">Loading product…</div>
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <p className="font-display text-xl text-[var(--color-ink)]">Product not found</p>
        <Link to="/" className="mt-4 inline-block text-sm text-[var(--color-gold-dark)] hover:underline">Back to home</Link>
      </div>
    )
  }

  const images = Array.isArray(product.images) ? product.images : [product.image]
  const wished = wishlist.has(product.id)

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--color-paper-dim)] p-4 flex items-center justify-center">
            <img src={images[activeImage]} alt={product.name} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="mt-4 flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-20 w-16 overflow-hidden rounded-xl border-2 bg-[var(--color-paper-dim)] p-1 ${activeImage === i ? 'border-[var(--color-gold)]' : 'border-transparent'}`}
              >
                <img src={img} alt="" referrerPolicy="no-referrer" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">{product.brand}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <RatingStars rating={product.rating} />
            <span className="text-xs text-[var(--color-ink-soft)]">Sold via {product.store}</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-[var(--color-ink)]">{INR.format(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-[var(--color-ink-soft)] line-through">{INR.format(product.mrp)}</span>
                <span className="rounded-full bg-[var(--color-ink)] px-2.5 py-1 text-xs font-medium text-white">-{product.discount}%</span>
              </>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[var(--color-ink-soft)]">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-medium text-[var(--color-ink)]">Available sizes</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-3.5 py-2 text-xs ${
                      size === s ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white' : 'border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-gold)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium text-[var(--color-ink)]">Available colors</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-3.5 py-2 text-xs ${
                      color === c ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white' : 'border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-gold)]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <a
              href={product.affiliateLink || '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => api.registerClick(product.id).catch(() => {})}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-gold-dark)]"
            >
              Buy on {product.store} <ArrowUpRight size={15} />
            </a>
            <button
              onClick={() => wishlist.toggle(product.id)}
              aria-pressed={wished}
              className="flex items-center justify-center rounded-full border border-[var(--color-line)] px-5 hover:border-[var(--color-gold)]"
            >
              <Heart size={17} className={wished ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-[var(--color-ink)]'} />
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {!related.loading && related.data.filter((p) => String(p.id) !== String(product.id)).length > 0 && (
        <div className="mt-16">
          <SectionHeading title="You may also like" />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {related.data
              .filter((p) => String(p.id) !== String(product.id))
              .slice(0, 4)
              .map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}
