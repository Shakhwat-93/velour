import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  ChevronRight, Minus, Plus, ShoppingBag, 
  Heart, Star, ShieldCheck, Truck, RotateCcw, 
  Sparkles, Info, Droplets, Wind, Mountain
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Product } from '@/lib/types'
import { ShowcaseCard } from '@/components/store/ProductShowcase'

/* ─── Types & Defaults ────────────────────────────────────────────────── */
const DEFAULT_NOTES = {
  top: 'Bergamot, Pink Pepper, Saffron',
  heart: 'Bulgarian Rose, Jasmine, Nutmeg',
  base: 'Oud, Vanilla, Sandalwood, Amber',
}

/* ─── Components ────────────────────────────────────────────────────── */

function DetailAccordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b" style={{ borderColor: 'rgba(24,21,17,0.08)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between group transition-colors hover:text-[#c9a472]"
      >
        <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-left">{title}</span>
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Plus 
            size={16} 
            className={`absolute transition-transform duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} 
            style={{ color: '#71675d' }}
          />
          <Minus 
            size={16} 
            className={`absolute transition-transform duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} 
            style={{ color: '#c9a472' }}
          />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[14px] leading-relaxed text-[#5a5048]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NoteItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl border bg-white/40" style={{ borderColor: 'rgba(24,21,17,0.06)' }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,164,114,0.1)' }}>
          <Icon size={14} style={{ color: '#c9a472' }} />
        </div>
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#c9a472' }}>{label}</span>
      </div>
      <p className="text-[13px] font-semibold text-[#181511] leading-tight">{value}</p>
    </div>
  )
}

