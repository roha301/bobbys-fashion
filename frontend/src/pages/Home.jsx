import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Tag } from 'lucide-react'
import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import TrendingCarousel from '../components/TrendingCarousel'
import { useProducts, useCategories } from '../hooks/useProducts'

const FEATURES = [
  { icon: Sparkles, title: 'Curated Products', desc: 'Every piece is hand-picked for quality, fit, and lasting style — never algorithm-only noise.' },
  { icon: Tag, title: 'Best Deals', desc: 'We track prices across stores so the offer you see is genuinely worth clicking through for.' },
  { icon: ShieldCheck, title: 'Trusted Stores', desc: 'We only link to established platforms — Amazon, Myntra, AJIO, Flipkart, Meesho and Nykaa.' },
]

export default function Home() {
  const categories = useCategories()
  const trending = useProducts({ trending: true })
  const deals = useProducts({ deal: true })
  const featured = useProducts({ featured: true })

  return (
    <div>
      <Hero />

      <Section>
        <SectionHeading eyebrow="Browse" title="Trending Categories" subtitle="Jump straight into the edit you're shopping for." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {(categories.data || []).map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </Section>

      <Section tint>
        <SectionHeading eyebrow="Handpicked" title="Trending Products" subtitle="What everyone's adding to cart across stores right now." />
        <ProductGrid state={trending} />
      </Section>

      <Section>
        <SectionHeading eyebrow="Limited time" title="Today's Deals" subtitle="Flash sales and top discounts — refreshed daily." />
        {deals.loading ? (
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-[240px] flex-shrink-0"><SkeletonCard /></div>)}
          </div>
        ) : (
          <TrendingCarousel products={deals.data} />
        )}
      </Section>

      <Section tint>
        <SectionHeading eyebrow="Editor's picks" title="Featured This Week" subtitle="Our favorite finds, curated by the Bobby Sales team." />
        <ProductGrid state={featured} />
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-2xl border border-[var(--color-line)] bg-white p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-paper-dim)] text-[var(--color-gold-dark)]">
                <f.icon size={18} />
              </span>
              <p className="mt-4 font-display text-base font-semibold text-[var(--color-ink)]">{f.title}</p>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function ProductGrid({ state }) {
  if (state.loading) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {state.data.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  )
}

function Section({ children, tint }) {
  return (
    <section className={tint ? 'bg-[var(--color-paper-dim)]/60' : ''}>
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">{children}</div>
    </section>
  )
}
