import type { ReactNode } from 'react'

interface ProductGridProps {
  children: ReactNode
}

export default function ProductGrid({ children }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 md:gap-x-6 md:gap-y-10 xl:grid-cols-4 xl:gap-x-7 xl:gap-y-12">
      {children}
    </div>
  )
}
