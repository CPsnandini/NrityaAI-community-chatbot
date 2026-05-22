import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { PageOrnaments } from './PageOrnaments'
import { Sidebar } from './Sidebar'

const pageMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="relative flex min-h-svh">
      <PageOrnaments />
      {!isHome ? <Sidebar /> : null}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Navbar variant={isHome ? 'landing' : 'app'} />
        <main
          className={
            isHome
              ? 'mx-auto w-full flex-1'
              : 'mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-10'
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        {!isHome ? (
          <footer className="relative z-10 border-t border-gold-500/10 py-6 text-center text-xs text-cream-muted">
            NrityaAI · Bharatanatyam posture analysis · Built for expressive precision
          </footer>
        ) : null}
      </div>
    </div>
  )
}
