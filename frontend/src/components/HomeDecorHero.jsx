import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const TILES = [
  '/categories/living_room.png',
  '/categories/bedroom.png',
  '/categories/lighting.png',
  '/categories/kitchen_dining.png',
]

export default function HomeDecorHero() {
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
          Curated across Amazon · Flipkart · Myntra · AJIO
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-[var(--color-ink)] sm:text-5xl lg:text-6xl"
        >
          Transform Your Space. Elevate Your Home.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-base text-[var(--color-ink-soft)]"
        >
          Discover curated home decor products, premium beddings, modern lighting, and beautiful showpieces from brands and stores you trust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/home-decor/category/living_room" className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-gold-dark)]">
            Living Room
          </Link>
          <Link to="/home-decor/category/bedroom" className="rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]">
            Bedroom
          </Link>
          <a href="#categories" className="group inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
            View All Categories <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
