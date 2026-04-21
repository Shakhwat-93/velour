import { useState, useEffect } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '../../context/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, ShieldCheck, Globe, Sparkles } from 'lucide-react'

/* ─── Animated floating orbs for left panel ─────────────────────────────── */
function Orb({ cx, cy, r, delay = 0 }: { cx: string; cy: string; r: string; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: cx, top: cy,
        width: r, height: r,
        background: 'radial-gradient(circle, rgba(201,164,114,0.12) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

export default function AdminLogin() {
  const { session } = useAuth()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPwd,  setShowPwd]  = useState(false)
  const [focused,  setFocused]  = useState<'email' | 'password' | null>(null)
  const [time,     setTime]     = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  if (session) return <Navigate to="/admin/dashboard" replace />

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/admin/dashboard')
  }

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="min-h-screen flex font-sans overflow-hidden" style={{ background: '#0b131b' }}>

      {/* ══════════════════════════════════════════════════════════════
          LEFT — Brand Identity Panel
      ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0d1620 0%, #091018 100%)' }}>

        {/* Ambient layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(201,164,114,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,114,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }} />
          {/* Gold horizon line */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,114,0.4), transparent)' }} />
          {/* Corner glows */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(201,164,114,0.06) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(201,164,114,0.04) 0%, transparent 70%)' }} />
        </div>

        {/* Animated orbs */}
        <Orb cx="20%" cy="30%" r="300px" delay={0} />
        <Orb cx="70%" cy="60%" r="250px" delay={2} />
        <Orb cx="50%" cy="80%" r="200px" delay={4} />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-10 py-8">
          {/* Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ background: 'rgba(201,164,114,0.1)', borderColor: 'rgba(201,164,114,0.25)' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4L9 14L16 4" stroke="#c9a472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="text-[12px] font-black tracking-[0.35em] uppercase text-white">Velour</span>
              <p className="text-[8px] font-black tracking-[0.4em] uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>Admin Suite</p>
            </div>
          </div>

          {/* Live clock */}
          <div className="text-right">
            <p className="text-[18px] font-bold tabular-nums tracking-widest" style={{ color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums' }}>{timeStr}</p>
            <p className="text-[9px] font-bold tracking-[0.2em] mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>{dateStr}</p>
          </div>
        </div>

        {/* Center hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-14 pb-10">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px" style={{ background: '#c9a472' }} />
            <span className="text-[9px] font-black tracking-[0.55em] uppercase" style={{ color: '#c9a472' }}>Command Center</span>
          </motion.div>

          {/* Large wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[80px] font-black leading-none tracking-[-0.04em] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'rgba(255,255,255,0.92)' }}>
              Velour
            </h1>
            <p className="text-[14px] font-medium leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Luxury perfume management. Curate your collection, command your orders, and grow your empire.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-3 mt-12"
          >
            {['Product Catalog', 'Order Management', 'Analytics', 'Inventory'].map((pill) => (
              <span
                key={pill}
                className="px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase border"
                style={{
                  background: 'rgba(201,164,114,0.06)',
                  borderColor: 'rgba(201,164,114,0.18)',
                  color: 'rgba(201,164,114,0.7)'
                }}
              >
                {pill}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom status bar */}
        <div className="relative z-10 px-10 py-6 border-t flex items-center justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
              style={{ boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-emerald-400">All Systems Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
            <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
              256-bit SSL
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT — Login Form Panel
      ══════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-[520px] flex flex-col relative"
        style={{ background: '#f5f0ea' }}>

        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,114,0.5), transparent)' }} />

        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center justify-between px-8 py-6 border-b" style={{ borderColor: 'rgba(24,21,17,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border"
              style={{ background: 'rgba(201,164,114,0.1)', borderColor: 'rgba(201,164,114,0.25)' }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M2 4L9 14L16 4" stroke="#c9a472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[12px] font-black tracking-[0.3em] uppercase text-[#181511]">Velour</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] uppercase" style={{ color: '#71675d' }}>
            <Globe size={12} />
            Store
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 py-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 border"
              style={{ background: 'rgba(201,164,114,0.08)', borderColor: 'rgba(201,164,114,0.2)' }}>
              <Sparkles size={11} style={{ color: '#c9a472' }} />
              <span className="text-[9.5px] font-black tracking-[0.35em] uppercase" style={{ color: '#c9a472' }}>Admin Access</span>
            </div>

            <h2 className="text-[32px] font-bold tracking-tight text-[#181511] leading-tight mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Welcome back
            </h2>
            <p className="text-[13px] leading-relaxed" style={{ color: '#71675d' }}>
              Sign in to access your Velour management suite.
            </p>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border"
                  style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <ShieldCheck size={13} style={{ color: '#ef4444' }} />
                  </div>
                  <p className="text-[12px] font-semibold" style={{ color: '#dc2626' }}>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >

            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-black tracking-[0.3em] uppercase mb-2.5" style={{ color: 'rgba(24,21,17,0.4)' }}>
                Email Address
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="admin@velour.luxury"
                  className="w-full h-[52px] pl-5 pr-5 rounded-2xl text-[13px] outline-none transition-all duration-300 border font-medium"
                  style={{
                    background: focused === 'email' ? '#fff' : 'rgba(255,255,255,0.7)',
                    borderColor: focused === 'email' ? '#c9a472' : 'rgba(24,21,17,0.12)',
                    color: '#181511',
                    boxShadow: focused === 'email' ? '0 0 0 4px rgba(201,164,114,0.12), 0 4px 16px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-black tracking-[0.3em] uppercase mb-2.5" style={{ color: 'rgba(24,21,17,0.4)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••••••"
                  className="w-full h-[52px] pl-5 pr-12 rounded-2xl text-[13px] outline-none transition-all duration-300 border font-medium"
                  style={{
                    background: focused === 'password' ? '#fff' : 'rgba(255,255,255,0.7)',
                    borderColor: focused === 'password' ? '#c9a472' : 'rgba(24,21,17,0.12)',
                    color: '#181511',
                    boxShadow: focused === 'password' ? '0 0 0 4px rgba(201,164,114,0.12), 0 4px 16px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: 'rgba(24,21,17,0.3)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c9a472')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(24,21,17,0.3)')}
                >
                  {showPwd ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { y: -2, boxShadow: '0 12px 32px rgba(201,164,114,0.4)' }}
                whileTap={loading ? {} : { scale: 0.98 }}
                className="relative w-full h-[52px] rounded-2xl overflow-hidden flex items-center justify-center gap-3 text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #c9a472 0%, #a07540 100%)',
                  color: '#fff',
                  boxShadow: '0 6px 24px rgba(201,164,114,0.35)',
                }}
              >
                {/* Shimmer overlay */}
                {!loading && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                  />
                )}

                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-10 pt-8 border-t flex items-center justify-between"
            style={{ borderColor: 'rgba(24,21,17,0.08)' }}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600">Encrypted Connection</span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase transition-colors"
              style={{ color: 'rgba(24,21,17,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a472')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(24,21,17,0.3)')}
            >
              <Globe size={12} />
              View Store
            </Link>
          </motion.div>
        </div>

        {/* Bottom footer */}
        <div className="px-8 sm:px-14 py-5 border-t flex items-center justify-between"
          style={{ borderColor: 'rgba(24,21,17,0.06)' }}>
          <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: 'rgba(24,21,17,0.2)' }}>
            © 2026 Velour
          </span>
          <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: 'rgba(24,21,17,0.2)' }}>
            v2.0 — Premium Suite
          </span>
        </div>
      </div>

    </div>
  )
}
