import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils/formatPrice'
import { Plus, Edit, Trash2, Package, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminProducts() {
  const [products, setProducts]   = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const { data } = await (supabase as any)
        .from('products')
        .select('*, category:categories(name)')
        .order('created_at', { ascending: false })
      setProducts(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this masterpiece from inventory?')) return
    setDeletingId(id)
    await (supabase as any).from('products').delete().eq('id', id)
    await fetchProducts()
    setDeletingId(null)
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h4 className="text-[10px] font-black tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a472' }}>Inventory Control</h4>
          <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#181511', lineHeight: 1.1 }}>
            Products
          </h1>
          <p className="text-[14px] font-medium" style={{ color: '#71675d' }}>
            Managing <span style={{ color: '#181511', fontWeight: 800 }}>{products.length}</span> signature fragrances in your collection.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-3 px-8 h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 active:scale-95 group shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(201,164,114,0.3)]"
          style={{ background: '#181511', color: '#fff' }}
        >
          <Plus size={16} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-500" style={{ color: '#c9a472' }} />
          Create Product
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: '#a09a90' }} />
          <input
            type="text"
            placeholder="Search by name or category..."
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
        <button 
          className="h-14 px-8 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase flex items-center gap-3 transition-all duration-300"
          style={{ 
            background: '#fff', 
            border: '1px solid rgba(24,21,17,0.06)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            color: '#181511'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,164,114,0.4)';
            (e.currentTarget as HTMLElement).style.color = '#c9a472';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(24,21,17,0.06)';
            (e.currentTarget as HTMLElement).style.color = '#181511';
          }}
        >
          <Filter size={15} strokeWidth={2} />
          Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="rounded-[24px] overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6">
            <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(201,164,114,0.2)', borderTopColor: '#c9a472' }} />
            <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: '#71675d' }}>Syncing Collections...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr style={{ background: '#faf9f7', borderBottom: '1px solid rgba(24,21,17,0.06)' }}>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#a09a90' }}>Masterpiece Details</th>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#a09a90' }}>Collection</th>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#a09a90' }}>Pricing</th>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#a09a90' }}>Stock Status</th>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase" style={{ color: '#a09a90' }}>Visibility</th>
                  <th className="px-8 py-6 text-[9px] font-black tracking-[0.3em] uppercase text-right" style={{ color: '#a09a90' }}>Management</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(24,21,17,0.04)' }}>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)' }}>
                        <Package size={24} strokeWidth={1.5} style={{ color: '#a09a90' }} />
                      </div>
                      <h3 className="text-[20px] font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#181511' }}>Olfactive void</h3>
                      <p className="text-[13px]" style={{ color: '#71675d' }}>No fragrances matching your refined search.</p>
                    </td>
                  </tr>
                ) : filtered.map((product, idx) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group transition-colors duration-300"
                    style={{ background: '#fff' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#faf9f7')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:scale-105" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)' }}>
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Package size={20} strokeWidth={1.5} style={{ color: '#d0c8c0' }} /></div>
                          )}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold mb-1 transition-colors duration-300" style={{ color: '#181511' }}>{product.name}</div>
                          <div className="text-[9px] font-black tracking-[0.2em] uppercase flex items-center gap-1.5" style={{ color: '#a09a90' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(201,164,114,0.3)' }} />
                            SKU: {product.id.split('-')[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[9px] font-black tracking-[0.2em] px-3 py-1.5 rounded-lg uppercase" style={{ background: 'rgba(24,21,17,0.04)', color: '#71675d' }}>
                        {product.category?.name || 'Private Blend'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[14px] font-bold" style={{ color: '#181511' }}>{formatPrice(product.price)}</div>
                      {product.compare_at_price > 0 && (
                        <div className="text-[10px] line-through mt-0.5" style={{ color: '#a09a90' }}>{formatPrice(product.compare_at_price)}</div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock_qty < 5 ? 'bg-red-400 animate-pulse' : product.stock_qty < 15 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        <span className="text-[13px] font-bold" style={{ color: '#181511' }}>
                          {product.stock_qty} <span className="text-[10px] font-black tracking-[0.1em] ml-0.5 uppercase" style={{ color: '#a09a90' }}>Btls</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] font-black tracking-[0.2em] uppercase ${
                        product.in_stock 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {product.in_stock ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity duration-300">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90"
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
                          title="Edit"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90 disabled:opacity-50"
                          style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#71675d' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.background = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(24,21,17,0.06)';
                            e.currentTarget.style.color = '#71675d';
                            e.currentTarget.style.background = '#faf9f7';
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
