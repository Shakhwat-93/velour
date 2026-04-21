import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/hooks/useAuth'
import type { ReactNode } from 'react'

interface PrivateRouteProps {
  children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm text-muted">Verifying access...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
