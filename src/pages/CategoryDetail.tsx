import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHero from '@/components/store/PageHero'
import ProductCard from '@/components/store/ProductCard'
import ProductGrid from '@/components/store/ProductGrid'
import { supabase } from '@/lib/supabase/client'
import type { Category, Product } from '@/lib/types'

export default function CategoryDetail() {
  const { slug } = useParams()

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      if (!slug) return

      setLoading(true)
      const { data: categoryData } = await (supabase as any).from('categories').select('*').eq('slug', slug).maybeSingle()

      if (categoryData) {
        setCategory(categoryData as Category)
        const { data: productData } = await (supabase as any).from('products').select('*').eq('category_id', categoryData.id)
        setProducts((productData as Product[]) ?? [])
      } else {
        setCategory(null)
        setProducts([])
      }

      setLoading(false)
    }

    void loadProducts()
  }, [slug])

  const title = category?.name ?? slug?.replace(/-/g, ' ') ?? 'Collection'

  return (
    <div className="page-enter bg-bg-primary">
      <PageHero
        eyebrow="Collection detail"
        title={title}
        description={category?.description || `Browse the fragrances curated within the ${title} family.`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Collections', to: '/categories' },
          { label: title },
        ]}
      />

      <section className="section-padding-tight">
        <div className="container-site">
          {loading ? (
            <div className="rounded-[1.8rem] border border-dashed border-border-light bg-surface px-6 py-16 text-center text-sm text-text-muted">
              Loading collection...
            </div>
          ) : products.length > 0 ? (
            <ProductGrid>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          ) : (
            <div className="rounded-[1.8rem] border border-dashed border-border-light bg-surface px-6 py-16 text-center">
              <h2 className="text-heading-md">No fragrances found</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
                This collection is currently quiet. Add products to it or explore the wider catalog instead.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
