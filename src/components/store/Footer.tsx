import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, Sparkles } from 'lucide-react'

const EXPLORE_LINKS = [
  { label: 'Shop All', to: '/shop' },
  { label: 'Collections', to: '/categories' },
  { label: 'About Velour', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

const CURATION_LINKS = [
  { label: 'Signature Edit', to: '/shop?sort=featured' },
  { label: 'Newest Drops', to: '/shop?sort=newest' },
  { label: 'Price Low to High', to: '/shop?sort=price-asc' },
  { label: 'Best Sellers', to: '/shop?sort=best-sellers' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Shipping & Returns', to: '/shipping' },
]

export default function Footer() {
  return (
    <footer className="w-full relative overflow-hidden" style={{ background: '#181511', color: '#fff' }}>
      {/* ─── Top Banner ─── */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="container-site py-16 md:py-24 text-center">
          <p 
            className="text-[clamp(2.5rem,6vw,4rem)] font-bold italic"
            style={{ 
              fontFamily: "'Playfair Display', serif", 
              background: 'linear-gradient(135deg, #c9a472 0%, #e4c99a 50%, #9a7430 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Your scent. Your signature.
          </p>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="container-site py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="inline-block mb-6 group">
              <span className="block text-[24px] font-black uppercase tracking-[0.3em] text-white transition-colors group-hover:text-[#c9a472]">
                Velour
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.5em] mt-2" style={{ color: '#c9a472' }}>
                Touch of Luxury
              </span>
            </Link>

            <p className="text-[13px] leading-[1.8] max-w-sm mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
              A refined fragrance house shaped around extrait de parfum. We craft memorable presence and a luxury experience that feels calm on every screen.
            </p>

            <div className="flex items-center gap-4">
              <a href="mailto:hello@velour.com" className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#181511]" style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                <Mail size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Links Columns */}
          <div className="md:col-span-7 lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <FooterColumn title="Explore" links={EXPLORE_LINKS} />
            <FooterColumn title="Curated Paths" links={CURATION_LINKS} />
            <FooterColumn title="Client Care" links={LEGAL_LINKS} />
          </div>

        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="container-site py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Velour. Crafted for a premium digital experience.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase" style={{ color: 'rgba(201,164,114,0.6)' }}>
            <Sparkles size={12} strokeWidth={2.5} />
            <span>Responsive Luxury Storefront</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: Array<{ label: string; to: string }>
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: '#c9a472' }}>
        {title}
      </p>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="group inline-flex items-center gap-2 text-[13px] font-medium transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'
              }}
            >
              <span>{link.label}</span>
              <ArrowUpRight 
                size={14} 
                className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" 
                style={{ color: '#c9a472' }}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
