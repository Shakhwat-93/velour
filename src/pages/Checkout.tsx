import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Loader2,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { formatPrice } from '@/lib/utils/formatPrice'
import { supabase } from '@/lib/supabase/client'
import type { DeliveryArea, OrderItem, ShippingAddress } from '@/lib/types'

const DELIVERY_OPTIONS: Record<
  DeliveryArea,
  { label: string; detail: string; fee: number }
> = {
  inside_dhaka: {
    label: 'Inside Dhaka',
    detail: 'Dhaka city delivery charge',
    fee: 80,
  },
  outside_dhaka: {
    label: 'Outside Dhaka',
    detail: 'Nationwide delivery charge',
    fee: 130,
  },
}

const ORDER_GUARD_HOURS = 3
const ORDER_GUARD_MS = ORDER_GUARD_HOURS * 60 * 60 * 1000
const DEVICE_STORAGE_KEY = 'velour_device_id'
const LAST_ORDER_STORAGE_KEY = 'velour_last_order_guard'

type ClientMeta = {
  ip: string
  userAgent: string
}

type BlockModalState = {
  open: boolean
  remainingMinutes: number
  reason: string
}

const createDeviceId = () => {
  const cryptoValue = window.crypto?.randomUUID?.()
  if (cryptoValue) return cryptoValue

  return `velour-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const getDeviceId = () => {
  const existing = localStorage.getItem(DEVICE_STORAGE_KEY)
  if (existing) return existing

  const deviceId = createDeviceId()
  localStorage.setItem(DEVICE_STORAGE_KEY, deviceId)
  return deviceId
}

const getClientMeta = async (): Promise<ClientMeta> => {
  try {
    const response = await fetch('/api/client-meta')
    if (!response.ok) throw new Error('Unable to detect client metadata.')
    const data = await response.json()

    return {
      ip: data.ip || 'unknown',
      userAgent: data.userAgent || navigator.userAgent || '',
    }
  } catch {
    return {
      ip: 'unknown',
      userAgent: navigator.userAgent || '',
    }
  }
}

const getRemainingMinutes = (createdAt: string) => {
  const nextAllowedAt = new Date(createdAt).getTime() + ORDER_GUARD_MS
  return Math.max(1, Math.ceil((nextAllowedAt - Date.now()) / 60000))
}

const getLocalRecentOrder = () => {
  try {
    const raw = localStorage.getItem(LAST_ORDER_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      created_at: string
      device_id: string
      ip_address: string
    }
    const createdAt = new Date(parsed.created_at).getTime()
    if (!Number.isFinite(createdAt) || Date.now() - createdAt >= ORDER_GUARD_MS)
      return null
    return parsed
  } catch {
    return null
  }
}

export default function Checkout() {
  const { state, subtotal, clearCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [blockModal, setBlockModal] = useState<BlockModalState>({
    open: false,
    remainingMinutes: 0,
    reason: '',
  })
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    deliveryArea: 'inside_dhaka' as DeliveryArea,
  })

  const selectedDelivery = DELIVERY_OPTIONS[form.deliveryArea]
  const deliveryFee = selectedDelivery.fee
  const total = subtotal + deliveryFee

  useEffect(() => {
    document.body.classList.toggle('order-block-open', blockModal.open)
    return () => document.body.classList.remove('order-block-open')
  }, [blockModal.open])

  if (state.items.length === 0 && !loading) {
    return (
      <div className="page-enter flex min-h-[72vh] items-center justify-center bg-bg-primary px-4 py-14">
        <div className="surface-panel max-w-xl rounded-[2rem] px-6 py-10 text-center sm:px-8 sm:py-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-bg-secondary text-brand-gold/45">
            <Truck size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-heading-md text-[1.9rem]">
            Your bag is empty
          </h1>
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
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleDeliveryArea = (deliveryArea: DeliveryArea) => {
    setForm((previous) => ({ ...previous, deliveryArea }))
  }

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const deviceId = getDeviceId()
      const clientMeta = await getClientMeta()
      const localRecentOrder = getLocalRecentOrder()

      if (localRecentOrder) {
        setBlockModal({
          open: true,
          remainingMinutes: getRemainingMinutes(localRecentOrder.created_at),
          reason: 'A recent order was already placed from this device.',
        })
        setLoading(false)
        return
      }

      const cutoff = new Date(Date.now() - ORDER_GUARD_MS).toISOString()
      const { data: recentOrders, error: recentOrderError } = await (
        supabase as any
      )
        .from('orders')
        .select('id, created_at, shipping_address')
        .gte('created_at', cutoff)
        .order('created_at', { ascending: false })

      if (recentOrderError) {
        console.warn('Order guard lookup failed:', recentOrderError)
      }

      const matchedRecentOrder = (recentOrders || []).find((order: any) => {
        const antiFraud = order.shipping_address?.anti_fraud || {}
        const sameDevice =
          antiFraud.device_id && antiFraud.device_id === deviceId
        const sameIp =
          clientMeta.ip !== 'unknown' &&
          antiFraud.ip_address &&
          antiFraud.ip_address === clientMeta.ip
        return sameDevice || sameIp
      })

      if (matchedRecentOrder) {
        setBlockModal({
          open: true,
          remainingMinutes: getRemainingMinutes(matchedRecentOrder.created_at),
          reason:
            'A recent order was already placed from this device or network.',
        })
        setLoading(false)
        return
      }

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
        full_name: form.fullName.trim(),
        firstName: form.fullName.trim(),
        lastName: '',
        email: '',
        phone: form.phone,
        address: form.address,
        address_line1: form.address,
        city: '',
        postalCode: '',
        postal_code: '',
        delivery_area: form.deliveryArea,
        delivery_label: selectedDelivery.label,
        delivery_fee: deliveryFee,
        anti_fraud: {
          device_id: deviceId,
          ip_address: clientMeta.ip,
          user_agent: clientMeta.userAgent,
          checked_at: new Date().toISOString(),
          lock_hours: ORDER_GUARD_HOURS,
        },
      }

      const { error } = await (supabase as any).from('orders').insert({
        status: 'pending',
        items: orderItems,
        shipping_address: shippingAddress,
        subtotal,
        total,
        user_id: null,
      })

      if (error) throw error

      localStorage.setItem(
        LAST_ORDER_STORAGE_KEY,
        JSON.stringify({
          created_at: new Date().toISOString(),
          device_id: deviceId,
          ip_address: clientMeta.ip,
        }),
      )
      clearCart()
      navigate('/order-success')
    } catch (error) {
      console.error('Checkout error:', error)
      toast('Failed to place order. Please try again.', 'error')
      setLoading(false)
    }
  }

  const orderBlockModal =
    typeof document === 'undefined'
      ? null
      : createPortal(
          <AnimatePresence>
            {blockModal.open && (
              <div className="fixed inset-0 z-[10000] flex min-h-dvh items-center justify-center px-4 py-5 sm:px-4 sm:py-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#181511]/50 backdrop-blur-[3px]"
                  onClick={() =>
                    setBlockModal((previous) => ({ ...previous, open: false }))
                  }
                />
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.96 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                  className="surface-panel relative z-10 flex max-h-[calc(100dvh-2.5rem)] w-full max-w-[22.5rem] flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.22)] sm:max-h-[calc(100dvh-4rem)] sm:max-w-md"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setBlockModal((previous) => ({
                        ...previous,
                        open: false,
                      }))
                    }
                    className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-white text-text-primary transition-colors hover:text-brand-gold-dark"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>

                  <div className="flex-1 overflow-y-auto px-6 pb-6 pt-14 text-center sm:px-8 sm:pb-10 sm:pt-12">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-text-primary sm:h-16 sm:w-16">
                      <Clock
                        size={30}
                        strokeWidth={1.7}
                        className="sm:size-[38px]"
                      />
                    </div>
                    <p className="mt-5 text-[0.62rem] font-black uppercase tracking-[0.34em] text-brand-gold sm:mt-7 sm:text-[0.68rem] sm:tracking-[0.42em]">
                      Order Limit Active
                    </p>
                    <h2 className="font-display mx-auto mt-4 max-w-xs text-[1.72rem] leading-[1.08] text-text-primary sm:mt-5 sm:text-[2.1rem]">
                      One order per device every 3 hours.
                    </h2>
                    <p className="mx-auto mt-4 max-w-sm text-[13px] leading-6 text-text-muted sm:mt-5 sm:text-sm sm:leading-7">
                      {blockModal.reason} Please wait around{' '}
                      <span className="font-bold text-text-primary">
                        {blockModal.remainingMinutes} minutes
                      </span>{' '}
                      before placing another order.
                    </p>

                    <div className="mt-5 rounded-[1.2rem] border border-border-light bg-bg-primary p-3.5 text-left sm:mt-7 sm:rounded-[1.4rem] sm:p-4">
                      <div className="flex items-start gap-3">
                        <ShoppingBag
                          size={16}
                          className="mt-0.5 shrink-0 text-brand-gold sm:size-[18px]"
                        />
                        <p className="text-[13px] leading-6 text-text-muted sm:text-sm">
                          Your cart is still saved. You can come back after the
                          cooldown and complete the order normally.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setBlockModal((previous) => ({
                          ...previous,
                          open: false,
                        }))
                      }
                      className="btn-luxury btn-luxury-dark btn-md mt-5 w-full sm:btn-lg sm:mt-8"
                    >
                      <span>Okay, I understand</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )

  return (
    <>
      {orderBlockModal}
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
              <h1 className="text-heading-lg text-balance">
                A calmer, premium checkout flow for the final step.
              </h1>

              <form
                id="checkout-form"
                onSubmit={handleCheckout}
                className="mt-7 space-y-8"
              >
                <section>
                  <h2 className="lux-label">Delivery information</h2>
                  <div className="grid gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="checkout-full-name"
                        className="text-sm font-semibold text-text-primary"
                      >
                        Your name <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        id="checkout-full-name"
                        required
                        type="text"
                        name="fullName"
                        placeholder="e.g. Hasan Mahmud"
                        value={form.fullName}
                        onChange={handleInput}
                        className="lux-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="checkout-address"
                        className="text-sm font-semibold text-text-primary"
                      >
                        Your full address{' '}
                        <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        id="checkout-address"
                        required
                        type="text"
                        name="address"
                        placeholder="e.g. House 12, Road 4, Dhanmondi, Dhaka"
                        value={form.address}
                        onChange={handleInput}
                        className="lux-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="checkout-phone"
                        className="text-sm font-semibold text-text-primary"
                      >
                        Mobile number <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        id="checkout-phone"
                        required
                        type="tel"
                        name="phone"
                        placeholder="01XXXXXXXXX"
                        value={form.phone}
                        onChange={handleInput}
                        className="lux-input"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="lux-label">Delivery area</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      Object.entries(DELIVERY_OPTIONS) as [
                        DeliveryArea,
                        (typeof DELIVERY_OPTIONS)[DeliveryArea],
                      ][]
                    ).map(([value, option]) => {
                      const selected = form.deliveryArea === value

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleDeliveryArea(value)}
                          className="group rounded-[1.35rem] border p-4 text-left transition-all duration-300 active:scale-[0.99]"
                          style={{
                            background: selected
                              ? 'rgba(201,164,114,0.1)'
                              : '#fff',
                            borderColor: selected
                              ? 'rgba(201,164,114,0.45)'
                              : 'var(--color-border-light)',
                            boxShadow: selected
                              ? '0 14px 34px rgba(201,164,114,0.12)'
                              : 'none',
                          }}
                          aria-pressed={selected}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">
                                {option.label}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-text-muted">
                                {option.detail}
                              </p>
                            </div>
                            <span
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                              style={{
                                borderColor: selected
                                  ? '#c9a472'
                                  : 'rgba(24,21,17,0.18)',
                                background: selected ? '#c9a472' : '#fff',
                              }}
                            >
                              {selected && (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </span>
                          </div>
                          <p className="mt-4 font-display text-2xl text-brand-gold-dark">
                            {formatPrice(option.fee)}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </section>

                <section>
                  <h2 className="lux-label">Payment method</h2>
                  <div className="rounded-[1.5rem] border border-brand-gold/25 bg-brand-gold/8 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary">
                          Cash on delivery
                        </p>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
                          Confirm the order now and pay securely when it
                          arrives.
                        </p>
                      </div>
                      <span className="inline-flex w-fit shrink-0 rounded-full bg-brand-gold px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white">
                        Selected
                      </span>
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-luxury btn-luxury-dark btn-lg flex w-full"
                >
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
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-bg-dark px-1 text-[0.55rem] font-bold text-white">
                          {item.qty}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {item.product.name}
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-brand-gold/70">
                          {item.selectedSize || 'Standard'}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {formatPrice(
                            item.selectedPrice ?? item.product.price,
                          )}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-text-primary">
                        {formatPrice(
                          (item.selectedPrice ?? item.product.price) * item.qty,
                        )}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-t border-border-light pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-semibold text-text-primary">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-text-muted">
                      <Truck size={14} className="text-brand-gold" />
                      Delivery
                    </span>
                    <span className="font-semibold text-text-primary">
                      {formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Area</span>
                    <span className="font-semibold text-text-primary">
                      {selectedDelivery.label}
                    </span>
                  </div>
                  <div className="flex items-end justify-between border-t border-border-light pt-4">
                    <div>
                      <p className="text-text-primary">Total</p>
                      <p className="text-xs text-text-muted">Including taxes</p>
                    </div>
                    <p className="font-display text-2xl text-brand-gold-dark">
                      {formatPrice(total)}
                    </p>
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
    </>
  )
}
