import { useEffect, useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, SlidersHorizontal, X, ShoppingBag,
  Sparkles, Star, ChevronDown, ArrowRight, Heart
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Product, Category } from '@/lib/types'

/* ─── Sort options ────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { label: 'Featured',     value: 'featured'   },
  { label: 'Newest',       value: 'newest'     },
  { label: 'Price: Low',   value: 'price_asc'  },
  { label: 'Price: High',  value: 'price_desc' },
]

/* ─── Product Card ────────────────────────────────────────────────────── */
export function ShowcaseCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  const { toast }   = useToast()
  const [wished, setWished] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null
    addItem(
      product, 
      1, 
      defaultVariant?.size, 
      defaultVariant ? defaultVariant.price : product.price
    )
    toast(`${product.name}${defaultVariant ? ` (${defaultVariant.size})` : ''} added to bag`)
  }
  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setWished(w => !w)
  }

  const hasVariants = !!(product.variants && product.variants.length > 0)
  const minPrice = hasVariants 
    ? Math.min(...product.variants!.map(v => v.price)) 
    : product.price
  const hasDiscount = !!product.compare_at_price && product.compare_at_price > minPrice
  const pct = hasDiscount
    ? Math.round(((product.compare_at_price! - minPrice) / product.compare_at_price!) * 100)
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

          {/* Badges – top left, stacked cleanly */}
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

          {/* Rating chip – bottom center */}
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
              <p className="text-[9px] font-black tracking-[0.3em] uppercase mb-1" style={{ color: '#c9a472' }}>
                {product.category.name}
              </p>
            )}
            <h3
              className="text-[14px] font-bold leading-snug line-clamp-1 transition-colors duration-300 group-hover:text-[#a07540]"
              style={{ color: '#181511' }}
            >
              {product.name}
            </h3>
            <p className="text-[11.5px] leading-[1.6] line-clamp-2 mt-1" style={{ color: '#71675d' }}>
              {product.description || 'A composed extrait de parfum crafted for quiet confidence.'}
            </p>
          </div>

          {/* Price + Add to bag */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid rgba(24,21,17,0.07)' }}
          >
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#a09890' }}>
                {hasVariants ? 'From' : 'Price'}
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-[15px] font-bold" style={{ color: '#181511' }}>{formatPrice(minPrice)}</span>
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

/* ─── Main Section ────────────────────────────────────────────────────── */
export default function ProductShowcase() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [activeTab,  setActiveTab]  = useState<string>('all')
  const [sort,       setSort]       = useState('featured')
  const [sortOpen,   setSortOpen]   = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

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
    if (activeTab !== 'all') list = list.filter(p => p.category_id === activeTab)
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
  const tabs = [{ id: 'all', name: 'All', count: products.length }, ...categories.map(c => ({ id: c.id, name: c.name, count: products.filter(p => p.category_id === c.id).length }))]

  return (
    <section style={{ background: '#faf7f2', padding: '80px 0 96px' }}>
      <div className="container-site">

        {/* ── Header ── */}
        <div className="flex flex-col gap-3 mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="text-[10px] font-black tracking-[0.4em] uppercase mb-3"
              style={{ color: '#c9a472' }}
            >
              Our Collection
            </p>
            <h2
              className="font-bold text-balance"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                color: '#181511',
                lineHeight: 1.2,
              }}
            >
              Signature fragrances,<br className="hidden sm:block" /> curated for you.
            </h2>
          </div>

          <Link
            to="/shop"
            className="self-start md:self-auto inline-flex items-center gap-2 font-bold text-[11px] tracking-[0.18em] uppercase transition-colors hover:text-[#a07540]"
            style={{ color: '#71675d' }}
          >
            View all <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>

        {/* ── Toolbar ── */}
        <div
          className="flex gap-3 mb-6 p-2 rounded-2xl"
          style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#a09890' }}
            />
            <input
              type="text"
              placeholder="Search fragrances..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-8 rounded-xl text-[13px] outline-none bg-transparent"
              style={{ color: '#181511' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#a09890' }}
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="w-px self-stretch my-1" style={{ background: 'rgba(24,21,17,0.08)' }} />

          {/* Sort */}
          <div className="relative shrink-0" ref={sortRef}>
            <button
              onClick={() => setSortOpen(v => !v)}
              className="h-10 px-4 flex items-center gap-2 rounded-xl text-[12px] font-bold transition-colors"
              style={{ color: '#5a5048' }}
            >
              <SlidersHorizontal size={13} strokeWidth={2} />
              <span className="hidden sm:inline">{activeSortLabel}</span>
              <ChevronDown
                size={12}
                strokeWidth={2.5}
                style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-2xl z-30 overflow-hidden"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(24,21,17,0.1)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                  }}
                >
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setSortOpen(false) }}
                      className="w-full text-left px-4 py-3 text-[13px] font-semibold transition-colors"
                      style={{
                        color: sort === o.value ? '#c9a472' : '#181511',
                        background: sort === o.value ? 'rgba(201,164,114,0.07)' : 'transparent',
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 mb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as any}
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="shrink-0 flex items-center gap-2 px-4 h-9 rounded-full text-[12px] font-bold transition-all duration-250"
                style={{
                  background: isActive ? '#181511' : 'rgba(255,255,255,0.7)',
                  color: isActive ? '#fff' : '#5a5048',
                  border: isActive ? '1px solid #181511' : '1px solid rgba(24,21,17,0.12)',
                  boxShadow: isActive ? '0 4px 14px rgba(11,19,27,0.18)' : 'none',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {tab.name}
                <span
                  className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(24,21,17,0.07)',
                    color: isActive ? 'rgba(255,255,255,0.8)' : '#71675d',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Results meta ── */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-[12.5px] font-medium" style={{ color: '#71675d' }}>
              <span className="font-bold text-[#181511]">{filtered.length}</span>
              {' '}fragrance{filtered.length !== 1 ? 's' : ''} found
            </p>
            {(search || activeTab !== 'all') && (
              <button
                onClick={() => { setSearch(''); setActiveTab('all') }}
                className="text-[11px] font-bold flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: '#c9a472' }}
              >
                <X size={11} strokeWidth={2.5} /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-[20px] overflow-hidden animate-pulse" style={{ background: '#f0ebe3' }}>
                <div className="bg-[#e4ddd3]" style={{ aspectRatio: '3/4' }} />
                <div className="p-4 space-y-3">
                  <div className="h-2.5 w-1/3 rounded-full bg-[#e4ddd3]" />
                  <div className="h-3.5 w-2/3 rounded-full bg-[#e4ddd3]" />
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
            className="flex flex-col items-center py-24 text-center"
          >
            <div
              className="w-16 h-16 flex items-center justify-center rounded-3xl mb-5"
              style={{ background: 'rgba(201,164,114,0.08)', border: '1px solid rgba(201,164,114,0.18)' }}
            >
              <Sparkles size={22} strokeWidth={1.4} style={{ color: '#c9a472' }} />
            </div>
            <p className="text-[16px] font-bold mb-2" style={{ color: '#181511' }}>No fragrances found</p>
            <p className="text-[13px] mb-6" style={{ color: '#71675d' }}>
              {search ? `No results for "${search}"` : 'This category is currently empty.'}
            </p>
            <button
              onClick={() => { setSearch(''); setActiveTab('all') }}
              className="px-5 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase text-white transition-opacity hover:opacity-80"
              style={{ background: '#181511' }}
            >
              Show all
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => <ShowcaseCard key={p.id} product={p} index={i} />)}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── CTA ── */}
        {!loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.22em] uppercase transition-all duration-300 group"
              style={{
                background: '#181511',
                color: '#fff',
                boxShadow: '0 8px 28px rgba(11,19,27,0.2)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = '#c9a472'
                el.style.boxShadow = '0 8px 28px rgba(201,164,114,0.32)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = '#181511'
                el.style.boxShadow = '0 8px 28px rgba(11,19,27,0.2)'
              }}
            >
              Explore full collection
              <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  )
}
