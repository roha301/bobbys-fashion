import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, CheckCircle2 } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useUserAuth } from '../context/UserAuthContext'

export default function UserAuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('login') // login | signup
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const auth = useUserAuth()

  const handleCredentialsSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (tab === 'login') {
        auth.login(email, password)
      } else {
        auth.signup(name, email, password)
      }
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1500)
    }, 1000)
  }

// No manual script injection needed anymore, we use @react-oauth/google

  const handleGoogleClick = async () => {
    // Fallback/Mock trigger
    setLoading(true)
    const mockGoogleData = {
      name: 'Rohan Ghuge',
      email: 'ghugerohan13@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      provider: 'google'
    }
    await auth.loginWithGoogle(mockGoogleData)
    setLoading(false)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      onClose()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-line)] bg-white p-8 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-1.5 text-[var(--color-ink-soft)] transition hover:bg-[var(--color-paper-dim)] hover:text-[var(--color-ink)]"
            >
              <X size={18} />
            </button>

            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="text-[var(--color-gold-dark)]"
                >
                  <CheckCircle2 size={56} className="fill-[var(--color-gold)]/10" />
                </motion.div>
                <p className="mt-5 font-display text-xl font-bold text-[var(--color-ink)]">
                  {tab === 'login' ? 'Welcome Back!' : 'Account Created!'}
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                  You are now signed in to Bobby's Fashion.
                </p>
              </div>
            ) : (
              <div>
                {/* Heading */}
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-bold text-[var(--color-ink)]">
                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                  </h2>
                  <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                    {tab === 'login'
                      ? 'Welcome back to Bobby\'s Fashion hub.'
                      : 'Join us and start discovering the best deals.'}
                  </p>
                </div>

                {/* Google Sign-in */}
                <div className="space-y-4">
                  {/* Official Google Sign-In Button Container */}
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        setLoading(true)
                        try {
                          await auth.loginWithGoogle({ credential: credentialResponse.credential })
                          setLoading(false)
                          setSuccess(true)
                          setTimeout(() => {
                            setSuccess(false)
                            onClose()
                          }, 1500)
                        } catch (err) {
                          console.error('Failed backend google login', err)
                          setLoading(false)
                        }
                      }}
                      onError={() => {
                        console.error('Login Failed')
                      }}
                      useOneTap
                      shape="circle"
                      size="large"
                    />
                  </div>

                  {/* Fallback/Demo Google Login */}
                  <button
                    onClick={handleGoogleClick}
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-full border border-dashed border-[var(--color-line)] bg-white py-2.5 text-xs font-semibold text-[var(--color-ink-soft)] transition hover:bg-[var(--color-paper-dim)] cursor-pointer"
                  >
                    Use Demo Google Account (Instant)
                  </button>

                  {/* Separator */}
                  <div className="relative flex items-center py-2 text-xs uppercase text-[var(--color-ink-soft)]">
                    <div className="flex-grow border-t border-[var(--color-line)]"></div>
                    <span className="mx-4 font-semibold tracking-wider">Or</span>
                    <div className="flex-grow border-t border-[var(--color-line)]"></div>
                  </div>

                  {/* Credentials Form */}
                  <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    {tab === 'signup' && (
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full rounded-full border border-[var(--color-line)] bg-[var(--color-paper-dim)]/50 py-3.5 pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder-white/0 outline-none transition focus:border-[var(--color-gold)] focus:bg-white"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full rounded-full border border-[var(--color-line)] bg-[var(--color-paper-dim)]/50 py-3.5 pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder-white/0 outline-none transition focus:border-[var(--color-gold)] focus:bg-white"
                      />
                    </div>

                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full rounded-full border border-[var(--color-line)] bg-[var(--color-paper-dim)]/50 py-3.5 pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder-white/0 outline-none transition focus:border-[var(--color-gold)] focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full bg-[var(--color-ink)] py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-gold-dark)] disabled:opacity-60"
                    >
                      {loading ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                  </form>
                </div>

                {/* Footer Switch Tab */}
                <p className="mt-6 text-center text-xs text-[var(--color-ink-soft)]">
                  {tab === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setTab('signup')}
                        type="button"
                        className="font-bold text-[var(--color-gold-dark)] hover:underline"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => setTab('login')}
                        type="button"
                        className="font-bold text-[var(--color-gold-dark)] hover:underline"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
