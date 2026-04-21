import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { CartItem, CartState, Product } from '@/lib/types'

// ─── Actions ─────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; qty?: number; selectedSize?: string; selectedPrice?: number }
  | { type: 'REMOVE_ITEM'; productId: string; selectedSize?: string }
  | { type: 'UPDATE_QTY'; productId: string; qty: number; selectedSize?: string }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

// ─── Reducer ─────────────────────────────────────────────────────────────────

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => 
        i.product.id === action.product.id && 
        i.selectedSize === action.selectedSize
      )
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map(i =>
            i.product.id === action.product.id && i.selectedSize === action.selectedSize
              ? { ...i, qty: i.qty + (action.qty ?? 1) }
              : i
          ),
        }
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { 
          product: action.product, 
          qty: action.qty ?? 1,
          selectedSize: action.selectedSize,
          selectedPrice: action.selectedPrice
        }],
      }
    }
    case 'REMOVE_ITEM':
      return { 
        ...state, 
        items: state.items.filter(i => 
          !(i.product.id === action.productId && i.selectedSize === action.selectedSize)
        ) 
      }
    case 'UPDATE_QTY':
      if (action.qty <= 0) {
        return { 
          ...state, 
          items: state.items.filter(i => 
            !(i.product.id === action.productId && i.selectedSize === action.selectedSize)
          ) 
        }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.productId && i.selectedSize === action.selectedSize 
            ? { ...i, qty: action.qty } 
            : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CartContextValue {
  state: CartState
  addItem: (product: Product, qty?: number, selectedSize?: string, selectedPrice?: number) => void
  removeItem: (productId: string, selectedSize?: string) => void
  updateQty: (productId: string, qty: number, selectedSize?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_STORAGE_KEY = 'velour_cart'

const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: loadCart(),
    isOpen: false,
  })

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const addItem    = (product: Product, qty?: number, selectedSize?: string, selectedPrice?: number) => 
    dispatch({ type: 'ADD_ITEM', product, qty, selectedSize, selectedPrice })
  const removeItem = (productId: string, selectedSize?: string) => 
    dispatch({ type: 'REMOVE_ITEM', productId, selectedSize })
  const updateQty  = (productId: string, qty: number, selectedSize?: string) => 
    dispatch({ type: 'UPDATE_QTY', productId, qty, selectedSize })
  const clearCart  = () => dispatch({ type: 'CLEAR_CART' })
  const openCart   = () => dispatch({ type: 'OPEN_CART' })
  const closeCart  = () => dispatch({ type: 'CLOSE_CART' })

  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal  = state.items.reduce((sum, i) => sum + (i.selectedPrice ?? i.product.price) * i.qty, 0)

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQty, clearCart, openCart, closeCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
