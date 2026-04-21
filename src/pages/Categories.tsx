import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/store/PageHero'
import { supabase } from '@/lib/supabase/client'
import type { Category } from '@/lib/types'

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*')
      setCategories((data as Category[]) ?? [])
      setLoading(false)
    }

    void fetchCategories()
  }, [])

  return (
    <div className="page-enter bg-bg-primary">
      <PageHero
        eyebrow="Collections"
        title="Explore fragrance families"
        description="Browse Velour by olfactive direction to find a scent profile that feels aligned before you compare individual bottles."
      />

      <section className="section-padding-tight">
        <div className="container-site max-w-6xl">
          {loading ? (
            <div className="rounded-[1.8rem] border border-dashed border-border-light bg-surface px-6 py-16 text-center text-sm text-text-muted">
              Loading collections...
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-5 lg:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className="group overflow-hidden rounded-[2rem] border border-border-subtle bg-surface shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
                    <div className="relative min-h-[16rem] overflow-hidden bg-bg-secondary sm:min-h-[20rem]">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(201,164,114,0.22),rgba(232,196,176,0.35))]" />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,19,27,0.08),rgba(11,19,27,0.18))]" />
                    </div>

                    <div className="flex items-center px-5 py-7 sm:px-8 sm:py-9">
                      <div className="max-w-xl">
                        <p className="text-overline mb-4">Curated collection</p>
                        <h2 className="text-heading-md text-[1.9rem] sm:text-[2.2rem]">{category.name}</h2>
                        <p className="mt-4 text-sm leading-7 text-text-muted md:text-base">
                          {category.description || 'Explore our exclusive collection shaped around this fragrance profile.'}
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-gold-dark transition-colors group-hover:text-text-primary">
                          Explore collection
                          <ArrowRight size={14} strokeWidth={2.2} className="transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.8rem] border border-dashed border-border-light bg-surface px-6 py-16 text-center">
              <h2 className="text-heading-md">No collections available</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
                Categories have not been published yet. Add them in the admin panel to bring this section to life.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
