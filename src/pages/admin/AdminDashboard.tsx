import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils/formatPrice'
import {
  Package, ShoppingBag, DollarSign, Users,
  ArrowUpRight, Plus, Clock, Shield, Settings
} from 'lucide-react'

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',   color: '#d97706', bg: '#fef3c7' },
  confirmed: { label: 'Confirmed', color: '#2563eb', bg: '#dbeafe' },
  shipped:   { label: 'Shipped',   color: '#7c3aed', bg: '#ede9fe' },
  delivered: { label: 'Delivered', color: '#059669', bg: '#d1fae5' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2' },
}

function StatCard({
  label, value, icon: Icon, delay
}: {
  label: string; value: string | number; icon: React.ElementType; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-[24px] p-6 sm:p-8"
      style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)' }}>
          <Icon size={20} strokeWidth={1.5} style={{ color: '#181511' }} />
        </div>
      </div>
      <p className="text-[11px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: '#71675d' }}>
        {label}
      </p>
      <p className="text-[28px] sm:text-[32px] font-bold leading-none tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#181511' }}>
        {value}
      </p>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState({ orders: 0, products: 0, revenue: 0, users: 0 })
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [noAdmin, setNoAdmin] = useState(false)

  const fixAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await (supabase as any).from('profiles').update({ role: 'admin' }).eq('id', user.id)
      alert('Elevated to admin. Please refresh.')
      setNoAdmin(false)
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const { count: pc } = await (supabase as any).from('products').select('*', { count: 'exact', head: true })
        const { data: od }  = await (supabase as any).from('orders').select('*').order('created_at', { ascending: false })
        const { count: uc } = await (supabase as any).from('profiles').select('*', { count: 'exact', head: true })
        const { data: pr }  = await (supabase as any).from('profiles').select('role').single()
        const revenue = (od || []).reduce((s: number, o: any) => s + (o.total || 0), 0)
        if (pr && pr.role !== 'admin') setNoAdmin(true)
        setStats({ orders: od?.length || 0, products: pc || 0, revenue, users: uc || 0 })
        setOrders((od || []).slice(0, 5))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(201,164,114,0.2)', borderTopColor: '#c9a472' }} />
      <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: '#71675d' }}>Loading Dashboard...</p>
    </div>
  )

  return (
    <div className="space-y-8 sm:space-y-10 pb-24 sm:pb-32 max-w-[1400px]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6">
        <div>
          <h4 className="text-[10px] font-black tracking-[0.4em] uppercase mb-2 sm:mb-3" style={{ color: '#c9a472' }}>Overview</h4>
          <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#181511', lineHeight: 1.1 }}>
            Dashboard
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 h-12 rounded-xl text-[11px] font-black tracking-[0.1em] uppercase transition-all shadow-md hover:shadow-lg"
          style={{ background: '#181511', color: '#fff' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Product
        </Link>
      </div>

      {noAdmin && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-start gap-4 p-5 rounded-2xl border sm:flex-row sm:items-center sm:justify-between"
          style={{ background: '#fef2f2', borderColor: '#fecaca' }}
        >
          <div className="flex items-center gap-3">
            <Shield size={18} style={{ color: '#dc2626' }} />
            <p className="text-[14px] font-bold" style={{ color: '#991b1b' }}>
              Your account doesn't have admin privileges.
            </p>
          </div>
          <button
            onClick={fixAdmin}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-[11px] font-black tracking-widest uppercase text-white shadow-md"
            style={{ background: '#dc2626' }}
          >
            Fix Now
          </button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="Total Revenue" value={formatPrice(stats.revenue)} icon={DollarSign} delay={0} />
        <StatCard label="Total Orders" value={stats.orders} icon={ShoppingBag} delay={0.05} />
        <StatCard label="Total Products" value={stats.products} icon={Package} delay={0.1} />
        <StatCard label="Customers" value={stats.users} icon={Users} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders List */}
        <div className="xl:col-span-2 rounded-[24px] overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between px-5 sm:px-8 py-6 border-b" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight" style={{ color: '#181511' }}>Recent Orders</h2>
            <Link to="/admin/orders" className="text-[11px] font-black tracking-widest uppercase hover:underline" style={{ color: '#c9a472' }}>
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-24 text-center">
              <Clock size={24} className="mx-auto mb-4" style={{ color: '#a09a90' }} />
              <p className="text-[14px] font-medium" style={{ color: '#71675d' }}>No recent orders</p>
            </div>
          ) : (
            <>
            <div className="sm:hidden divide-y" style={{ borderColor: 'rgba(24,21,17,0.06)' }}>
              {orders.map((o) => {
                const s = STATUS[o.status] || { label: o.status, color: '#71675d', bg: '#f5f0ea' }
                return (
                  <Link
                    key={o.id}
                    to="/admin/orders"
                    className="block px-5 py-4 transition-colors active:bg-[#faf9f7]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold tracking-widest" style={{ color: '#181511' }}>
                          #{o.id.split('-')[0].toUpperCase()}
                        </p>
                        <p className="mt-1 truncate text-[13px] font-bold" style={{ color: '#181511' }}>
                          {o.shipping_address?.firstName || 'Guest'} {o.shipping_address?.lastName || ''}
                        </p>
                      </div>
                      <p className="shrink-0 text-[14px] font-bold" style={{ color: '#181511' }}>{formatPrice(o.total)}</p>
                    </div>
                    <span className="mt-3 inline-flex px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border" style={{ background: s.bg, color: s.color, borderColor: s.color + '40' }}>
                      {s.label}
                    </span>
                  </Link>
                )
              })}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: '#faf9f7', borderBottom: '1px solid rgba(24,21,17,0.06)' }}>
                    <th className="px-5 sm:px-8 py-4 text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: '#a09a90' }}>Order ID</th>
                    <th className="px-5 sm:px-8 py-4 text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: '#a09a90' }}>Customer</th>
                    <th className="px-5 sm:px-8 py-4 text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: '#a09a90' }}>Status</th>
                    <th className="px-5 sm:px-8 py-4 text-[9px] font-black tracking-[0.2em] uppercase text-right" style={{ color: '#a09a90' }}>Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(24,21,17,0.04)' }}>
                  {orders.map((o) => {
                    const s = STATUS[o.status] || { label: o.status, color: '#71675d', bg: '#f5f0ea' }
                    return (
                      <tr key={o.id} className="transition-colors hover:bg-[#faf9f7]" style={{ background: '#fff' }}>
                        <td className="px-5 sm:px-8 py-5">
                          <span className="text-[11px] font-bold tracking-widest" style={{ color: '#181511' }}>
                            #{o.id.split('-')[0].toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 sm:px-8 py-5">
                          <p className="text-[14px] font-bold" style={{ color: '#181511' }}>
                            {o.shipping_address?.firstName || 'Guest'} {o.shipping_address?.lastName || ''}
                          </p>
                        </td>
                        <td className="px-5 sm:px-8 py-5">
                          <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border" style={{ background: s.bg, color: s.color, borderColor: s.color + '40' }}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-5 sm:px-8 py-5 text-right">
                          <p className="text-[15px] font-bold" style={{ color: '#181511' }}>{formatPrice(o.total)}</p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="rounded-[24px] overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
            <div className="px-5 sm:px-8 py-6 border-b" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
              <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight" style={{ color: '#181511' }}>Quick Actions</h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(24,21,17,0.04)' }}>
              {[
                { label: 'Add Product', path: '/admin/products/new', icon: Package },
                { label: 'Categories', path: '/admin/categories', icon: ShoppingBag },
                { label: 'Settings', path: '/admin/settings', icon: Settings },
              ].map(link => (
                <Link key={link.path} to={link.path} className="flex items-center justify-between px-5 sm:px-8 py-5 hover:bg-[#faf9f7] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)' }}>
                      <link.icon size={16} style={{ color: '#71675d' }} />
                    </div>
                    <span className="text-[14px] font-bold" style={{ color: '#181511' }}>{link.label}</span>
                  </div>
                  <ArrowUpRight size={16} className="text-[#a09a90] group-hover:text-[#c9a472] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
