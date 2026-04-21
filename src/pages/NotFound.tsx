import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="page-enter relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-bg-primary px-4 py-14">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[clamp(8rem,28vw,22rem)] font-semibold leading-none tracking-[-0.06em] text-brand-gold/8">
        404
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="surface-panel relative z-10 max-w-2xl rounded-[2.2rem] px-6 py-10 text-center sm:px-8 sm:py-12"
      >
        <p className="text-overline mb-4">Lost in the mist</p>
        <h1 className="text-heading-lg text-balance">This page has evaporated.</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-text-muted md:text-base">
          Like a fleeting top note, the page you were looking for has drifted away. Let’s guide you back to
          something more beautiful.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="btn-luxury btn-luxury-dark btn-lg">
            <Home size={14} strokeWidth={2.1} />
            <span>Back to home</span>
          </Link>
          <Link to="/shop" className="btn-ghost btn-lg">
            <ArrowLeft size={14} strokeWidth={2.1} />
            <span>Browse the shop</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
