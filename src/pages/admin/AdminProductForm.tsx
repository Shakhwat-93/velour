import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils/slugify'
import { ArrowLeft, Plus, X, ImageIcon, Check, Info, DollarSign, Package, Layers, ChevronDown, Upload, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const INITIAL_FORM = {
  name: '', description: '', price: 0, compare_at_price: 0,
  category_id: '', stock_qty: 0, featured: false, in_stock: true, images: [] as string[],
  variants: [] as any[],
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState(INITIAL_FORM)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [imageInput, setImageInput] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function loadData() {
      const { data: catData } = await (supabase as any).from('categories').select('id, name')
      setCategories(catData || [])
      
      if (isEditing) {
        const { data } = await (supabase as any).from('products').select('*').eq('id', id).single()
        if (data) setForm({ ...(data as any), compare_at_price: (data as any).compare_at_price || 0, images: (data as any).images || [], variants: (data as any).variants || [] })
      }
      setFetching(false)
    }
    loadData()
  }, [id, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = { 
      ...form, 
      slug: slugify(form.name), 
      compare_at_price: form.compare_at_price || null, 
      category_id: form.category_id || null 
    }
    
    const { error } = isEditing
      ? await (supabase as any).from('products').update(payload).eq('id', id)
      : await (supabase as any).from('products').insert([payload])

    setLoading(false)
    if (error) alert(error.message)
    else navigate('/admin/products')
  }

  const addImage = () => {
    if (!imageInput.trim()) return
    setForm({ ...form, images: [...form.images, imageInput.trim()] })
    setImageInput('')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `products/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await (supabase as any).storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = (supabase as any).storage
        .from('products')
        .getPublicUrl(filePath)

      setForm(prev => ({ ...prev, images: [...prev.images, publicUrl] }))
    } catch (err: any) {
      console.error('Upload error:', err)
      alert('Failed to upload image. Make sure the "products" bucket exists in Supabase Storage and is set to public.')
    } finally {
      setUploading(false)
    }
  }
  
  const removeImage = (i: number) => {
    const imgs = [...form.images]; imgs.splice(i, 1)
    setForm({ ...form, images: imgs })
  }

  if (fetching) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(201,164,114,0.2)', borderTopColor: '#c9a472' }} />
      <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: '#71675d' }}>Loading product...</p>
    </div>
  )

  const cardStyle = { background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }
  const inputStyle = { background: '#fff', border: '1px solid rgba(24,21,17,0.1)', color: '#181511', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }

  return (
    <div className="max-w-6xl space-y-12 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate('/admin/products')}
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm"
            style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </motion.button>
          <div>
            <h4 className="text-[10px] font-black tracking-[0.4em] uppercase mb-2" style={{ color: '#c9a472' }}>Catalog</h4>
            <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#181511', lineHeight: 1.1 }}>
              {isEditing ? 'Edit Product' : 'Add Product'}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        
        {/* ── Left Column: Basic Details & Images ────────────────────────────────────────── */}
        <div className="space-y-8">
          
          {/* Basic Details */}
          <div className="rounded-[24px] overflow-hidden" style={cardStyle}>
            <div className="px-10 py-8 border-b" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
              <div className="flex items-center gap-3">
                <Info size={18} style={{ color: '#c9a472' }} />
                <h2 className="text-[14px] font-bold tracking-widest uppercase" style={{ color: '#181511' }}>Basic Details</h2>
              </div>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#71675d' }}>
                  Product Name
                </label>
                <input 
                  required type="text" 
                  value={form.name} 
                  placeholder="e.g. Velvet Rose" 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  className="w-full h-14 px-6 rounded-2xl text-[14px] font-medium outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(201,164,114,0.4)'; e.target.style.boxShadow = '0 4px 16px rgba(201,164,114,0.08)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(24,21,17,0.1)'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)' }}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#71675d' }}>
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter product description..."
                  className="w-full p-6 rounded-[20px] text-[14px] outline-none transition-all duration-300 min-h-[150px] resize-none leading-relaxed"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(201,164,114,0.4)'; e.target.style.boxShadow = '0 4px 16px rgba(201,164,114,0.08)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(24,21,17,0.1)'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)' }}
                />
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="rounded-[24px] overflow-hidden" style={cardStyle}>
            <div className="px-10 py-8 border-b flex justify-between items-center" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
              <div className="flex items-center gap-3">
                <Layers size={18} style={{ color: '#c9a472' }} />
                <h2 className="text-[14px] font-bold tracking-widest uppercase" style={{ color: '#181511' }}>Product Variants (Sizes)</h2>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, variants: [...form.variants, { size: '', price: 0, stock_qty: 0 }] })}
                className="h-10 px-6 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all active:scale-95"
                style={{ background: '#181511', color: '#fff' }}
              >
                <Plus size={14} /> Add Variant
              </button>
            </div>
            <div className="p-10 space-y-6">
              {form.variants.length > 0 ? (
                <div className="space-y-4">
                  {form.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_48px] gap-4 items-end p-6 rounded-2xl border" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#a09a90' }}>Size (e.g. 15ml)</label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={e => {
                            const v = [...form.variants]; v[index].size = e.target.value
                            setForm({ ...form, variants: v })
                          }}
                          className="w-full h-12 px-4 rounded-xl text-[13px] font-bold outline-none"
                          style={inputStyle}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#a09a90' }}>Price (BDT)</label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={e => {
                            const v = [...form.variants]; v[index].price = parseFloat(e.target.value) || 0
                            setForm({ ...form, variants: v })
                          }}
                          className="w-full h-12 px-4 rounded-xl text-[13px] font-bold outline-none"
                          style={inputStyle}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#a09a90' }}>Stock</label>
                        <input
                          type="number"
                          value={variant.stock_qty}
                          onChange={e => {
                            const v = [...form.variants]; v[index].stock_qty = parseInt(e.target.value) || 0
                            setForm({ ...form, variants: v })
                          }}
                          className="w-full h-12 px-4 rounded-xl text-[13px] font-bold outline-none"
                          style={inputStyle}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const v = [...form.variants]; v.splice(index, 1)
                          setForm({ ...form, variants: v })
                        }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed rounded-3xl" style={{ borderColor: 'rgba(24,21,17,0.06)' }}>
                  <p className="text-[13px] font-medium" style={{ color: '#a09a90' }}>No variants added. Use variants for multiple sizes.</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Images */}
          <div className="rounded-[24px] overflow-hidden" style={cardStyle}>
            <div className="px-10 py-8 border-b" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
              <div className="flex items-center gap-3">
                <ImageIcon size={18} style={{ color: '#c9a472' }} />
                <h2 className="text-[14px] font-bold tracking-widest uppercase" style={{ color: '#181511' }}>Product Images</h2>
              </div>
            </div>
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* File Upload Area */}
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  <div 
                    className="h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:bg-[#faf9f7]"
                    style={{ 
                      borderColor: uploading ? 'rgba(201,164,114,0.4)' : 'rgba(24,21,17,0.1)',
                      background: uploading ? '#faf9f7' : '#fff'
                    }}
                  >
                    {uploading ? (
                      <Loader2 size={24} className="animate-spin" style={{ color: '#c9a472' }} />
                    ) : (
                      <Upload size={24} style={{ color: '#a09a90' }} />
                    )}
                    <div className="text-center">
                      <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#181511' }}>
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </p>
                      <p className="text-[9px] font-medium mt-1" style={{ color: '#71675d' }}>Directly from your device</p>
                    </div>
                  </div>
                </div>

                {/* URL Input Area */}
                <div className="flex flex-col gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Or paste Image URL..."
                      value={imageInput}
                      onChange={e => setImageInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }}
                      className="w-full h-full min-h-[56px] pl-12 pr-6 rounded-2xl text-[12px] font-medium outline-none transition-all duration-300"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(201,164,114,0.4)'; e.target.style.boxShadow = '0 4px 16px rgba(201,164,114,0.08)' }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(24,21,17,0.1)'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)' }}
                    />
                    <ImageIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#a09a90' }} />
                  </div>
                  <button
                    type="button"
                    onClick={addImage}
                    className="h-14 px-8 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 whitespace-nowrap"
                    style={{ background: '#181511', color: '#fff' }}
                  >
                    <Plus size={14} strokeWidth={3} style={{ color: '#c9a472' }} /> 
                    Add by URL
                  </button>
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {form.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                    {form.images.map((img, i) => (
                      <motion.div 
                        key={img + i} 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-[4/5] rounded-[16px] overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
                        style={{ border: '1px solid rgba(24,21,17,0.06)', background: '#faf9f7' }}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-[#181511]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                          <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeImage(i)}
                            className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-xl"
                          >
                            <X size={18} strokeWidth={2.5} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-[20px] py-16 flex flex-col items-center justify-center text-center transition-all duration-300" style={{ borderColor: 'rgba(24,21,17,0.1)', background: '#faf9f7' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                      <ImageIcon size={24} style={{ color: '#a09a90' }} />
                    </div>
                    <h3 className="text-[16px] font-bold mb-1" style={{ color: '#181511' }}>No Images</h3>
                    <p className="text-[13px] font-medium" style={{ color: '#71675d' }}>Add an image URL to preview.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Right Column: Pricing & Options ─────────────────────────────── */}
        <div className="space-y-8 lg:sticky lg:top-[120px]">
          
          {/* Pricing */}
          <div className="rounded-[24px] overflow-hidden" style={cardStyle}>
            <div className="px-8 py-6 border-b" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
              <div className="flex items-center gap-3">
                <DollarSign size={16} style={{ color: '#c9a472' }} />
                <h2 className="text-[12px] font-bold tracking-widest uppercase" style={{ color: '#181511' }}>Pricing</h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#71675d' }}>Price (BDT)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold" style={{ color: '#c9a472' }}>৳</span>
                  <input 
                    required type="number" step="0.01" min="0" 
                    value={form.price} 
                    onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} 
                    className="w-full h-14 pl-10 pr-6 rounded-2xl text-[16px] font-bold outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(201,164,114,0.4)'; e.target.style.boxShadow = '0 4px 16px rgba(201,164,114,0.08)' }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(24,21,17,0.1)'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)' }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#71675d' }}>Compare at Price (Optional)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold" style={{ color: '#a09a90' }}>৳</span>
                  <input 
                    type="number" step="0.01" min="0" 
                    value={form.compare_at_price} placeholder="0.00" 
                    onChange={e => setForm({ ...form, compare_at_price: parseFloat(e.target.value) || 0 })} 
                    className="w-full h-14 pl-10 pr-6 rounded-2xl text-[16px] font-bold outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(201,164,114,0.4)'; e.target.style.boxShadow = '0 4px 16px rgba(201,164,114,0.08)' }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(24,21,17,0.1)'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="rounded-[24px] overflow-hidden" style={cardStyle}>
            <div className="px-8 py-6 border-b" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
              <div className="flex items-center gap-3">
                <Package size={16} style={{ color: '#c9a472' }} />
                <h2 className="text-[12px] font-bold tracking-widest uppercase" style={{ color: '#181511' }}>Inventory</h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#71675d' }}>Stock Quantity</label>
                <input 
                  required type="number" min="0" 
                  value={form.stock_qty} 
                  onChange={e => setForm({ ...form, stock_qty: parseInt(e.target.value) || 0 })} 
                  className="w-full h-14 px-5 rounded-2xl text-[16px] font-bold outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(201,164,114,0.4)'; e.target.style.boxShadow = '0 4px 16px rgba(201,164,114,0.08)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(24,21,17,0.1)'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)' }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>In Stock</span>
                <button 
                  type="button"
                  onClick={() => setForm({ ...form, in_stock: !form.in_stock })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${form.in_stock ? 'bg-emerald-500' : 'bg-[#e5e0d8]'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${form.in_stock ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="rounded-[24px] overflow-hidden" style={cardStyle}>
            <div className="px-8 py-6 border-b" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
              <div className="flex items-center gap-3">
                <Layers size={16} style={{ color: '#c9a472' }} />
                <h2 className="text-[12px] font-bold tracking-widest uppercase" style={{ color: '#181511' }}>Organization</h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#71675d' }}>Category</label>
                <div className="relative">
                  <select
                    value={form.category_id}
                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                    className="w-full h-14 px-5 rounded-2xl text-[14px] font-medium outline-none transition-all duration-300 appearance-none cursor-pointer"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(201,164,114,0.4)'; e.target.style.boxShadow = '0 4px 16px rgba(201,164,114,0.08)' }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(24,21,17,0.1)'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)' }}
                  >
                    <option value="">None</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a09a90' }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>Featured</span>
                  <span className="block text-[10px] font-medium mt-1" style={{ color: '#71675d' }}>Show on homepage</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${form.featured ? 'bg-[#c9a472]' : 'bg-[#e5e0d8]'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${form.featured ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="space-y-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 disabled:opacity-50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(201,164,114,0.3)]"
              style={{ background: '#181511', color: '#fff' }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(201,164,114,0.2)', borderTopColor: '#c9a472' }} />
              ) : (
                <Check size={16} strokeWidth={3} style={{ color: '#c9a472' }} />
              )}
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="w-full h-14 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#faf9f7] active:scale-95"
              style={{ background: 'transparent', border: '1px solid rgba(24,21,17,0.1)', color: '#71675d' }}
            >
              Cancel
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}
