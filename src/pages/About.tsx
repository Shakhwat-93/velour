import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import PageHero from '@/components/store/PageHero'

const VALUES = [
  {
    icon: Sparkles,
    title: 'Authenticity',
    body: 'Original compositions, premium sourcing, and a storefront experience that feels intentional at every step.',
  },
  {
    icon: ShieldCheck,
    title: 'Craftsmanship',
    body: 'Every detail is designed to feel refined, from fragrance concentration to the way the product is presented.',
  },
  {
    icon: Leaf,
    title: 'Restraint',
    body: 'We prefer calm luxury over clutter, focusing on fewer, better experiences that feel polished on every device.',
  },
]

const TIMELINE = [
  { year: '2024', event: 'Velour launches with a focus on modern premium fragrance and a quieter luxury identity.' },
  { year: '2025', event: 'The signature range expands into a curated catalog built around extrait concentration and stronger brand presence.' },
  { year: '2026', event: 'The storefront evolves into a more refined mobile-first experience without losing its visual character.' },
]

export default function About() {
  return (
    <div className="page-enter bg-bg-primary">
      <PageHero
        eyebrow="Our story"
        title="Velour isn't just a scent, it's an experience"
        description="Velour was built around the belief that luxury should feel composed, memorable, and intentionally designed. We craft premium fragrances that linger with confidence and depth."
      />

      <section className="section-padding">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="overflow-hidden rounded-[2.2rem] bg-bg-secondary shadow-[0_24px_60px_rgba(11,19,27,0.12)]"
            >
              <img src="/images/lifestyle/lifestyle-2.jpg" alt="Velour editorial lifestyle" className="aspect-[4/5] w-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <p className="text-overline mb-4">The Velour promise</p>
              <h2 className="text-heading-lg text-balance">A fragrance is memory, atmosphere, and identity in one gesture.</h2>
              <div className="mt-6 space-y-5 text-sm leading-7 text-text-muted md:text-base md:leading-8">
                <p>
                  Velour is more than a fragrance—it's a curated journey of modern opulence and artisan-crafted blends. 
                  We believe that premium fragrance should feel elegant from the very first encounter.
                  communicates calm confidence rather than excess.
                </p>
                <p>
                  Today the brand continues to refine its collection through luxury cues that are subtle, deliberate,
                  and easy to trust whether a customer arrives on mobile, tablet, or desktop.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding-tight border-y border-border-light bg-surface">
        <div className="container-site max-w-4xl">
          <div className="text-center">
            <p className="text-overline mb-4">Journey</p>
            <h2 className="text-heading-lg">From vision to refined storefront.</h2>
          </div>

          <div className="mt-10 space-y-5">
            {TIMELINE.map((item) => (
              <div
                key={item.year}
                className="grid gap-4 rounded-[1.5rem] border border-border-light bg-bg-primary/75 px-5 py-5 sm:grid-cols-[5rem_1fr] sm:px-6"
              >
                <div className="font-display text-[1.35rem] text-brand-gold-dark">{item.year}</div>
                <p className="text-sm leading-7 text-text-muted">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-overline mb-4">Core values</p>
            <h2 className="text-heading-lg">What guides the brand.</h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <motion.article
                key={value.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08 }}
                className="surface-soft p-6 sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold-dark">
                  <value.icon size={19} strokeWidth={1.7} />
                </div>
                <h3 className="mt-5 text-heading-md">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{value.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding-tight bg-bg-dark text-text-on-dark">
        <div className="container-site text-center">
          <p className="text-overline mb-4">Next step</p>
          <h2 className="text-heading-lg text-balance text-white">Ready to find a signature scent that feels like Velour?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
            Explore the full collection through a more premium, mobile-first storefront experience built around clarity and desire.
          </p>
          <Link to="/shop" className="btn-luxury btn-luxury-light btn-lg mt-8">
            <span>Shop the collection</span>
            <ArrowRight size={15} strokeWidth={2.1} />
          </Link>
        </div>
      </section>
    </div>
  )
}
