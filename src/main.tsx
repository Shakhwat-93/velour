import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/useAuth'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
