import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Lock, ShieldCheck, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { formatPrice } from '@/lib/utils/formatPrice'
import { supabase } from '@/lib/supabase/client'
import type { OrderItem, ShippingAddress } from '@/lib/types'

export default function Checkout() {
  const { state, subtotal, clearCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })

  const deliveryFee = subtotal > 2500 ? 0 : 150
  const total = subtotal + deliveryFee

  if (state.items.length === 0 && !loading) {
    return (
      <div className="page-enter flex min-h-[72vh] items-center justify-center bg-bg-primary px-4 py-14">
        <div className="surface-panel max-w-xl rounded-[2rem] px-6 py-10 text-center sm:px-8 sm:py-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-bg-secondary text-brand-gold/45">
            <Truck size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-heading-md text-[1.9rem]">Your bag is empty</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-text-muted">
            Add a fragrance to your bag before moving into checkout.
          </p>
          <Link to="/shop" className="btn-luxury btn-luxury-dark btn-lg mt-8">
            <span>Explore the collection</span>
          </Link>
        </div>
      </div>
    )
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const orderItems: OrderItem[] = state.items.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        qty: item.qty,
        price: item.selectedPrice ?? item.product.price,
        size: item.selectedSize,
        image: item.product.images?.[0],
        product: item.product,
      }))

      const shippingAddress: ShippingAddress = {
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        address_line1: form.address,
        city: form.city,
        postalCode: form.postalCode,
        postal_code: form.postalCode,
      }

      const { error } = await (supabase as any)
        .from('orders')
        .insert({
          status: 'pending',
          items: orderItems,
          shipping_address: shippingAddress,
          subtotal,
          total,
          user_id: null,
        })

      if (error) throw error

      clearCart()
      navigate('/order-success')
    } catch (error) {
      console.error('Checkout error:', error)
      toast('Failed to place order. Please try again.', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="page-enter bg-bg-primary">
      <div className="container-site section-padding-tight">
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-brand-gold-dark"
          >
            <ArrowLeft size={14} strokeWidth={2.1} />
            Back to shop
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_24rem] xl:grid-cols-[1fr_27rem] xl:gap-10">
          <div className="surface-panel rounded-[2rem] px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-overline mb-4">Secure checkout</p>
            <h1 className="text-heading-lg text-balance">A calmer, premium checkout flow for the final step.</h1>

            <div className="mt-7 flex items-center gap-3 rounded-full border border-border-light bg-bg-primary px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-text-muted">
              <span className="rounded-full bg-brand-gold px-3 py-1 text-white">01 Shipping</span>
              <span>02 Payment</span>
            </div>

            <form id="checkout-form" onSubmit={handleCheckout} className="mt-8 space-y-8">
              <section>
                <h2 className="lux-label">Contact information</h2>
                <div className="grid gap-4">
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleInput}
                    className="lux-input"
                  />
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleInput}
                    className="lux-input"
                  />
                </div>
              </section>

              <section>
                <h2 className="lux-label">Shipping address</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleInput}
                    className="lux-input"
                  />
                  <input
                    required
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleInput}
                    className="lux-input"
                  />
                  <div className="md:col-span-2">
                    <input
                      required
                      type="text"
                      name="address"
                      placeholder="Street address"
                      value={form.address}
                      onChange={handleInput}
                      className="lux-input"
                    />
                  </div>
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleInput}
                    className="lux-input"
                  />
                  <input
                    required
                    type="text"
                    name="postalCode"
                    placeholder="Postal code"
                    value={form.postalCode}
                    onChange={handleInput}
                    className="lux-input"
                  />
                </div>
              </section>

              <section>
                <h2 className="lux-label">Payment method</h2>
                <div className="rounded-[1.5rem] border border-brand-gold/25 bg-brand-gold/8 px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Cash on delivery</p>
                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        Confirm the order now and pay securely when it arrives.
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-gold px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white">
                      Selected
                    </span>
                  </div>
                </div>
              </section>

              <button type="submit" disabled={loading} className="btn-luxury btn-luxury-dark btn-lg flex w-full">
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing order</span>
                  </>
                ) : (
                  <span>Complete order</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[0.72rem] text-text-muted">
                <Lock size={14} className="text-brand-gold" />
                <span>256-bit secure checkout</span>
              </div>
            </form>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="surface-panel rounded-[2rem] px-5 py-6 sm:px-6">
              <p className="text-overline mb-4">Order summary</p>
              <div className="space-y-4">
                {state.items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 rounded-[1.3rem] border border-border-light bg-bg-primary/75 p-3"
                  >
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[0.9rem] bg-bg-secondary">
                      {item.product.images?.[0] && (
                        <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                      )}
                      <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-bg-dark px-1 text-[0.55rem] font-bold text-white">
                        {item.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-primary">{item.product.name}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-brand-gold/70">{item.selectedSize || 'Standard'}</p>
                      <p className="mt-1 text-xs text-text-muted">{formatPrice(item.selectedPrice ?? item.product.price)}</p>
                    </div>
                    <p className="text-sm font-semibold text-text-primary">
                      {formatPrice((item.selectedPrice ?? item.product.price) * item.qty)}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-border-light pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-semibold text-text-primary">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-text-muted">
                    <Truck size={14} className="text-brand-gold" />
                    Shipping
                  </span>
                  <span className="font-semibold text-text-primary">
                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex items-end justify-between border-t border-border-light pt-4">
                  <div>
                    <p className="text-text-primary">Total</p>
                    <p className="text-xs text-text-muted">Including taxes</p>
                  </div>
                  <p className="font-display text-2xl text-brand-gold-dark">{formatPrice(total)}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 rounded-[1.4rem] border border-border-light bg-bg-primary/80 p-4">
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <ShieldCheck size={16} className="text-brand-gold" />
                  <span>Authenticity guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <Lock size={16} className="text-brand-gold" />
                  <span>Encrypted order transmission</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
