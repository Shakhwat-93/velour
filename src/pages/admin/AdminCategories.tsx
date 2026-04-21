import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2, Edit, X, Check, FolderOpen, Image, Type, AlignLeft, Hash, Globe, Upload, Loader2 } from 'lucide-react'
import { slugify } from '@/lib/utils/slugify'
import { motion, AnimatePresence } from 'framer-motion'

const INITIAL_FORM = { name: '', description: '', image_url: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [form, setForm]             = useState(INITIAL_FORM)
  const [saving, setSaving]         = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      const { data } = await (supabase as any).from('categories').select('*').order('created_at', { ascending: true })
      setCategories(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const slug = slugify(form.name)

    if (editingId) {
      const { error } = await (supabase as any).from('categories').update({ ...form, slug }).eq('id', editingId)
      if (error) alert(error.message)
    } else {
      const { error } = await (supabase as any).from('categories').insert({ ...form, slug })
      if (error) alert(error.message)
    }

    setForm(INITIAL_FORM)
    setShowForm(false)
    setEditingId(null)
    setSaving(false)
    fetchCategories()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `categories/${fileName}`

      const { error: uploadError } = await (supabase as any).storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = (supabase as any).storage
        .from('products')
        .getPublicUrl(filePath)

      setForm(prev => ({ ...prev, image_url: publicUrl }))
    } catch (err: any) {
      console.error('Upload error:', err)
      alert('Upload failed. Please check your storage settings.')
    } finally {
      setUploading(false)
    }
  }

  const startEdit = (cat: any) => {
    setForm({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '' })
    setEditingId(cat.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelForm = () => {
    setForm(INITIAL_FORM)
    setShowForm(false)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    setDeletingId(id)
    await (supabase as any).from('categories').delete().eq('id', id)
    setDeletingId(null)
    fetchCategories()
  }

  return (
    <div className="space-y-12 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h4 className="text-[10px] font-black tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a472' }}>Management</h4>
          <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#181511', lineHeight: 1.1 }}>
            Categories
          </h1>
          <p className="text-[14px] font-medium" style={{ color: '#71675d' }}>
            Managing <span style={{ color: '#181511', fontWeight: 800 }}>{categories.length}</span> product categories.
          </p>
        </div>
        
        {!showForm && (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowForm(true); setEditingId(null); setForm(INITIAL_FORM) }}
            className="inline-flex items-center gap-3 px-8 h-14 rounded-2xl text-[11px] font-black tracking-[0.1em] uppercase transition-all shadow-md hover:shadow-lg"
            style={{ background: '#181511', color: '#fff' }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Category
          </motion.button>
        )}
      </div>

      {/* Form Card */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="rounded-[24px] overflow-hidden"
            style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}
          >
            <div className="px-10 py-8 border-b flex justify-between items-center" style={{ borderColor: 'rgba(24,21,17,0.06)', background: '#faf9f7' }}>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <FolderOpen size={24} style={{ color: '#181511' }} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-[24px] font-bold tracking-tight" style={{ color: '#181511', fontFamily: "'Playfair Display', serif" }}>
                    {editingId ? 'Edit Category' : 'Create Category'}
                  </h2>
                  <p className="text-[11px] font-medium mt-1" style={{ color: '#71675d' }}>Category Details</p>
                </div>
              </div>
              <button 
                onClick={cancelForm} 
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', color: '#71675d' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#181511'; e.currentTarget.style.borderColor = 'rgba(24,21,17,0.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#71675d'; e.currentTarget.style.borderColor = 'rgba(24,21,17,0.06)' }}
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                    <Type size={14} style={{ color: '#c9a472' }} /> Category Name
                  </label>
                  <input 
                    required type="text" 
                    value={form.name} placeholder="e.g. Perfumes" 
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full h-14 px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                    style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(201,164,114,0.4)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(24,21,17,0.06)'}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* File Upload */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                      <Upload size={14} style={{ color: '#c9a472' }} /> Upload Icon/Banner
                    </label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                      />
                      <div 
                        className="h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:bg-[#faf9f7]"
                        style={{ 
                          borderColor: uploading ? 'rgba(201,164,114,0.4)' : 'rgba(24,21,17,0.1)',
                          background: uploading ? '#faf9f7' : '#fff'
                        }}
                      >
                        {uploading ? (
                          <Loader2 size={24} className="animate-spin" style={{ color: '#c9a472' }} />
                        ) : form.image_url ? (
                          <img src={form.image_url} alt="" className="h-20 w-20 object-cover rounded-lg shadow-sm" />
                        ) : (
                          <Upload size={24} style={{ color: '#a09a90' }} />
                        )}
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#181511' }}>
                            {uploading ? 'Uploading...' : form.image_url ? 'Change Image' : 'Select Image'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                      <Image size={14} style={{ color: '#c9a472' }} /> Or Image URL
                    </label>
                    <input 
                      type="text" 
                      value={form.image_url} placeholder="https://..." 
                      onChange={e => setForm({ ...form, image_url: e.target.value })}
                      className="w-full h-14 px-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300"
                      style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(201,164,114,0.4)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(24,21,17,0.06)'}
                    />
                    <p className="text-[10px] font-medium italic" style={{ color: '#71675d' }}>Supports PNG, JPG, WEBP</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#181511' }}>
                  <AlignLeft size={14} style={{ color: '#c9a472' }} /> Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description..."
                  className="w-full p-6 rounded-xl text-[14px] font-medium outline-none transition-all duration-300 min-h-[120px] resize-none"
                  style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#181511' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(201,164,114,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(24,21,17,0.06)'}
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={cancelForm} 
                  className="px-8 h-14 rounded-xl text-[11px] font-black tracking-[0.2em] uppercase transition-all"
                  style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)', color: '#71675d' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#181511'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#71675d'}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="flex-1 h-14 rounded-xl text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                  style={{ background: '#181511', color: '#fff' }}
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }} />
                  ) : (
                    <Check size={16} strokeWidth={3} />
                  )}
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-6">
          <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(201,164,114,0.2)', borderTopColor: '#c9a472' }} />
          <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: '#71675d' }}>Loading Categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-32 text-center rounded-[24px]" style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)' }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#faf9f7', border: '1px solid rgba(24,21,17,0.06)' }}>
            <FolderOpen size={24} strokeWidth={1.5} style={{ color: '#a09a90' }} />
          </div>
          <h3 className="text-[20px] font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#181511' }}>No Categories</h3>
          <p className="text-[13px]" style={{ color: '#71675d' }}>Create a category to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-[24px] overflow-hidden group flex flex-col transition-all duration-300"
              style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              {/* Image Preview */}
              <div className="h-56 relative overflow-hidden" style={{ background: '#faf9f7' }}>
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen size={32} strokeWidth={1.5} style={{ color: '#a09a90' }} />
                  </div>
                )}
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-[#181511]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                  <button 
                    onClick={() => startEdit(cat)} 
                    className="w-12 h-12 rounded-xl bg-white text-[#181511] flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
                  >
                    <Edit size={18} strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)} 
                    disabled={deletingId === cat.id}
                    className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg disabled:opacity-50"
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-[20px] font-bold tracking-tight mb-3" style={{ color: '#181511' }}>{cat.name}</h3>
                
                <p className="text-[13px] line-clamp-2 leading-relaxed flex-1 mb-6" style={{ color: '#71675d' }}>
                  {cat.description || 'No description provided.'}
                </p>
                
                <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: 'rgba(24,21,17,0.06)' }}>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg" style={{ background: '#faf9f7', color: '#181511' }}>
                    <Globe size={12} style={{ color: '#a09a90' }} />
                    /{cat.slug}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
