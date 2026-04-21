import { Link, useLocation, Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import {
  LayoutDashboard, ShoppingBag, Package, Settings, LogOut,
  ExternalLink, Menu, ShieldCheck, ChevronDown,
  Plus, List, Tags, Sliders, Bell, Globe, X, Activity, Zap
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Navigation Config ──────────────────────────────────────────────────── */
type NavChild = { label: string; href: string; icon: React.ElementType }
type NavItem =
  | { type: 'link'; id: string; label: string; icon: React.ElementType; href: string }
  | { type: 'group'; id: string; label: string; icon: React.ElementType; children: NavChild[] }

const NAV: NavItem[] = [
  {
    type: 'link',
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    type: 'group',
    id: 'catalog',
    label: 'Catalog',
    icon: Package,
    children: [
      { label: 'All Products',  href: '/admin/products',     icon: List },
      { label: 'Add Product',   href: '/admin/products/new', icon: Plus },
      { label: 'Categories',    href: '/admin/categories',   icon: Tags },
    ],
  },
  {
    type: 'link',
    id: 'orders',
    label: 'Orders',
    icon: ShoppingBag,
    href: '/admin/orders',
  },
  {
    type: 'link',
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
]

/* ─── Nav Group (accordion) ─────────────────────────────────────────────── */
function NavGroup({ item, onClose }: { item: NavItem & { type: 'group' }; onClose: () => void }) {
  const location = useLocation()
  const isChildActive = item.children.some(c => location.pathname.startsWith(c.href))
  const [open, setOpen] = useState(isChildActive)

  // Auto-open when navigating directly to a child route
  useEffect(() => {
    if (isChildActive) setOpen(true)
  }, [isChildActive])

  return (
    <li>
      {/* Parent trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
        style={{
          color: isChildActive ? '#c9a472' : 'rgba(255,255,255,0.85)',
          background: isChildActive ? 'rgba(201,164,114,0.1)' : 'transparent',
        }}
        onMouseEnter={e => {
          if (!isChildActive) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = '#fff'
          }
        }}
        onMouseLeave={e => {
          if (!isChildActive) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
          }
        }}
      >
        <item.icon size={17} strokeWidth={1.8} className="shrink-0" />
        <span className="flex-1 text-left text-[13px] font-semibold">{item.label}</span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            color: isChildActive ? '#c9a472' : 'rgba(255,255,255,0.5)',
          }}
        />
      </button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-5 mt-1 mb-1 pl-3 space-y-0.5" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              {item.children.map(child => {
                const isActive = location.pathname === child.href || (child.href !== '/admin/products' && location.pathname.startsWith(child.href))
                return (
                  <li key={child.href}>
                    <Link
                      to={child.href}
                      onClick={onClose}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all duration-200"
                      style={{
                        color: isActive ? '#c9a472' : 'rgba(255,255,255,0.78)',
                        background: isActive ? 'rgba(201,164,114,0.12)' : 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#fff'
                          e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'rgba(255,255,255,0.78)'
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                    >
                      {isActive && (
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: '#c9a472' }} />
                      )}
                      {!isActive && (
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }} />
                      )}
                      {child.label}
                    </Link>
                  </li>
                )
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}

/* ─── Sidebar Content ────────────────────────────────────────────────────── */
function SidebarContent({ onClose, session }: { onClose: () => void; session: any }) {
  const location = useLocation()
  const handleLogout = async () => { await supabase.auth.signOut() }
  const initials = session?.user?.email?.charAt(0).toUpperCase() ?? 'A'
  const username = session?.user?.email?.split('@')[0] ?? 'admin'

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: '#0f1923', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* ── Brand ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Link to="/admin/dashboard" onClick={onClose} className="flex items-center gap-3 flex-1">
          {/* Logo mark */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(201,164,114,0.25), rgba(201,164,114,0.08))',
              border: '1px solid rgba(201,164,114,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M2 4L9 14L16 4" stroke="#c9a472" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-bold tracking-[0.15em] uppercase text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Velour
            </p>
            <p className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Admin Panel
            </p>
          </div>
        </Link>

        {/* Mobile close */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" style={{ scrollbarWidth: 'none' }}>

        {/* Section label */}
        <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.25em] uppercase"
          style={{ color: '#71675d' }}>
          Menu
        </p>

        <ul className="space-y-1">
          {NAV.map(item => {
            if (item.type === 'link') {
              const isActive = location.pathname.startsWith(item.href)
              return (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200"
                    style={{
                      color: isActive ? '#0f1923' : 'rgba(255,255,255,0.85)',
                      background: isActive ? '#c9a472' : 'transparent',
                      boxShadow: isActive ? '0 4px 16px rgba(201,164,114,0.3)' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.color = '#fff'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                      }
                    }}
                  >
                    <item.icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            }

            return <NavGroup key={item.id} item={item} onClose={onClose} />
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 mx-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Store link */}
        <ul className="space-y-1">
          <li>
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Globe size={17} strokeWidth={1.8} className="shrink-0" />
              <span className="flex-1">Live Store</span>
              <ExternalLink size={12} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </Link>
          </li>
        </ul>

        {/* System status mini widget */}
        <div className="mt-4 mx-1 p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[9px] font-black tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>System Status</p>
          <div className="space-y-2">
            {[
              { label: 'API',         value: 'Online',  color: '#10b981', icon: Activity },
              { label: 'Performance', value: '99.8%',   color: '#c9a472', icon: Zap      },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <s.icon size={11} style={{ color: s.color }} />
                  <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* ── User Footer ─────────────────────────────────── */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(201,164,114,0.3), rgba(201,164,114,0.1))', color: '#c9a472' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate">{username}</p>
            <p className="text-[9px] font-bold tracking-widest uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Administrator
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.25)' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ef4444'
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.25)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <LogOut size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Layout ────────────────────────────────────────────────────────── */
export default function AdminLayout() {
  const { session } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentPage = (() => {
    const p = location.pathname
    if (p.includes('/products/new'))                          return 'Add Product'
    if (p.includes('/products/') && p.includes('/edit'))      return 'Edit Product'
    if (p.includes('/products'))   return 'Products'
    if (p.includes('/orders'))     return 'Orders'
    if (p.includes('/categories')) return 'Categories'
    if (p.includes('/settings'))   return 'Settings'
    return 'Dashboard'
  })()

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#f5f0ea', color: '#181511' }}>

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-[240px] fixed inset-y-0 left-0 z-30"
        style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}
      >
        <SidebarContent onClose={() => {}} session={session} />
      </aside>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-[240px] z-50 flex flex-col lg:hidden"
              style={{ boxShadow: '4px 0 40px rgba(0,0,0,0.4)' }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} session={session} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-[240px] flex flex-col min-h-screen">

        {/* Header */}
        <header
          className="h-[60px] sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8"
          style={{
            background: 'rgba(245,240,234,0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(24,21,17,0.08)',
            boxShadow: '0 1px 0 rgba(24,21,17,0.04)',
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border transition-all"
              style={{ background: '#fff', borderColor: 'rgba(24,21,17,0.1)' }}
            >
              <Menu size={18} strokeWidth={1.8} />
            </button>

            <div className="flex items-center gap-2.5">
              <span
                className="hidden sm:block text-[9.5px] font-black tracking-[0.4em] uppercase px-2.5 py-1 rounded-lg"
                style={{ color: '#c9a472', background: 'rgba(201,164,114,0.1)', border: '1px solid rgba(201,164,114,0.2)' }}
              >
                Velour
              </span>
              <span className="hidden sm:block" style={{ color: '#d0c8c0' }}>/</span>
              <h1 className="text-[15px] font-bold text-[#181511] tracking-tight">{currentPage}</h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            <button
              className="relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all"
              style={{ background: '#fff', borderColor: 'rgba(24,21,17,0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,164,114,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(24,21,17,0.1)')}
            >
              <Bell size={15} strokeWidth={1.8} style={{ color: '#71675d' }} />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full" style={{ background: '#c9a472' }} />
            </button>

            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border"
              style={{ background: '#fff', borderColor: 'rgba(24,21,17,0.08)' }}
            >
              <ShieldCheck size={13} className="text-emerald-500" />
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#71675d' }}>Secure</span>
            </div>

            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-[10px] font-bold tracking-[0.15em] uppercase transition-all"
              style={{ background: '#fff', borderColor: 'rgba(24,21,17,0.1)', color: '#71675d' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,164,114,0.4)'
                e.currentTarget.style.color = '#c9a472'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(24,21,17,0.1)'
                e.currentTarget.style.color = '#71675d'
              }}
            >
              Live View
              <ExternalLink size={11} strokeWidth={2.5} />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6 lg:p-10 max-w-[1600px] w-full mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>

        {/* Footer */}
        <footer
          className="px-6 lg:px-10 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(24,21,17,0.06)' }}
        >
          <span className="text-[9.5px] font-bold tracking-widest uppercase" style={{ color: 'rgba(24,21,17,0.2)' }}>
            © 2026 Velour Admin
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-500">Operational</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
