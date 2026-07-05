import { Link } from 'react-router-dom'
import { Camera, Share2, Hash, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)] bg-[var(--color-paper-dim)]">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Bobby's Fashion" className="h-8 w-auto object-contain" />
              <span className="font-display text-base font-semibold tracking-tight text-[var(--color-ink)]">
                Bobby's <span className="text-[var(--color-gold-dark)]">Fashion</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-[var(--color-ink-soft)]">
              A curated fashion discovery destination. We don't sell — we point you to the best deal, wherever it lives.
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-medium text-[var(--color-ink)]">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-ink-soft)]">
              <li><Link to="/category/women" className="hover:text-[var(--color-gold-dark)]">Women</Link></li>
              <li><Link to="/category/men" className="hover:text-[var(--color-gold-dark)]">Men</Link></li>
              <li><Link to="/deals" className="hover:text-[var(--color-gold-dark)]">Deals</Link></li>
              <li><Link to="/search" className="hover:text-[var(--color-gold-dark)]">Search</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-medium text-[var(--color-ink)]">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-ink-soft)]">
              <li><Link to="/about" className="hover:text-[var(--color-gold-dark)]">About</Link></li>
              <li><Link to="/admin/login" className="hover:text-[var(--color-gold-dark)]">Admin</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-medium text-[var(--color-ink)]">Follow</p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="rounded-full border border-[var(--color-line)] p-2 hover:border-[var(--color-gold)]"><Camera size={15} /></a>
              <a href="#" aria-label="Facebook" className="rounded-full border border-[var(--color-line)] p-2 hover:border-[var(--color-gold)]"><Share2 size={15} /></a>
              <a href="#" aria-label="Twitter" className="rounded-full border border-[var(--color-line)] p-2 hover:border-[var(--color-gold)]"><Hash size={15} /></a>
              <a href="https://t.me/bobbyfashionhub" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="rounded-full border border-[var(--color-line)] p-2 hover:border-[var(--color-gold)]"><Send size={15} /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bobby Sales. All rights reserved.</p>
          <p className="max-w-xl">
            Bobby Sales is a discovery platform. Product links may be affiliate links — we may earn a commission when
            you purchase through a partner store, at no extra cost to you. All purchases are completed on the partner's site.
          </p>
        </div>
      </div>
    </footer>
  )
}
