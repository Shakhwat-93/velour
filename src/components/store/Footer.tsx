import { ArrowUpRight, Mail, Sparkles, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

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
            Velour isn't just a scent, it's an experience
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
              Velour is more than a fragrance—it's a curated journey of modern opulence and artisan-crafted blends, designed for those who expect the finest.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Phone size={16} strokeWidth={1.5} className="text-[#c9a472]" />
                <span>01865-091230</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Mail size={16} strokeWidth={1.5} className="text-[#c9a472]" />
                <a href="mailto:velour486@gmail.com" className="hover:text-white transition-colors">velour486@gmail.com</a>
              </div>
              <div className="flex items-center gap-3 text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <MapPin size={16} strokeWidth={1.5} className="text-[#c9a472]" />
                <span>Dhaka, Narayanganj, Bangladesh, 1306</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/velour.byofficial?mibextid=wwXIfr" 
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#181511]" 
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/velour.byofficial" 
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#181511]" 
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@velour.byofficial" 
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#181511]" 
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
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
        <div className="container-site flex flex-col items-center justify-center gap-5 py-8 text-center md:flex-row md:justify-between md:text-left">
          <p className="max-w-[18rem] text-center text-[9px] font-black uppercase leading-6 tracking-[0.18em] md:max-w-none md:text-left md:text-[10px] md:tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.34)' }}>
            &copy; {new Date().getFullYear()} Velour. Crafted for a premium digital experience.
          </p>
          <a
            href="https://shakhwatrasel.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex max-w-[18rem] items-center justify-center gap-2 text-center text-[9px] font-bold uppercase leading-5 tracking-[0.16em] transition-colors hover:text-white md:max-w-none md:text-[10px] md:tracking-[0.12em]"
            style={{ color: 'rgba(201,164,114,0.72)' }}
          >
            <Sparkles size={12} strokeWidth={2.5} className="shrink-0" />
            <span className="text-balance">Developed by Shakhwat Hossain Rasel</span>
            <ArrowUpRight
              size={13}
              className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
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
