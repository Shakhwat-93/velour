import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'
import CartDrawer from '@/components/store/CartDrawer'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  enter:   { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
}

const pageTransition = {
  duration: 0.32,
  ease: [0.25, 0.46, 0.45, 0.94] as any,
}

export default function StoreLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
