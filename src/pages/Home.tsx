import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Sparkles, Wind, Droplets, Gift } from 'lucide-react'
import HeroSection from '@/components/store/HeroSection'
import ProductShowcase from '@/components/store/ProductShowcase'
import PromoPopup from '@/components/store/PromoPopup'

const FAMILIES = [
  { name: 'Woody', icon: Flame, description: 'Warm, grounding, and quietly magnetic.' },
  { name: 'Fresh', icon: Wind, description: 'Bright, airy, and effortless from day to night.' },
  { name: 'Floral', icon: Sparkles, description: 'Soft bloom, elegant lift, refined texture.' },
  { name: 'Oud', icon: Droplets, description: 'Deep, opulent, and richly memorable.' },
]

const MARQUEE_WORDS = [
  'Luxury fragrance',
  'Long-lasting extrait',
  'Signature presence',
  'Curated scent wardrobe',
  'Modern opulence',
  'Artisan-crafted blends',
]

export default function Home() {
  return (
    <div className="page-enter bg-bg-primary">
      <PromoPopup />
      <HeroSection />
      <Marquee />

      <ProductShowcase />

      <section className="py-24" style={{ background: '#faf7f2' }}>
        <div className="container-site">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-4" style={{ color: '#c9a472' }}>Discovery</p>
            <h2 className="text-[36px] md:text-[44px] font-bold text-balance" style={{ fontFamily: "'Playfair Display', serif", color: '#181511', lineHeight: 1.1 }}>
              Find your signature by olfactive family.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[14px] leading-[1.8]" style={{ color: '#71675d' }}>
              Navigate the collection through scent mood rather than product clutter, with a calmer entry
              point for first-time shoppers.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {FAMILIES.map((family, index) => (
              <motion.article
                key={family.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col p-8 rounded-[24px] overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{ background: '#fff', border: '1px solid rgba(24,21,17,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(201,164,114,0.12)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,164,114,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(24,21,17,0.06)';
                }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-8 transition-transform duration-500 group-hover:scale-110" style={{ background: 'rgba(201,164,114,0.08)', color: '#c9a472' }}>
                  <family.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-[22px] font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#181511' }}>{family.name}</h3>
                <p className="text-[13px] leading-[1.7] flex-1 mb-8" style={{ color: '#71675d' }}>{family.description}</p>
                <Link
                  to="/categories"
                  className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                  style={{ color: '#c9a472' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#181511')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#c9a472')}
                >
                  Explore collection
                  <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[linear-gradient(180deg,rgba(243,236,228,0.28)_0%,rgba(250,247,242,0)_100%)]">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-14 xl:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="relative overflow-hidden rounded-[2rem] bg-bg-secondary shadow-[0_20px_60px_rgba(11,19,27,0.12)] sm:rounded-[2.4rem]"
            >
              <img
                src="/images/lifestyle/lifestyle-1.jpg"
                alt="Velour fragrance editorial"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.35rem] border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:inset-x-8 sm:bottom-8 sm:p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/82">
                  Established 2024 • Dhaka
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="max-w-xl"
            >
              <p className="text-overline mb-5">The Velour promise</p>
              <h2 className="text-heading-lg text-balance">
                Crafted for those who expect calm luxury, not noise.
              </h2>
              <div className="mt-6 space-y-5 text-sm leading-7 text-text-muted md:text-base md:leading-8">
                <p>
                  Every Velour fragrance is built to feel deliberate on the skin: richer concentration,
                  longer wear, and a profile that unfolds with depth rather than shouting for attention.
                </p>
                <p>
                  We focus on premium materials, polished presentation, and a curated catalog so the
                  storefront feels as intentional as the scents themselves.
                </p>
              </div>

              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-4 rounded-full border border-border-gold bg-white px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-text-primary transition-all hover:border-brand-gold hover:text-brand-gold-dark"
              >
                Discover our story
                <ArrowRight size={15} strokeWidth={2.1} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <ArtOfGifting />
    </div>
  )
}

function Marquee() {
  const track = [...MARQUEE_WORDS, ...MARQUEE_WORDS]

  return (
    <div className="overflow-hidden border-y border-white/5 bg-bg-dark py-4">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        className="flex min-w-max gap-8 whitespace-nowrap pr-8 text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/42 sm:gap-12"
      >
        {track.map((word, index) => (
          <div key={`${word}-${index}`} className="flex items-center gap-8 sm:gap-12">
            <span>{word}</span>
            <span className="text-brand-gold/70">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function ArtOfGifting() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32" style={{ background: '#181511' }}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[100px]" style={{ background: 'radial-gradient(circle, #c9a472 0%, transparent 70%)' }} />

      <div className="container-site relative z-10">
        <div className="mx-auto max-w-4xl rounded-[32px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
          <div className="px-6 py-16 md:px-16 md:py-20 text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(201,164,114,0.1)', border: '1px solid rgba(201,164,114,0.2)' }}>
              <Gift className="text-[#c9a472]" size={24} strokeWidth={1.5} />
            </div>
            
            <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-4" style={{ color: '#c9a472' }}>The Art of Presentation</p>
            
            <h2 
              className="text-[32px] md:text-[48px] font-bold text-balance mb-6 mx-auto max-w-2xl" 
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                background: 'linear-gradient(135deg, #ffffff 0%, #e8e2d9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1
              }}
            >
              Elevate every occasion.
            </h2>
            
            <p className="mx-auto max-w-lg text-[14px] leading-[1.8] mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Every Velour fragrance arrives in our signature heavyweight glass and bespoke packaging. Elevate your moments with a gift designed to make an unforgettable impression.
            </p>

            <Link 
              to="/shop" 
              className="inline-flex items-center gap-3 h-14 px-10 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 active:scale-95 group mx-auto"
              style={{ background: '#fff', color: '#181511', boxShadow: '0 8px 24px rgba(255,255,255,0.1)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#c9a472';
                (e.currentTarget as HTMLElement).style.color = '#fff';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(201,164,114,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#fff';
                (e.currentTarget as HTMLElement).style.color = '#181511';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(255,255,255,0.1)';
              }}
            >
              Explore Gifting
              <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
