import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function HeroDivider() {
  return (
    <div className="hero-divider" aria-hidden>
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold-500/80 bg-[#2b0a0a]" />
    </div>
  )
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 16V8M12 8l-3 3M12 8l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 14.5a4.5 4.5 0 0 0 9 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 18h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LiveIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const cardMotion = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Home() {
  return (
    <div className="relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-4 pb-16 pt-4 md:px-8">
      <motion.div
        className="mx-auto w-full max-w-4xl text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <h1 className="hero-title">
          AI Bharatanatyam
          <br />
          Posture Analysis
        </h1>

        <HeroDivider />

        <p className="hero-tagline">Your AI Guru for Perfect Posture</p>

        <p className="mt-14 text-[11px] font-medium uppercase tracking-[0.45em] text-gold-500/80">
          Choose an option
        </p>
      </motion.div>

      <div className="mx-auto mt-10 grid w-full max-w-4xl gap-6 sm:grid-cols-2 md:mt-12 md:gap-8">
        <motion.div custom={0} variants={cardMotion} initial="hidden" animate="show">
          <Link to="/training?mode=upload" className="option-card option-card-hover block h-full text-gold-400">
            <div className="icon-box text-gold-400">
              <UploadIcon />
            </div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-[0.1em] text-gold-400 md:text-xl">
              Upload an image
            </h2>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-cream-muted">
              Capture a still pose from class or rehearsal — receive instant alignment notes from your
              AI guru.
            </p>
          </Link>
        </motion.div>

        <motion.div custom={1} variants={cardMotion} initial="hidden" animate="show">
          <Link to="/training?mode=live" className="option-card option-card-hover block h-full text-gold-400">
            <div className="icon-box text-gold-400">
              <LiveIcon />
            </div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-[0.1em] text-gold-400 md:text-xl">
              Start live analysis
            </h2>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-cream-muted">
              Open your camera for real-time posture coaching with gentle, stable guidance as you
              practice.
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
