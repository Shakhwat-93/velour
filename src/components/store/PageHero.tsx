import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface PageHeroProps {
  eyebrow: string
  title: string
  description: string
  breadcrumbs?: BreadcrumbItem[]
  align?: 'left' | 'center'
}

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  align = 'center',
}: PageHeroProps) {
  const isCentered = align === 'center'

  return (
    <header className="page-hero">
      <div className="page-hero__glow" />
      <div className={`container-site relative z-10 ${isCentered ? 'text-center' : ''}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className={`mb-7 flex flex-wrap items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/55 ${
              isCentered ? 'justify-center' : 'justify-start'
            }`}
          >
            {breadcrumbs.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.to ? (
                  <Link to={item.to} className="transition-colors hover:text-brand-gold-light">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white">{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <ChevronRight size={12} />}
              </div>
            ))}
          </nav>
        )}

        <p className={`text-overline mb-5 ${isCentered ? '' : 'lux-kicker'}`}>{eyebrow}</p>
        <h1 className={`text-heading-xl text-balance ${isCentered ? 'mx-auto max-w-4xl' : 'max-w-3xl'}`}>
          {title}
        </h1>
        <p
          className={`mt-5 max-w-2xl text-sm leading-7 text-white/68 md:text-base ${
            isCentered ? 'mx-auto' : ''
          }`}
        >
          {description}
        </p>
      </div>
    </header>
  )
}
