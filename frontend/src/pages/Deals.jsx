import SectionHeading from '../components/SectionHeading'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import { useProducts } from '../hooks/useProducts'

const SECTIONS = [
  { key: 'today', eyebrow: 'Ends tonight', title: "Today's Deals", subtitle: 'The sharpest discounts we found in the last 24 hours.' },
  { key: 'weekend', eyebrow: 'Sat – Sun', title: 'Weekend Deals', subtitle: 'Save the browsing for the weekend — these prices will hold.' },
  { key: 'festival', eyebrow: 'Seasonal', title: 'Festival Deals', subtitle: 'Occasion-ready fashion at festival pricing.' },
  { key: 'clearance', eyebrow: 'While it lasts', title: 'Clearance', subtitle: 'End-of-season pieces at their lowest prices yet.' },
]

export default function Deals() {
  const { loading, data } = useProducts({ deal: true })

  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 lg:px-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">Bobby Sales · Deals</p>
        <h1 className="max-w-2xl font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
          Deals that are actually worth the click.
        </h1>
      </div>

      {SECTIONS.map((section, idx) => (
        <section key={section.key} className={idx % 2 === 1 ? 'bg-[var(--color-paper-dim)]/60' : ''}>
          <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
            <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
            {loading ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {data
                  .slice()
                  .sort((a, b) => (idx % 2 === 0 ? b.discount - a.discount : a.discount - b.discount))
                  .map((p, i) => <ProductCard key={`${section.key}-${p.id}`} product={p} index={i} />)}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
