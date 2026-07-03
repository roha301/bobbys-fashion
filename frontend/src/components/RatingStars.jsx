import { Star } from 'lucide-react'

export default function RatingStars({ rating = 0, size = 13, showValue = true }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={n <= Math.round(rating) ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-[var(--color-line)]'}
          />
        ))}
      </div>
      {showValue && <span className="text-xs text-[var(--color-ink-soft)]">{rating.toFixed(1)}</span>}
    </div>
  )
}
