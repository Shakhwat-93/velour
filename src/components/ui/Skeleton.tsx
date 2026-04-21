import type { CSSProperties } from 'react'

interface SkeletonProps {
  style?: CSSProperties
  className?: string
}

export function Skeleton({ style, className }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        background: 'linear-gradient(90deg, #EDE5DC 25%, #E2D8CE 50%, #EDE5DC 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.6s ease-in-out infinite',
        borderRadius: '8px',
        ...style,
      }}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <Skeleton style={{ aspectRatio: '3/4', borderRadius: '12px' }} />
      <Skeleton style={{ height: '15px', width: '72%' }} />
      <Skeleton style={{ height: '13px', width: '38%' }} />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '24px',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
