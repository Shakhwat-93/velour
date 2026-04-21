import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ShieldCheck, Sparkles, Star, Droplets } from 'lucide-react'

const STATS = [
  { icon: Sparkles, label: 'Pure Ingredients', description: 'Rare naturals curated with precision.' },
  { icon: Droplets, label: 'Extrait Concentration', description: 'A richer trail with longer wear.' },
  { icon: ShieldCheck, label: 'Authentic Design', description: 'Original compositions made to stand apart.' },
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2])

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[min(48rem,100svh)] items-end overflow-hidden bg-bg-dark"
    >
      <motion.div style={{ y: mediaY }} className="absolute inset-0">
        <picture>
          <source srcSet="/images/hero-mobile.png" media="(max-width: 767px)" />
          <source srcSet="/images/hero-desktop.webp" type="image/webp" />
          <img
            src="/images/hero-desktop.png"
            alt="Velour luxury perfume collection"
            className="h-full w-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,19,27,0.96)_0%,rgba(11,19,27,0.74)_34%,rgba(11,19,27,0.32)_65%,rgba(11,19,27,0.1)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,19,27,0.12)_0%,rgba(11,19,27,0)_42%,rgba(11,19,27,0.68)_100%)]" />
      </motion.div>

      <div className="pointer-events-none absolute -right-8 top-20 h-56 w-56 rounded-full bg-brand-gold/18 blur-[84px] sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute bottom-16 left-[18%] h-44 w-44 rounded-full bg-[#e7cbb2]/16 blur-[90px] sm:h-60 sm:w-60" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-site relative z-10 flex w-full flex-col justify-end pb-8 pt-24 sm:pb-10 lg:pb-0"
      >
        <div className="max-w-3xl pb-10 sm:pb-12 lg:max-w-[43rem] lg:pb-24">
          <p className="lux-kicker mb-5">The Signature Collection</p>

          <h1 className="text-hero text-balance max-w-[12ch] text-white">
            Elevate your <span className="text-brand-gold-light">presence.</span>
          </h1>

          <p className="mt-5 max-w-xl text-[0.98rem] leading-7 text-white/74 sm:text-[1.05rem] sm:leading-8">
            Masterfully crafted fragrances designed to linger with confidence, depth, and a premium
            presence that feels unmistakably Velour.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to="/shop" className="btn-luxury btn-luxury-light btn-lg">
              <span>Discover collection</span>
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>

            <div className="flex items-center gap-4 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-white/78 backdrop-blur sm:px-5">
              <div className="flex -space-x-2">
                {[4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-9 w-9 overflow-hidden rounded-full border-2 border-bg-dark bg-white/12"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${item + 18}`}
                      alt="Customer portrait"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-brand-gold-light">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} size={12} fill="currentColor" strokeWidth={1.6} />
                  ))}
                </div>
                <p className="mt-1 text-[0.63rem] font-semibold uppercase tracking-[0.22em] text-white/88">
                  Loved by 10k+ clients
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden rounded-t-[2rem] border border-white/10 bg-[rgba(11,19,27,0.48)] backdrop-blur lg:block">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {STATS.map((item) => (
              <div key={item.label} className="flex items-center gap-4 px-8 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/6">
                  <item.icon size={18} className="text-brand-gold-light" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-white/54">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
