import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  {
    name: 'Pour Homme',
    slug: 'pour-homme',
    image: '/images/products/stronger-with-you.png',
  },
  {
    name: 'Pour Femme',
    slug: 'pour-femme',
    image: '/images/products/ysl-libre.png',
  },
  {
    name: 'Unisex',
    slug: 'unisex',
    image: '/images/products/black-opium.png',
  },
]

export default function CategoryStrip() {
  return (
    <section className="section-padding bg-[var(--color-bg)]">
      <div className="container-site">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-heading-lg mb-3">Curated Collections</h2>
            <div className="divider ml-0" />
          </div>
          <Link
            to="/categories"
            className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors"
          >
            Explore All
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map(category => (
            <Link
              key={category.slug}
              to={`/categories/${category.slug}`}
              className="group relative h-[400px] rounded-2xl overflow-hidden bg-[var(--color-card-bg)] flex items-center justify-center p-8"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              {/* Text */}
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-medium text-white mb-2 font-display tracking-wide group-hover:text-[var(--color-accent)] transition-colors">
                  {category.name}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                  Shop Category
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
