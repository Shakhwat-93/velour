import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Mail, Package } from 'lucide-react'

export default function OrderSuccess() {
  return (
    <div className="page-enter relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-bg-primary px-4 py-14">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/12 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="surface-panel relative z-10 w-full max-w-2xl rounded-[2.3rem] px-6 py-10 text-center sm:px-9 sm:py-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 16 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e8c4b0,#c9a472)] text-white shadow-[0_20px_50px_rgba(201,164,114,0.28)]"
        >
          <Check size={34} strokeWidth={2.4} />
        </motion.div>

        <p className="text-overline mt-7">Order confirmed</p>
        <h1 className="text-heading-lg mt-4 text-balance">Your signature scent has been secured.</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-text-muted md:text-base">
          Thank you for choosing Velour. Your order is now moving through our preparation flow and you’ll
          receive the next update shortly.
        </p>

        <div className="mt-8 grid gap-3 text-left">
          <SuccessStep
            icon={Mail}
            title="Confirmation sent"
            body="A summary of your order has been sent to your inbox."
          />
          <SuccessStep
            icon={Package}
            title="Dispatch updates next"
            body="Tracking details will follow as soon as the shipment is ready."
          />
        </div>

        <Link to="/shop" className="btn-luxury btn-luxury-dark btn-lg mt-8 inline-flex w-full sm:w-auto sm:min-w-[17rem]">
          <span>Continue exploring</span>
          <ArrowRight size={15} strokeWidth={2.1} />
        </Link>
      </motion.div>
    </div>
  )
}

function SuccessStep({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Mail
  title: string
  body: string
}) {
  return (
    <div className="flex items-start gap-4 rounded-[1.4rem] border border-border-light bg-bg-primary/80 p-4 sm:p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-white text-brand-gold shadow-xs">
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="mt-1 text-sm leading-6 text-text-muted">{body}</p>
      </div>
    </div>
  )
}
