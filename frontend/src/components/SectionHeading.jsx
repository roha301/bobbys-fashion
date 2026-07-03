import { motion } from 'framer-motion'

export default function SectionHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">{eyebrow}</p>
        )}
        <h2 className="gold-thread font-display text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-3 max-w-xl text-sm text-[var(--color-ink-soft)]">{subtitle}</p>}
      </motion.div>
      {action}
    </div>
  )
}
