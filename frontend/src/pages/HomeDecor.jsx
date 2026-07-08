import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Tag } from 'lucide-react'
import HomeDecorHero from '../components/HomeDecorHero'
import SectionHeading from '../components/SectionHeading'
import HomeDecorCategoryCard from '../components/HomeDecorCategoryCard'
import HomeDecorProductCard from '../components/HomeDecorProductCard'
import SkeletonCard from '../components/SkeletonCard'
import HomeDecorTrendingCarousel from '../components/HomeDecorTrendingCarousel'
import { useHomeDecorHomeData } from '../hooks/useHomeDecor'

const FEATURES = [
  { icon: Sparkles, title: 'Curated Finds', desc: 'Every piece is hand-picked for quality, design, and lasting comfort — never algorithm-only noise.' },
  { icon: Tag, title: 'Best Price Deals', desc: 'We track prices across stores so the offer you see is genuinely worth clicking through for.' },
  { icon: ShieldCheck, title: 'Trusted Retailers', desc: 'We only link to established platforms — Amazon, Flipkart, Myntra, and AJIO.' },
]

export default function HomeDecor() {
  const { loading, error, data } = useHomeDecorHomeData()
  const categories = { loading, error, data: data.categories }
  const trending = { loading, error, data: data.trending }
  const deals = { loading, error, data: data.deals }
  const featured = { loading, error, data: data.featured }

  return (
    <div>
      <HomeDecorHero />

      <Section id="categories">
        <SectionHeading eyebrow="Browse" title="Home Decor Categories" subtitle="Jump straight into the edit you're looking for." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(categories.data || []).map((c, i) => (
            <HomeDecorCategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </Section>

      <Section tint>
        <SectionHeading eyebrow="Handpicked" title="Trending Decor" subtitle="What everyone's adding to cart across stores right now." />
        <ProductGrid state={trending} />
      </Section>

      <Section>
        <SectionHeading eyebrow="Limited time" title="Today's Deals" subtitle="Flash sales and top discounts — refreshed daily." />
        {deals.loading ? (
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-[240px] flex-shrink-0"><SkeletonCard /></div>)}
          </div>
        ) : (
          <HomeDecorTrendingCarousel products={deals.data} />
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
      {state.data.map((p, i) => <HomeDecorProductCard key={p.id} product={p} index={i} />)}
    </div>
  )
}

function Section({ children, tint, id }) {
  return (
    <section id={id} className={tint ? 'bg-[var(--color-paper-dim)]/60' : ''}>
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">{children}</div>
    </section>
  )
}
