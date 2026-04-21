import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase/client'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Product } from '@/lib/types'

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/categories' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const location = useLocation()
  const { itemCount, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const debouncedQuery = useDebounce(searchQuery, 250)

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen || searchOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen, searchOpen])

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${debouncedQuery}%`)
        .limit(6)

      setSearchResults(data ?? [])
      setIsSearching(false)
    }

    void performSearch()
  }, [debouncedQuery])

  return (
    <>
      <div className="bg-[linear-gradient(90deg,#8f6a39_0%,#b7884e_45%,#8f6a39_100%)] px-4 py-2.5 text-center text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/92 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
        Complimentary shipping on orders over {formatPrice(2500)}{' '}
        <Link to="/shop" className="text-white underline underline-offset-4 transition-colors hover:text-[#fff4dc]">
          Explore the collection
        </Link>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'border-border-subtle bg-[rgba(250,247,242,0.86)] shadow-[0_16px_40px_rgba(11,19,27,0.06)] backdrop-blur-xl'
            : 'border-border-light bg-[rgba(250,247,242,0.96)]'
        }`}
      >
        <div className="container-site">
          <div className="grid min-h-[4.75rem] grid-cols-[auto_1fr_auto] items-center gap-3 md:min-h-[5.4rem] md:grid-cols-[1fr_auto_1fr] md:gap-8">
            <div className="flex items-center gap-2 md:gap-8">
              <button
                onClick={() => setMenuOpen((value) => !value)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-primary transition-colors hover:border-brand-gold/40 hover:text-brand-gold md:hidden"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <nav className="hidden items-center gap-7 md:flex">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-colors ${
                        isActive ? 'text-brand-gold-dark' : 'text-text-primary hover:text-brand-gold-dark'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <Link to="/" className="justify-self-center text-center">
              <span className="block font-display text-[1.45rem] font-semibold uppercase tracking-[0.28em] text-text-primary md:text-[1.65rem]">
                Velour
              </span>
              <span className="mt-1 block text-[0.46rem] font-semibold uppercase tracking-[0.5em] text-brand-gold md:text-[0.5rem]">
                Touch of Luxury
              </span>
            </Link>

            <div className="ml-auto flex items-center justify-end gap-2 md:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-primary transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
                aria-label="Open search"
              >
                <Search size={18} strokeWidth={1.6} />
              </button>

              <button
                onClick={openCart}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-primary transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
                aria-label="Open cart"
              >
                <ShoppingBag size={18} strokeWidth={1.6} />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[0.55rem] font-bold text-white">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border-light bg-bg-primary md:hidden"
            >
              <div className="container-site flex flex-col gap-7 py-6">
                <nav className="flex flex-col gap-5">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `rounded-[1.2rem] border px-4 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.22em] transition-colors ${
                          isActive
                            ? 'border-brand-gold/30 bg-white text-brand-gold-dark'
                            : 'border-border-subtle bg-surface text-text-primary'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>

                <Link
                  to="/shop"
                  className="btn-luxury btn-luxury-dark btn-md w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Shop the signature range</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg-dark/78 backdrop-blur-lg"
            onClick={() => setSearchOpen(false)}
          >
            <div className="container-site flex min-h-full items-start justify-center pt-[10vh]">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => event.stopPropagation()}
                className="surface-panel w-full max-w-3xl overflow-hidden rounded-[2rem]"
              >
                <div className="flex items-center gap-4 border-b border-border-light px-5 py-5 sm:px-7">
                  <Search size={19} className="text-brand-gold" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search the collection"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted/65"
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-colors hover:border-brand-gold/30 hover:text-brand-gold"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto px-5 py-6 sm:px-7">
                  {searchQuery.trim() ? (
                    isSearching ? (
                      <div className="flex min-h-[14rem] flex-col items-center justify-center gap-4 text-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-gold/20 border-t-brand-gold" />
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-text-muted">
                          Searching collection
                        </p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-5">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-brand-gold">
                          Best matches
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              to={`/shop/${product.slug}`}
                              className="flex items-center gap-4 rounded-[1.35rem] border border-border-subtle bg-bg-primary/65 p-3 transition-colors hover:border-brand-gold/30 hover:bg-white"
                            >
                              <div className="h-20 w-16 overflow-hidden rounded-[1rem] bg-bg-secondary">
                                {product.images?.[0] ? (
                                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <Sparkles size={16} className="text-brand-gold/30" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-text-primary">{product.name}</p>
                                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-brand-gold/75">
                                  Extrait de Parfum
                                </p>
                                <p className="mt-2 text-sm text-text-muted">{formatPrice(product.price)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-h-[14rem] flex-col items-center justify-center text-center">
                        <Sparkles size={28} className="mb-4 text-brand-gold/22" strokeWidth={1.5} />
                        <p className="text-base font-medium text-text-primary">No matching fragrances yet</p>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
                          Try a broader name or explore the full collection for a signature profile.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex min-h-[14rem] flex-col items-center justify-center text-center">
                      <Sparkles size={28} className="mb-4 text-brand-gold/22" strokeWidth={1.5} />
                      <p className="text-base font-medium text-text-primary">Search the Velour collection</p>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
                        Discover your next signature scent through our curated range of extrait de parfum.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
