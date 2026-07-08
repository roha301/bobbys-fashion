import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function HomeDecorCategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        to={`/home-decor/category/${category.id}`}
        className="group flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-white px-5 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-[0_16px_32px_-16px_rgba(184,147,95,0.35)]"
      >
        <span className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[var(--color-line)] bg-[var(--color-paper-dim)] transition-transform duration-300 group-hover:scale-110">
          <img
            src={`/categories/${category.id}.png`}
            alt={category.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <span className="hidden h-full w-full items-center justify-center text-3xl">
            {category.emoji}
          </span>
        </span>
        <span className="font-display text-sm font-semibold tracking-wide text-[var(--color-ink)]">{category.name}</span>
      </Link>
    </motion.div>
  )
}
