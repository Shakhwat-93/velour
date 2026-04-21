import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ArrowRight } from 'lucide-react'

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('velour_promo_seen')
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const closePopup = () => {
    setIsOpen(false)
    sessionStorage.setItem('velour_promo_seen', 'true')
  }

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-[#181511]/50 backdrop-blur-xl"
          />

          {/* Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[480px] bg-white rounded-[32px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.35)]"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white hover:text-[#181511]"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Image Section */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-[#faf9f7]">
              <img
                src="/promo.png"
                alt="Premium Perfume"
                className="w-full h-full object-cover transition-transform duration-[5s] hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181511]/30 via-transparent to-transparent" />
              
              <div className="absolute bottom-5 left-6">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a472] text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                  <Sparkles size={10} /> Special Offer
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 sm:p-10 text-center">
              <h4 className="text-[10px] font-black tracking-[0.4em] uppercase mb-3 text-[#c9a472]">Velour Private Collection</h4>
              <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#181511' }}>
                Eid Special <span className="text-[#c9a472]">Discount</span>
              </h2>
              <p className="text-[13px] sm:text-[14px] font-medium leading-relaxed mb-8" style={{ color: '#71675d' }}>
                Indulge in luxury. Use code: <span className="bg-[#faf9f7] px-2.5 py-1 rounded-md font-bold text-[#181511] border">VELOUR20</span> for flat <span className="text-[#181511] font-bold">20% OFF</span>
              </p>

              <button
                onClick={closePopup}
                className="w-full h-14 rounded-xl bg-[#181511] text-white text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all hover:shadow-[0_15px_30px_rgba(201,164,114,0.3)] hover:-translate-y-0.5 active:scale-95 shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
              >
                Claim My Discount <ArrowRight size={16} strokeWidth={2.5} className="text-[#c9a472]" />
              </button>
              
              <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: '#a09a90' }}>
                Limited time opportunity
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(content, document.body)
}
