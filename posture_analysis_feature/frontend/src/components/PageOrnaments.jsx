/** Corner mandala motifs and fabric texture — matches NRITYAAI landing art direction */
export function PageOrnaments() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-fabric-texture opacity-40" />
      <CornerMandala className="left-0 top-0 -translate-x-1/4 -translate-y-1/4" />
      <CornerMandala className="right-0 top-0 translate-x-1/4 -translate-y-1/4 scale-x-[-1]" />
      <CornerMandala className="bottom-0 left-0 -translate-x-1/4 translate-y-1/4 scale-y-[-1]" />
      <CornerMandala className="bottom-0 right-0 translate-x-1/4 translate-y-1/4 scale-x-[-1] scale-y-[-1]" />
    </div>
  )
}

function CornerMandala({ className = '' }) {
  return (
    <svg
      className={`absolute h-44 w-44 opacity-[0.14] md:h-56 md:w-56 ${className}`}
      viewBox="0 0 120 120"
      fill="none"
    >
      <circle cx="60" cy="60" r="58" stroke="#d4af37" strokeWidth="0.5" />
      <circle cx="60" cy="60" r="44" stroke="#d4af37" strokeWidth="0.4" strokeDasharray="3 5" />
      <circle cx="60" cy="60" r="30" stroke="#b8922e" strokeWidth="0.35" />
      {[0, 45, 90, 135].map((deg) => (
        <line
          key={deg}
          x1="60"
          y1="60"
          x2={60 + 52 * Math.cos((deg * Math.PI) / 180)}
          y2={60 + 52 * Math.sin((deg * Math.PI) / 180)}
          stroke="#d4af37"
          strokeWidth="0.35"
        />
      ))}
      {[0, 30, 60, 90, 120, 150].map((deg) => (
        <circle
          key={`p-${deg}`}
          cx={60 + 38 * Math.cos((deg * Math.PI) / 180)}
          cy={60 + 38 * Math.sin((deg * Math.PI) / 180)}
          r="2.5"
          fill="#d4af37"
          opacity="0.7"
        />
      ))}
      <path
        d="M60 8 L64 20 L76 20 L66 28 L70 40 L60 32 L50 40 L54 28 L44 20 L56 20 Z"
        fill="#d4af37"
        opacity="0.25"
      />
    </svg>
  )
}
