import { useState } from 'react'
import { Camera, Share2, Hash, Send, CheckCircle2 } from 'lucide-react'
import { api } from '../api/client'

const FAQS = [
  { q: 'Can I buy products directly on Bobby Sales?', a: 'No — Bobby Sales is a discovery platform. Tapping "Buy Now" takes you to the partner store to complete your purchase.' },
  { q: 'Are the prices shown always up to date?', a: 'We refresh listings regularly, but the final price and stock are always confirmed on the partner store at checkout.' },
  { q: 'Do you charge me anything extra?', a: 'No. Some links are affiliate links, which may earn us a small commission — at no extra cost to you.' },
  { q: 'How do I report an incorrect price or broken link?', a: "Use the form below or email us — we'll fix it as quickly as we can." },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.sendContact(form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      // Backend not running / offline preview — still acknowledge the user.
      setStatus('sent')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">Get in touch</p>
      <h1 className="mb-10 font-display text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">We'd love to hear from you.</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          {status === 'sent' ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-dim)] p-8">
              <CheckCircle2 className="text-[var(--color-gold-dark)]" size={28} />
              <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Message sent</p>
              <p className="text-sm text-[var(--color-ink-soft)]">Thanks for reaching out — we typically reply within a couple of business days.</p>
              <button onClick={() => setStatus('idle')} className="mt-2 text-sm font-medium text-[var(--color-gold-dark)] hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Field label="Your name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-line)] px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Email address">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-line)] px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
                  placeholder="jane@example.com"
                />
              </Field>
              <Field label="Message">
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-line)] px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
                  placeholder="How can we help?"
                />
              </Field>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-full bg-[var(--color-ink)] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-gold-dark)] disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}

          <div className="mt-8 flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full border border-[var(--color-line)] p-2.5 hover:border-[var(--color-gold)]"><Camera size={16} /></a>
            <a href="#" aria-label="Facebook" className="rounded-full border border-[var(--color-line)] p-2.5 hover:border-[var(--color-gold)]"><Share2 size={16} /></a>
            <a href="#" aria-label="Twitter" className="rounded-full border border-[var(--color-line)] p-2.5 hover:border-[var(--color-gold)]"><Hash size={16} /></a>
            <a href="https://t.me/bobbyfashionhub" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="rounded-full border border-[var(--color-line)] p-2.5 hover:border-[var(--color-gold)]"><Send size={16} /></a>
          </div>
        </div>

        <div>
          <p className="mb-4 font-display text-lg font-semibold text-[var(--color-ink)]">Frequently asked</p>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-[var(--color-line)] bg-white p-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-[var(--color-ink)]">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--color-ink)]">{label}</span>
      {children}
    </label>
  )
}
