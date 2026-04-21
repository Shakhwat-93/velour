import { useEffect, useState, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, SlidersHorizontal, X, ShoppingBag,
  Sparkles, Star, ChevronDown, ArrowRight, Heart,
  Filter
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Product, Category } from '@/lib/types'
import PageHero from '@/components/store/PageHero'

/* ─── Sort options ────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { label: 'Featured',     value: 'featured'   },
  { label: 'Newest',       value: 'newest'     },
  { label: 'Price: Low to High',   value: 'price_asc'  },
  { label: 'Price: High to Low',  value: 'price_desc' },
]

/* ─── Shop Product Card ───────────────────────────────────────────────── */
function ShopCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  const { toast }   = useToast()
  const [wished, setWished] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    addItem(product)
    toast(`${product.name} added to bag`)
  }
  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setWished(w => !w)
  }

  const hasDiscount = !!product.compare_at_price && product.compare_at_price > product.price
  const pct = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link
        to={`/shop/${product.slug}`}
        className="block h-full"
        style={{
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(24,21,17,0.08)',
          overflow: 'hidden',
          transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 20px 50px rgba(11,19,27,0.12)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
      >
        {/* ── Image Zone ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #f7f1e8 0%, #ede4d6 100%)',
            aspectRatio: '3/4',
          }}
        >
          {/* Wishlist */}
          <button
            onClick={handleWish}
            className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              color: wished ? '#ef4444' : '#71675d',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <Heart size={15} fill={wished ? '#ef4444' : 'none'} strokeWidth={1.8} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.featured && (
              <span
                className="px-2.5 py-1 text-[9px] font-black tracking-[0.12em] uppercase text-white rounded-full"
                style={{ background: 'linear-gradient(135deg,#c9a472,#a07540)' }}
              >
                Best Seller
              </span>
            )}
            {hasDiscount && (
              <span
                className="px-2.5 py-1 text-[9px] font-black tracking-[0.08em] uppercase text-white rounded-full"
                style={{ background: '#e85454' }}
              >
                −{pct}%
              </span>
            )}
          </div>

          {/* Product image */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
            ) : (
              <Sparkles size={36} strokeWidth={1.2} style={{ color: 'rgba(201,164,114,0.3)' }} />
            )}
          </div>

          {/* Rating chip */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              color: '#181511',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              whiteSpace: 'nowrap',
            }}
          >
            <Star size={10} fill="#c9a472" stroke="none" />
            4.9
            <span style={{ color: '#71675d', fontWeight: 500 }}>· Curated</span>
          </div>
        </div>

        {/* ── Info Zone ── */}
        <div className="flex flex-col p-4 gap-3">
          {/* Category + Name */}
          <div>
            {product.category?.name && (
              <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1 block" style={{ color: '#a07540' }}>
                {product.category.name}
              </p>
            )}
            <h3
              className="text-[14px] font-bold leading-snug line-clamp-1 transition-colors duration-300 group-hover:text-[#a07540]"
              style={{ color: '#181511' }}
            >
              {product.name}
            </h3>
            <p className="text-[12px] leading-[1.6] line-clamp-2 mt-1" style={{ color: '#5a5048' }}>
              {product.description || 'A composed extrait de parfum crafted for quiet confidence.'}
            </p>
          </div>

          {/* Price + Add to bag */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid rgba(24,21,17,0.07)' }}
          >
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#71675d' }}>Price</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-[15px] font-bold" style={{ color: '#181511' }}>{formatPrice(product.price)}</span>
                {hasDiscount && (
                  <span className="text-[11px] line-through" style={{ color: '#c4b8ad' }}>
                    {formatPrice(product.compare_at_price!)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAdd}
              aria-label={`Add ${product.name} to bag`}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 active:scale-90"
              style={{ background: '#181511', color: '#fff', boxShadow: '0 4px 14px rgba(11,19,27,0.22)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#c9a472'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(201,164,114,0.35)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#181511'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(11,19,27,0.22)'
              }}
            >
              <ShoppingBag size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/* ─── Main Shop Page ──────────────────────────────────────────────────── */
export default function Shop() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('q') || ''
  const activeTab = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'featured'
  
  const [sortOpen,   setSortOpen]   = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  const setSearch = (q: string) => {
    const params = new URLSearchParams(searchParams)
    if (q) params.set('q', q)
    else params.delete('q')
    setSearchParams(params)
  }

  const setActiveTab = (c: string) => {
    const params = new URLSearchParams(searchParams)
    if (c !== 'all') params.set('category', c)
    else params.delete('category')
    setSearchParams(params)
  }

  const setSort = (s: string) => {
    const params = new URLSearchParams(searchParams)
    if (s !== 'featured') params.set('sort', s)
    else params.delete('sort')
    setSearchParams(params)
  }

  /* Fetch */
  useEffect(() => {
    async function load() {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        (supabase as any).from('products').select('*, category:categories(id,name,slug)').order('created_at', { ascending: false }),
        (supabase as any).from('categories').select('*').order('name'),
      ])
      setProducts(prods ?? [])
      setCategories(cats ?? [])
      setLoading(false)
    }
    load()
  }, [])

  /* Close sort on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  /* Filter + sort */
  const filtered = useMemo(() => {
    let list = [...products]
    if (activeTab !== 'all') list = list.filter(p => p.category_id === activeTab || p.category?.slug === activeTab)
    const q = search.trim().toLowerCase()
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q) ||
      (p.category?.name ?? '').toLowerCase().includes(q)
    )
    switch (sort) {
      case 'featured':   list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
      case 'newest':     list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
      case 'price_asc':  list = [...list].sort((a, b) => a.price - b.price); break
      case 'price_desc': list = [...list].sort((a, b) => b.price - a.price); break
    }
    return list
  }, [products, activeTab, search, sort])

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Sort'
  const tabs = [{ id: 'all', name: 'All Collection', count: products.length }, ...categories.map(c => ({ id: c.slug, name: c.name, count: products.filter(p => p.category_id === c.id).length }))]

  return (
    <div className="page-enter" style={{ background: '#faf7f2', minHeight: '100vh', paddingBottom: '96px' }}>
      <PageHero
        eyebrow="Collection"
        title="Signature Fragrances"
        description="Explore the full Velour range through a premium storefront built for elite detail and discovery."
      />

      <section className="container-site" style={{ marginTop: '-40px', position: 'relative', zIndex: 20 }}>
        
        {/* ── Toolbar ── */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-8 p-3 rounded-[24px]"
          style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#a09890' }}
            />
            <input
              type="text"
              placeholder="Search our collection..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-10 rounded-[16px] text-[14px] outline-none bg-transparent"
              style={{ color: '#181511' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: '#a09890' }}
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div className="hidden sm:block w-px self-stretch my-2" style={{ background: 'rgba(24,21,17,0.08)' }} />
          <div className="sm:hidden h-px self-stretch mx-2" style={{ background: 'rgba(24,21,17,0.08)' }} />

          {/* Sort */}
          <div className="relative shrink-0" ref={sortRef}>
            <button
              onClick={() => setSortOpen(v => !v)}
              className="w-full sm:w-auto h-12 px-6 flex items-center justify-between sm:justify-start gap-3 rounded-[16px] text-[13px] font-bold transition-colors hover:bg-[#faf7f2]"
              style={{ color: '#181511' }}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} strokeWidth={2} style={{ color: '#71675d' }} />
                <span>{activeSortLabel}</span>
              </div>
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#71675d' }}
              />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-[220px] rounded-2xl z-30 overflow-hidden"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(24,21,17,0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                  }}
                >
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setSortOpen(false) }}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-[13px] font-bold transition-colors"
                      style={{
                        color: sort === o.value ? '#c9a472' : '#181511',
                        background: sort === o.value ? 'rgba(201,164,114,0.07)' : 'transparent',
                      }}
                    >
                      {o.label}
                      {sort === o.value && <div className="w-1.5 h-1.5 rounded-full bg-[#c9a472]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-[260px] shrink-0">
            <div className="sticky top-[120px]">
              <div className="flex items-center gap-2 mb-5">
                <Filter size={16} style={{ color: '#181511' }} />
                <h3 className="text-[14px] font-bold" style={{ color: '#181511' }}>Categories</h3>
              </div>
              
              <div className="flex flex-col gap-1.5">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200"
                      style={{
                        background: isActive ? '#181511' : 'transparent',
                        color: isActive ? '#fff' : '#5a5048',
                      }}
                    >
                      <span className={`text-[13px] ${isActive ? 'font-bold' : 'font-semibold group-hover:text-[#181511]'}`}>
                        {tab.name}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(24,21,17,0.06)',
                          color: isActive ? 'rgba(255,255,255,0.9)' : '#71675d',
                        }}
                      >
                        {tab.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {(search || activeTab !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setActiveTab('all'); setSort('featured') }}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-colors"
                  style={{ color: '#c9a472', background: 'rgba(201,164,114,0.1)', border: '1px dashed rgba(201,164,114,0.3)' }}
                >
                  <X size={14} strokeWidth={2.5} /> Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            
            {/* Results meta */}
            {!loading && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'rgba(24,21,17,0.08)' }}>
                <p className="text-[14px] font-medium" style={{ color: '#71675d' }}>
                  Showing <span className="font-bold text-[#181511]">{filtered.length}</span> results
                </p>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              /* Skeleton */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-[20px] overflow-hidden animate-pulse" style={{ background: '#f0ebe3' }}>
                    <div className="bg-[#e4ddd3]" style={{ aspectRatio: '3/4' }} />
                    <div className="p-5 space-y-3">
                      <div className="h-2.5 w-1/3 rounded-full bg-[#e4ddd3]" />
                      <div className="h-4 w-2/3 rounded-full bg-[#e4ddd3]" />
                      <div className="h-2.5 w-full rounded-full bg-[#e4ddd3]" />
                      <div className="h-2.5 w-1/2 rounded-full bg-[#e4ddd3]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div
                  className="w-20 h-20 flex items-center justify-center rounded-[2rem] mb-6"
                  style={{ background: 'rgba(201,164,114,0.08)', border: '1px solid rgba(201,164,114,0.18)' }}
                >
                  <Sparkles size={28} strokeWidth={1.4} style={{ color: '#c9a472' }} />
                </div>
                <p className="text-[20px] font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#181511' }}>
                  No fragrances found
                </p>
                <p className="text-[14px] max-w-md mb-8" style={{ color: '#71675d' }}>
                  {search 
                    ? `We couldn't find any results for "${search}". Try checking your spelling or using more general terms.` 
                    : 'This category is currently empty. We are curating new selections.'}
                </p>
                <button
                  onClick={() => { setSearch(''); setActiveTab('all') }}
                  className="px-8 py-3.5 rounded-2xl text-[12px] font-bold tracking-[0.15em] uppercase text-white transition-all hover:-translate-y-1"
                  style={{ background: '#181511', boxShadow: '0 8px 24px rgba(11,19,27,0.15)' }}
                >
                  Browse all products
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => <ShopCard key={p.id} product={p} index={i} />)}
                </AnimatePresence>
              </motion.div>
            )}

          </div>
        </div>

      </section>
    </div>
  )
}
