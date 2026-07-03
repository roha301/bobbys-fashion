import { motion } from 'framer-motion'
import { Compass, ShieldCheck, ExternalLink } from 'lucide-react'

const POINTS = [
  { icon: Compass, title: 'We help you discover', desc: "Bobby Sales curates fashion from stores you already trust, so you don't have to hop between ten tabs to find the good stuff." },
  { icon: ShieldCheck, title: 'We only feature trusted stores', desc: 'Every product we show comes from an established platform — Amazon, Myntra, AJIO, Flipkart, Meesho and Nykaa.' },
  { icon: ExternalLink, title: 'We never sell directly', desc: 'Bobby Sales is a discovery layer, not a store. When you tap "Buy Now," you complete your purchase on the partner site.' },
]

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">About us</p>
      <h1 className="font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
        We're a discovery layer for fashion, not a store.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-ink-soft)]">
        Bobby Sales helps you find fashion worth buying — pulled together from stores across the internet and presented in
        one clean, curated place. We compare, we surface the best deals, and we send you onward to buy from the store
        that has it. Purchases happen through our partner stores, never through us.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {POINTS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-2xl border border-[var(--color-line)] bg-white p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-paper-dim)] text-[var(--color-gold-dark)]">
              <p.icon size={18} />
            </span>
            <p className="mt-4 font-display text-base font-semibold text-[var(--color-ink)]">{p.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{p.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-dim)] p-7">
        <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Affiliate disclosure</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
          Some links on Bobby Sales are affiliate links. If you make a purchase through one of these links, we may earn a
          small commission — at no additional cost to you. This helps us keep curating and comparing, for free, for you.
        </p>
      </div>
    </div>
  )
}
