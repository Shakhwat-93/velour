import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Sparkles, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleQuickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    addItem(product)
    toast(`Added ${product.name} to bag`)
  }

  const primaryImage = product.images?.[0]
  const secondaryImage = product.images?.[1]
  const hasDiscount = !!product.compare_at_price && product.compare_at_price > product.price
  const description = getExcerpt(product.description)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="group h-full"
    >
      <Link
        to={`/shop/${product.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-[1.9rem] border border-black/6 bg-[linear-gradient(180deg,#fffdf9_0%,#ffffff_100%)] p-3 shadow-[0_18px_40px_rgba(11,19,27,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(11,19,27,0.11)] sm:rounded-[2rem]"
      >
        <div className="relative overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,#f7f2eb_0%,#efe7de_100%)]">
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(event) => event.preventDefault()}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text-muted shadow-sm backdrop-blur transition-colors hover:text-brand-gold sm:right-4 sm:top-4"
          >
            <Heart size={16} strokeWidth={1.8} />
          </button>

          <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
            <span className="rounded-full bg-white/92 px-3 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.18em] text-text-primary shadow-sm backdrop-blur">
              Extrait
            </span>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[15rem] px-4 pb-8 pt-6 sm:px-5 sm:pb-10 sm:pt-8">
            {primaryImage ? (
              <>
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-contain px-4 pb-8 pt-6 drop-shadow-[0_20px_26px_rgba(11,19,27,0.12)] transition-all duration-700 group-hover:scale-[1.02] sm:px-5 sm:pb-10 sm:pt-8"
                />
                {secondaryImage && (
                  <img
                    src={secondaryImage}
                    alt={`${product.name} alternate view`}
                    className="absolute inset-0 hidden h-full w-full object-contain px-4 pb-8 pt-6 opacity-0 transition-opacity duration-500 md:block md:group-hover:opacity-100 sm:px-5 sm:pb-10 sm:pt-8"
                  />
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={24} className="text-brand-gold/35" strokeWidth={1.4} />
              </div>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-white/94 px-3.5 py-2 text-[0.58rem] font-medium text-text-primary shadow-[0_10px_20px_rgba(11,19,27,0.08)] backdrop-blur">
              <span className="font-semibold">4.9</span>
              <Star size={11} className="fill-brand-gold text-brand-gold" strokeWidth={1.8} />
              <span className="text-text-muted">Curated</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
          <div className="flex flex-wrap items-center gap-2">
            {product.featured && (
              <span className="rounded-full bg-brand-gold/12 px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-brand-gold-dark">
                Best Seller
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-full border border-black/10 px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-text-primary">
                Curated Offer
              </span>
            )}
          </div>

          <div className="mt-4 flex-1">
            <h3 className="text-[1rem] font-semibold leading-6 text-text-primary transition-colors duration-300 group-hover:text-brand-gold-dark sm:text-[1.06rem]">
              {product.name}
            </h3>
            <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-text-muted">
              Signature fragrance
            </p>
            <p className="mt-3 text-[0.78rem] leading-6 text-text-muted sm:text-[0.82rem]">
              {description}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-[1.25rem] border border-black/8 bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                Price
              </p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[1rem] font-semibold text-text-primary sm:text-[1.08rem]">
                  {formatPrice(product.price)}
                </p>
                {hasDiscount && (
                  <p className="text-[0.7rem] text-text-muted/70 line-through">
                    {formatPrice(product.compare_at_price as number)}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] bg-bg-dark text-white shadow-[0_12px_22px_rgba(11,19,27,0.18)] transition-all duration-300 hover:bg-brand-gold-dark active:scale-[0.96]"
              aria-label={`Add ${product.name} to bag`}
            >
              <ShoppingBag size={17} strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function getExcerpt(description: string | null) {
  if (!description) {
    return 'A composed extrait de parfum designed for quiet confidence and long-lasting presence.'
  }

  const clean = description.replace(/\s+/g, ' ').trim()

  if (clean.length < 18) {
    return 'A composed extrait de parfum designed for quiet confidence and long-lasting presence.'
  }

  return clean.length > 84 ? `${clean.slice(0, 81)}...` : clean
}
