import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { api } from '../../api/client'

export default function AdminSetup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.getAuthStatus()
      .then(({ configured }) => {
        if (configured) navigate('/admin/login', { replace: true })
      })
      .catch(() => {/* backend offline — allow setup attempt */})
      .finally(() => setChecking(false))
  }, [navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await api.registerFirst(username, password)
      navigate('/admin/login', { replace: true })
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('403') || msg.includes('already')) {
        setError('An admin already exists. Go to the login page.')
      } else if (msg.includes('422')) {
        setError('Username must be 3–32 chars; password at least 6.')
      } else {
        setError('Could not connect to the backend. Is it running?')
      }
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 size={28} className="animate-spin text-[var(--color-gold)]" />
      </div>
    )
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
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">First-Time Setup</h1>
          <p className="mt-2 text-sm text-white/50">Create your admin account to manage Bobby Sales.</p>
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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-[var(--color-gold)] focus:bg-white/8"
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
                  placeholder="Min. 6 characters"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-white/25 outline-none transition focus:border-[var(--color-gold)] focus:bg-white/8"
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

            {/* Confirm */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Confirm Password</label>
              <input
                required
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-[var(--color-gold)] focus:bg-white/8"
              />
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
                <>Create Admin Account <ArrowRight size={16} className="transition group-hover:translate-x-0.5" /></>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Already have an account?{' '}
          <a href="/admin/login" className="text-[var(--color-gold)] hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  )
}
