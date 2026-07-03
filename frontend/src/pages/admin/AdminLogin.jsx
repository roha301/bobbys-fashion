import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { api } from '../../api/client'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = useAdminAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { access_token } = await api.login(username, password)
      auth.login(access_token)
      navigate('/admin/dashboard')
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('401')) {
        setError('Invalid username or password.')
      } else {
        setError('Cannot reach backend. Make sure the server is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-5 py-16">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold)] opacity-[0.06] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] shadow-lg shadow-[var(--color-gold)]/20">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-white/50">Manage products, categories and deals for Bobby Sales.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <form onSubmit={submit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Username</label>
              <input
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-[var(--color-gold)]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-white/25 outline-none transition focus:border-[var(--color-gold)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-gold)]/20 transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} className="transition group-hover:translate-x-0.5" /></>
              )}
            </button>
          </form>
        </div>

        {/* Credentials help note */}
        <div className="mt-6 text-center text-xs text-white/40">
          <p className="font-semibold text-white/60">Admin Credentials for Testing:</p>
          <p className="mt-1">Username: <span className="font-mono text-[var(--color-gold)] select-all">bobbyfashionhub</span></p>
          <p>Password: <span className="font-mono text-[var(--color-gold)] select-all">bobbyfashion@1234</span></p>
        </div>

      </div>
    </div>
  )
}