/* ─── Main Page ───────────────────────────────────────────────────────── */

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isWished, setIsWished] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return
      setLoading(true)
      
      const { data, error } = await (supabase as any)
        .from('products')
        .select('*, category:categories(id,name,slug)')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        navigate('/shop')
        return
      }

      setProduct(data as Product)
      setActiveImage(0)
      setQty(1)

      // Fetch related products from same category
      const { data: relatedData } = await (supabase as any)
        .from('products')
        .select('*, category:categories(id,name,slug)')
        .eq('category_id', data.category_id)
        .neq('id', data.id)
        .limit(4)

      setRelated((relatedData as Product[]) ?? [])
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    fetchProduct()
  }, [slug, navigate])

  const handleAdd = () => {
    if (!product) return
    addItem(product, qty)
    toast(`${product.name} added to bag`)
  }

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#e8e2d9] border-t-[#c9a472] animate-spin" />
      </div>
    )
  }

  if (!product) return null

  const images = product.images?.length ? product.images : []
  const hasDiscount = !!product.compare_at_price && product.compare_at_price > product.price
  const discountPct = hasDiscount ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100) : 0

  return (
    <div className="page-enter" style={{ background: '#faf7f2' }}>
      
      {/* ── Breadcrumbs ── */}
      <div className="container-site py-6">
        <nav className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[#a09890]">
          <Link to="/" className="hover:text-[#181511] transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-[#181511] transition-colors">Collection</Link>
          <ChevronRight size={10} />
          {product.category?.name && (
            <>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-[#181511] transition-colors">{product.category.name}</Link>
              <ChevronRight size={10} />
            </>
          )}
          <span className="text-[#181511] truncate max-w-[150px]">{product.name}</span>
        </nav>
      </div>

      <main className="container-site pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* ── Gallery ── */}
          <div className="flex flex-col gap-6">
            <div 
              className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white"
              style={{ 
                background: 'linear-gradient(145deg, #f7f1e8 0%, #ede4d6 100%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.04)'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-12 md:p-20"
                >
                  {images[activeImage] ? (
                    <img 
                      src={images[activeImage]} 
                      alt={product.name} 
                      className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                    />
                  ) : (
                    <Sparkles size={64} strokeWidth={1} style={{ color: 'rgba(201,164,114,0.3)' }} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                {product.featured && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.15em] uppercase text-white"
                    style={{ background: 'linear-gradient(135deg,#c9a472,#a07540)', boxShadow: '0 4px 12px rgba(201,164,114,0.3)' }}>
                    Signature
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.15em] uppercase text-white bg-[#e85454]"
                    style={{ boxShadow: '0 4px 12px rgba(232,84,84,0.3)' }}>
                    -{discountPct}% Off
                  </span>
                )}
              </div>

              {/* Wishlist Toggle */}
              <button
                onClick={() => setIsWished(!isWished)}
                className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90"
                style={{ 
                  background: 'rgba(255,255,255,0.9)', 
                  backdropFilter: 'blur(10px)',
                  color: isWished ? '#ef4444' : '#181511',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <Heart size={20} fill={isWished ? '#ef4444' : 'none'} strokeWidth={1.5} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300"
                    style={{ 
                      borderColor: activeImage === idx ? '#c9a472' : 'transparent',
                      background: '#fff',
                      boxShadow: activeImage === idx ? '0 8px 24px rgba(201,164,114,0.2)' : 'none'
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#c9a472" stroke="none" />)}
              </div>
              <span className="text-[12px] font-bold text-[#181511]">4.9</span>
              <span className="w-1 h-1 rounded-full bg-[#d1c9bf]" />
              <span className="text-[12px] font-medium text-[#71675d]">142 Verified Reviews</span>
            </div>

            <h1 className="text-[42px] font-bold leading-[1.1] mb-6 text-[#181511]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-[28px] font-bold text-[#181511]">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-[18px] line-through text-[#a09890]">{formatPrice(product.compare_at_price!)}</span>
              )}
            </div>

            <p className="text-[15px] leading-[1.8] text-[#5a5048] mb-10 max-w-lg">
              {product.description || 'A masterpiece of olfactory precision, crafted for those who define elegance through subtlety. This extrait de parfum evolves gracefully throughout the day, leaving a trail of quiet confidence.'}
            </p>

            {/* Scent Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <NoteItem icon={Droplets} label="Top Notes" value={DEFAULT_NOTES.top} />
              <NoteItem icon={Wind} label="Heart Notes" value={DEFAULT_NOTES.heart} />
              <NoteItem icon={Mountain} label="Base Notes" value={DEFAULT_NOTES.base} />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center h-[56px] rounded-2xl bg-white border px-2" style={{ borderColor: 'rgba(24,21,17,0.1)' }}>
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 flex items-center justify-center text-[#71675d] hover:text-[#181511] transition-colors"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="w-12 text-center text-[16px] font-bold text-[#181511]">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 flex items-center justify-center text-[#71675d] hover:text-[#181511] transition-colors"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 h-[56px] flex items-center justify-center gap-3 rounded-2xl text-[12px] font-black tracking-[0.2em] uppercase text-white transition-all duration-300 active:scale-[0.98] group"
                style={{ 
                  background: '#181511',
                  boxShadow: '0 8px 30px rgba(11,19,27,0.15)'
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#c9a472'
                  el.style.boxShadow = '0 8px 30px rgba(201,164,114,0.35)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#181511'
                  el.style.boxShadow = '0 8px 30px rgba(11,19,27,0.15)'
                }}
              >
                <ShoppingBag size={18} strokeWidth={2} />
                Add to Bag — {formatPrice(product.price * qty)}
              </button>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 border border-white">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#181511]">100% Authentic</p>
                  <p className="text-[11px] text-[#71675d]">Directly from source</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 border border-white">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#181511]">Free Shipping</p>
                  <p className="text-[11px] text-[#71675d]">On orders over {formatPrice(5000)}</p>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="flex flex-col border-t" style={{ borderColor: 'rgba(24,21,17,0.08)' }}>
              <DetailAccordion title="Performance & Sillage" defaultOpen>
                Our extrait de parfum concentration ensures a long-lasting presence of 8-10 hours with a moderate to high sillage that captures attention without being overwhelming.
              </DetailAccordion>
              <DetailAccordion title="Ingredients">
                Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Geraniol, Coumarin, Citral, Benzyl Benzoate, Eugenol.
              </DetailAccordion>
              <DetailAccordion title="Shipping & Returns">
                We offer premium shipping worldwide. Domestic orders arrive in 2-3 business days. Due to the nature of fragrances, we accept returns within 14 days only if the security seal is intact.
              </DetailAccordion>
            </div>
          </div>
        </div>
      </main>

      {/* ── Related Collection ── */}
      {related.length > 0 && (
        <section className="bg-white py-24 border-t" style={{ borderColor: 'rgba(24,21,17,0.08)' }}>
          <div className="container-site">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a472' }}>Complementary</p>
                <h2 className="text-[32px] font-bold text-[#181511]" style={{ fontFamily: "'Playfair Display', serif" }}>More from this collection</h2>
              </div>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.15em] uppercase text-[#71675d] hover:text-[#c9a472] transition-colors"
              >
                View all <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item, idx) => (
                <div key={item.id}>
                  <ShowcaseCard product={item} index={idx} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Fine Detail Footer ── */}
      <div className="bg-[#181511] py-10">
        <div className="container-site flex flex-col items-center text-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 mb-6">
            <Sparkles size={20} style={{ color: '#c9a472' }} />
          </div>
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/40 mb-2">The Velour Promise</p>
          <p className="text-white/70 text-[14px] max-w-sm">Every fragrance is a journey, meticulously curated for the discerning individual.</p>
        </div>
      </div>
    </div>
  )
}
function ArrowRight(props: any) {
  return <ChevronRight {...props} className="rotate-0" />
}
