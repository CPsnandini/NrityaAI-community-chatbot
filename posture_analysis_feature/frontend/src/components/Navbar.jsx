import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Navbar({ variant = 'landing' }) {
  const isLanding = variant === 'landing'

  return (
    <header
      className={`relative z-20 ${isLanding ? 'bg-transparent' : 'sticky top-0 border-b border-gold-500/10 bg-maroon-950/70 backdrop-blur-xl'}`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-4 px-5 py-5 md:px-10 ${isLanding ? 'max-w-6xl' : 'max-w-6xl'}`}
      >
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold-500/60 shadow-[0_0_16px_rgba(212,175,55,0.2)]"
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <img src="/logo-icon.svg" alt="" className="h-full w-full object-cover" />
          </motion.div>
          <div className="text-left leading-tight">
            <p className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-gold-400 md:text-2xl">
              NrityaAI
            </p>
            <p className="text-[11px] font-light text-cream-muted md:text-xs">
              Preserving Art. Empowering Talent.
            </p>
          </div>
        </Link>

        <Link to="/about" className="about-btn">
          <span
            className="grid h-5 w-5 place-items-center rounded-full border border-gold-500/50 text-[10px] font-bold text-gold-400"
            aria-hidden
          >
            i
          </span>
          About Us
        </Link>
      </div>
    </header>
  )
}
