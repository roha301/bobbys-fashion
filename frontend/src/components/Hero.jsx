import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const TILES = [
  'https://picsum.photos/seed/hero1/500/650',
  'https://picsum.photos/seed/hero2/500/650',
  'https://picsum.photos/seed/hero3/500/650',
  'https://picsum.photos/seed/hero4/500/650',
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid grid-cols-4 opacity-[0.14]">
        {TILES.map((src, i) => (
          <img key={i} src={src} alt="" className="h-full w-full object-cover" />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 via-[var(--color-paper)]/85 to-[var(--color-paper)]" />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 text-center lg:px-8 lg:pb-24 lg:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-gold-dark)]"
        >
          Curated across Amazon · Myntra · AJIO · Flipkart · Nykaa
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-[var(--color-ink)] sm:text-5xl lg:text-6xl"
        >
          Discover Fashion You'll Love.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-base text-[var(--color-ink-soft)]"
        >
          Find trending fashion, compare products, and shop smarter with curated recommendations from stores you already trust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/category/women" className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-gold-dark)]">
            Shop Women
          </Link>
          <Link to="/category/men" className="rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]">
            Shop Men
          </Link>
          <Link to="/deals" className="group inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
            Explore Trends <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
