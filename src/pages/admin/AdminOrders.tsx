import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils/formatPrice'
import { Search, ChevronDown, Eye, X, Package, MapPin, ShoppingBag, Calendar, User, CreditCard, ExternalLink, Box, Activity, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const statusStyle: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-600 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
  shipped:   'bg-purple-50 text-purple-600 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

function StatusDropdown({ 
  status, 
  orderId, 
  onUpdate, 
  updating 
}: { 
  status: string; 
  orderId: string; 
  onUpdate: (id: string, s: string) => void; 
  updating: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <motion.button
        whileTap={{ scale: 0.98 }}
        disabled={updating}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 h-10 rounded-full text-[10px] font-black tracking-[0.1em] uppercase transition-all border shadow-sm ${statusStyle[status] || statusStyle.pending} ${updating ? 'opacity-50 cursor-wait' : 'opacity-100 hover:shadow-md'}`}
      >
        {status}
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 mt-3 w-48 z-[100] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border"
              style={{ background: '#181511', borderColor: 'rgba(201,164,114,0.2)' }}
            >
              <div className="p-2 space-y-1">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onUpdate(orderId, s)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-between group ${status === s ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    style={{ color: status === s ? '#fff' : 'rgba(255,255,255,0.6)' }}
                  >
                    {s}
                    {status === s && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a472' }} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [fetchingRatio, setFetchingRatio] = useState<string | null>(null)

  const handleCheckRatio = async (phone: string, orderId: string) => {
    if (!phone || fetchingRatio === orderId) return
    setFetchingRatio(orderId)
    try {
      // BD Courier API Call (Corrected for POST)
      const res = await fetch('https://api.bdcourier.com/courier-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer nRSzgOLIkunB8jraK8aCOWdm1ZogqkiAVNaXHKNO2YzCRkkl6cIxJd49bqLT'
        },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      
      // If the API call is successful, save it to Supabase
      if (data.status === 'success') {
        await (supabase as any).from('orders').update({ courier_data: data }).eq('id', orderId)
        
        // Update local state for immediate feedback
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, courier_data: data } : o))
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, courier_data: data })
        }
      }
    } catch (err) {
      console.error('Courier API Error:', err)
    } finally {
      setFetchingRatio(null)
    }
  }

  // Auto-fetch courier data when modal opens
  useEffect(() => {
    if (selectedOrder && !selectedOrder.courier_data && selectedOrder.shipping_address?.phone) {
      handleCheckRatio(selectedOrder.shipping_address.phone, selectedOrder.id)
    }
  }, [selectedOrder])

  const fetchOrders = async () => {
    try {
      const { data } = await (supabase as any).from('orders').select('*').order('created_at', { ascending: false })
      setOrders(data || [])
    } catch (err) { 
      console.error(err) 
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    await (supabase as any).from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    
    // Also update selected order if modal is open
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, status })
    }
    setUpdating(null)
  }

  const filtered = orders.filter(o => {
    const name = `${o.shipping_address?.firstName || ''} ${o.shipping_address?.lastName || ''}`.toLowerCase()
    const matchSearch = name.includes(search.toLowerCase()) || o.id.includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-12 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h4 className="text-[10px] font-black tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a472' }}>Management</h4>
          <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#181511', lineHeight: 1.1 }}>
            Orders
          </h1>
          <p className="text-[14px] font-medium" style={{ color: '#71675d' }}>
            Managing <span style={{ color: '#181511', fontWeight: 800 }}>{orders.length}</span> total orders.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 group w-full">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: '#a09a90' }} />
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-14 pl-14 pr-6 rounded-2xl text-[14px] font-medium outline-none transition-all duration-300"
            style={{ 
              background: '#fff', 
              border: '1px solid rgba(24,21,17,0.06)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              color: '#181511'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(201,164,114,0.4)';
              e.target.style.boxShadow = '0 8px 24px rgba(201,164,114,0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(24,21,17,0.06)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
            }}
          />
        </div>
        
        <div className="flex items-center gap-2 p-2 rounded-[20px] overflow-x-auto no-scrollbar w-full lg:w-auto" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          {['all', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`h-10 px-6 rounded-xl text-[11px] font-black tracking-[0.1em] uppercase transition-all duration-300 whitespace-nowrap ${
                filter === s 
                  ? 'shadow-md' 
                  : 'hover:bg-[#faf9f7]'
              }`}
              style={{
                background: filter === s ? '#181511' : 'transparent',
                color: filter === s ? '#fff' : '#71675d'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-[24px]" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6">
            <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(201,164,114,0.2)', borderTopColor: '#c9a472' }} />
            <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: '#71675d' }}>Loading Orders...</p>
          </div>
        ) : (
          <div className="overflow-visible">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr style={{ background: '#faf9f7', borderBottom: '1px solid rgba(24,21,17,0.06)' }}>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#a09a90' }}>Order ID</th>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#a09a90' }}>Customer</th>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#a09a90' }}>Status</th>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#a09a90' }}>Total</th>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase text-right" style={{ color: '#a09a90' }}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(24,21,17,0.04)' }}>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)' }}>
                        <ShoppingBag size={24} strokeWidth={1.5} style={{ color: '#a09a90' }} />
                      </div>
                      <h3 className="text-[20px] font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#181511' }}>No Orders Found</h3>
                      <p className="text-[13px]" style={{ color: '#71675d' }}>Adjust your filters to see more results.</p>
                    </td>
                  </tr>
                ) : filtered.map((order, idx) => {
                  const customer = order.shipping_address
                    ? `${order.shipping_address.firstName || ''} ${order.shipping_address.lastName || ''}`.trim() || 'Guest'
                    : 'Anonymous'

                  return (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group transition-colors duration-300 relative z-[1]"
                      style={{ background: '#fff' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#faf9f7')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="h-12 px-4 rounded-xl flex items-center justify-center font-bold text-[11px] tracking-widest shadow-sm transition-all duration-300 group-hover:scale-105" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}>
                            #{order.id.split('-')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-[9px] font-black tracking-[0.2em] uppercase mb-1 flex items-center gap-1.5" style={{ color: '#a09a90' }}>
                              <Calendar size={12} strokeWidth={2.5} />
                              Date
                            </div>
                            <div className="text-[13px] font-bold" style={{ color: '#181511' }}>
                              {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-[14px] font-bold mb-1 transition-colors duration-300" style={{ color: '#181511' }}>{customer}</div>
                        <div className="text-[11px] font-medium flex items-center gap-1.5" style={{ color: '#71675d' }}>
                          <Package size={12} strokeWidth={2} style={{ color: '#c9a472' }} />
                          {order.items?.length || 0} Items
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusDropdown 
                          status={order.status || 'pending'} 
                          orderId={order.id} 
                          onUpdate={updateStatus} 
                          updating={updating === order.id} 
                        />
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-[15px] font-bold" style={{ color: '#181511' }}>
                          {formatPrice(order.total)}
                        </div>
                        <div className="text-[9px] font-black tracking-widest uppercase mt-1" style={{ color: '#a09a90' }}>Payment: COD</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90 ml-auto"
                          style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#71675d' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(201,164,114,0.4)';
                            e.currentTarget.style.color = '#c9a472';
                            e.currentTarget.style.background = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(24,21,17,0.06)';
                            e.currentTarget.style.color = '#71675d';
                            e.currentTarget.style.background = '#faf9f7';
                          }}
                          title="View Details"
                        >
                          <Eye size={16} strokeWidth={2} />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Order Details Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-[#181511]/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative rounded-[24px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_24px_48px_rgba(0,0,0,0.1)]"
              style={{ background: '#fff' }}
            >
              {/* Modal Header */}
              <div className="px-10 py-8 border-b flex justify-between items-center" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <ShoppingBag size={24} style={{ color: '#181511' }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-[24px] font-bold tracking-tight" style={{ color: '#181511', fontFamily: "'Playfair Display', serif" }}>
                      Order Details <span className="font-light ml-2" style={{ color: '#a09a90' }}>#{selectedOrder.id.split('-')[0].toUpperCase()}</span>
                    </h2>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase mt-1 flex items-center gap-1.5" style={{ color: '#71675d' }}>
                      <Calendar size={12} strokeWidth={2.5} />
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', color: '#71675d' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#181511'; e.currentTarget.style.borderColor = 'rgba(24,21,17,0.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#71675d'; e.currentTarget.style.borderColor = 'rgba(24,21,17,0.06)' }}
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-10 overflow-y-auto no-scrollbar flex-1 space-y-10">
                
                {/* Status & Total Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[20px]" style={{ border: '1px solid rgba(24,21,17,0.06)', background: '#faf9f7' }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: '#a09a90' }}>Order Status</p>
                    <div className="flex items-center justify-between">
                      <StatusDropdown 
                        status={selectedOrder.status} 
                        orderId={selectedOrder.id} 
                        onUpdate={updateStatus} 
                        updating={updating === selectedOrder.id} 
                      />
                    </div>
                  </div>
                  <div className="p-8 rounded-[20px] shadow-lg flex flex-col justify-between" style={{ background: '#181511', color: '#fff' }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Order Total</p>
                    <div className="flex items-end justify-between">
                      <p className="text-[32px] font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{formatPrice(selectedOrder.total)}</p>
                      <CreditCard size={24} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    </div>
                  </div>
                </div>

                {/* Logistics & Identity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#181511' }}>
                      <MapPin size={16} strokeWidth={2} style={{ color: '#c9a472' }} /> Shipping Address
                    </h3>
                    <div className="rounded-[20px] p-6 space-y-4" style={{ border: '1px solid rgba(24,21,17,0.06)', background: '#faf9f7' }}>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#a09a90' }}>Name</p>
                        <p className="text-[14px] font-bold" style={{ color: '#181511' }}>
                          {selectedOrder.shipping_address?.firstName || selectedOrder.shipping_address?.full_name || 'Guest'}
                          {selectedOrder.shipping_address?.lastName ? ` ${selectedOrder.shipping_address.lastName}` : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#a09a90' }}>Address</p>
                        <p className="text-[13px] font-medium leading-relaxed" style={{ color: '#71675d' }}>
                          {selectedOrder.shipping_address?.address || selectedOrder.shipping_address?.address_line1}
                        </p>
                        <p className="text-[13px] font-medium" style={{ color: '#71675d' }}>
                          {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.postalCode || selectedOrder.shipping_address?.postal_code}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#181511' }}>
                      <User size={16} strokeWidth={2} style={{ color: '#c9a472' }} /> Customer Details
                    </h3>
                    <div className="rounded-[20px] p-6 space-y-4" style={{ border: '1px solid rgba(24,21,17,0.06)', background: '#faf9f7' }}>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#a09a90' }}>Email</p>
                        <p className="text-[14px] font-bold" style={{ color: '#181511' }}>{selectedOrder.shipping_address?.email}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#a09a90' }}>Phone</p>
                        <p className="text-[14px] font-bold" style={{ color: '#181511' }}>{selectedOrder.shipping_address?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courier Intelligence Section (New) */}
                <div className="p-8 rounded-[24px] space-y-6" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)' }}>
                        <Activity size={18} style={{ color: '#c9a472' }} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold tracking-tight" style={{ color: '#181511' }}>Courier Intelligence</h3>
                        <p className="text-[10px] font-medium" style={{ color: '#71675d' }}>Customer Delivery Performance</p>
                      </div>
                    </div>
                    
                    {!selectedOrder.courier_data && (
                      <button
                        onClick={() => handleCheckRatio(selectedOrder.shipping_address?.phone, selectedOrder.id)}
                        disabled={fetchingRatio === selectedOrder.id}
                        className="h-10 px-6 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 disabled:opacity-50"
                        style={{ background: '#181511', color: '#fff' }}
                      >
                        {fetchingRatio === selectedOrder.id ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Search size={14} />
                        )}
                        {fetchingRatio === selectedOrder.id ? 'Checking...' : 'Check Ratio'}
                      </button>
                    )}
                  </div>

                  {selectedOrder.courier_data?.data?.summary ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)' }}>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#a09a90' }}>Total Parcels</p>
                        <p className="text-[18px] font-bold" style={{ color: '#181511' }}>{selectedOrder.courier_data.data.summary.total_parcel || 0}</p>
                      </div>
                      <div className="p-4 rounded-2xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#166534' }}>Delivered</p>
                        <p className="text-[18px] font-bold" style={{ color: '#166534' }}>{selectedOrder.courier_data.data.summary.success_parcel || 0}</p>
                      </div>
                      <div className="p-4 rounded-2xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#991b1b' }}>Returned</p>
                        <p className="text-[18px] font-bold" style={{ color: '#991b1b' }}>{selectedOrder.courier_data.data.summary.cancelled_parcel || 0}</p>
                      </div>
                      <div className="p-4 rounded-2xl shadow-sm" style={{ background: '#181511', color: '#fff' }}>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Success Ratio</p>
                        <p className="text-[18px] font-bold">{selectedOrder.courier_data.data.summary.success_ratio || '0'}%</p>
                      </div>
                    </div>
                  ) : fetchingRatio === selectedOrder.id ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl" style={{ borderColor: 'rgba(201,164,114,0.1)' }}>
                      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(201,164,114,0.2)', borderTopColor: '#c9a472' }} />
                      <p className="text-[11px] font-medium" style={{ color: '#71675d' }}>Fetching intelligence from BD Courier...</p>
                    </div>
                  ) : (
                    <div className="py-4 text-center border-2 border-dashed rounded-2xl" style={{ borderColor: 'rgba(24,21,17,0.04)' }}>
                      <p className="text-[11px] font-medium" style={{ color: '#a09a90' }}>No courier intelligence data found for this customer.</p>
                    </div>
                  )}
                </div>

                {/* Inventory Reserved */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#181511' }}>
                    <Box size={16} strokeWidth={2} style={{ color: '#c9a472' }} /> Order Items
                  </h3>
                  <div className="border rounded-[20px] overflow-hidden divide-y" style={{ borderColor: 'rgba(24,21,17,0.06)' }}>
                    {selectedOrder.items?.map((item: any, idx: number) => {
                      const itemProduct = item.product || null
                      const image = itemProduct?.images?.[0] || item.image
                      const name = itemProduct?.name || item.name || 'Velour Fragrance'
                      const unitPrice = itemProduct?.price || item.price || 0

                      return (
                        <div key={idx} className="p-6 flex items-center gap-6 transition-colors group" style={{ background: '#fff' }}>
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)' }}>
                            {image ? (
                              <img src={image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} strokeWidth={1} style={{ color: '#a09a90' }} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-[15px] font-bold tracking-tight mb-1" style={{ color: '#181511' }}>{name}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[12px] font-medium" style={{ color: '#71675d' }}>{formatPrice(unitPrice)}</span>
                              <span className="text-[10px] font-black tracking-widest" style={{ color: '#a09a90' }}>x {item.qty}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[16px] font-bold tracking-tight" style={{ color: '#181511' }}>
                              {formatPrice(unitPrice * item.qty)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t flex justify-end" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-8 h-12 rounded-xl text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-md active:scale-95 hover:shadow-lg"
                  style={{ background: '#181511', color: '#fff' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
