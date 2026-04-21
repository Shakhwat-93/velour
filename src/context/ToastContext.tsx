import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS = {
  success: <CheckCircle size={17} />,
  error:   <XCircle   size={17} />,
  info:    <Info       size={17} />,
}

const COLORS = {
  success: { bg: '#0B131B', icon: '#C9A472', border: 'rgba(201,164,114,0.25)' },
  error:   { bg: '#1C0A0A', icon: '#E57373', border: 'rgba(229,115,115,0.25)' },
  info:    { bg: '#0B131B', icon: '#90CAF9', border: 'rgba(144,202,249,0.25)' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: '24px', right: '24px',
        zIndex: 9999, display: 'flex', flexDirection: 'column',
        gap: '10px', pointerEvents: 'none',
      }}>
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.92 }}
              animate={{ opacity: 1, x: 0,  scale: 1 }}
              exit={{   opacity: 0, x: 80,  scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px', borderRadius: '14px',
                background: COLORS[t.type].bg,
                border: `1px solid ${COLORS[t.type].border}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                color: '#FAFAF8', fontSize: '14px', fontWeight: 400,
                maxWidth: '320px', minWidth: '220px',
                pointerEvents: 'all', cursor: 'default',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span style={{ color: COLORS[t.type].icon, flexShrink: 0 }}>
                {ICONS[t.type]}
              </span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(250,250,248,0.35)', padding: '2px', flexShrink: 0,
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
