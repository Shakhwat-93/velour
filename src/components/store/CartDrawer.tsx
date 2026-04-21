import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQty, subtotal, itemCount } = useCart()

  return (
    <>
      {state.isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[200] bg-bg-dark/45 backdrop-blur-sm"
          onClick={closeCart}
          aria-label="Close cart"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[201] flex h-full w-full max-w-[28rem] flex-col border-l border-border-subtle bg-surface shadow-[0_18px_60px_rgba(11,19,27,0.16)] transition-transform duration-300 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!state.isOpen}
      >
        <div className="flex items-center justify-between border-b border-border-light px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-secondary text-brand-gold">
              <ShoppingBag size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-heading-md text-[1.15rem]">Your Bag</p>
              <p className="mt-1 text-[0.66rem] uppercase tracking-[0.2em] text-text-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-colors hover:border-brand-gold/30 hover:text-brand-gold"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {state.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-secondary text-brand-gold/45">
                <ShoppingBag size={30} strokeWidth={1.4} />
              </div>
              <h2 className="mt-6 text-heading-md text-[1.55rem]">Your bag is empty</h2>
              <p className="mt-3 max-w-xs text-sm leading-6 text-text-muted">
                Explore the collection and add a signature scent to begin your order.
              </p>
              <button onClick={closeCart} className="btn-luxury btn-luxury-dark btn-md mt-7">
                <span>Continue browsing</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map(({ product, qty, selectedSize, selectedPrice }) => (
                <div
                  key={`${product.id}-${selectedSize}`}
                  className="rounded-[1.4rem] border border-border-subtle bg-bg-primary/65 p-4"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[1rem] bg-bg-secondary">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="truncate text-sm font-semibold text-text-primary">{product.name}</p>
                          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.2em] text-brand-gold/70">
                            {selectedSize || 'Extrait de Parfum'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(product.id, selectedSize)}
                          className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-border-light bg-surface px-2 py-1.5">
                          <button
                            onClick={() => updateQty(product.id, qty - 1, selectedSize)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-secondary hover:text-text-primary"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold text-text-primary">{qty}</span>
                          <button
                            onClick={() => updateQty(product.id, qty + 1, selectedSize)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-secondary hover:text-text-primary"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-text-primary">
                          {formatPrice((selectedPrice ?? product.price) * qty)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t border-border-light bg-bg-primary px-5 py-5 sm:px-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-semibold text-text-primary">{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-5 text-xs leading-5 text-text-muted">Shipping and taxes are calculated at checkout.</p>

            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn-luxury btn-luxury-dark btn-lg flex w-full"
            >
              <span>Proceed to checkout</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
