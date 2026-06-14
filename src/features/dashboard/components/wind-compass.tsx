interface WindCompassProps {
  /** Direccion DESDE la que sopla el viento, en grados. */
  direction: number
  size?: number
}

/** Brujula SVG con flecha indicando hacia donde va el viento. */
export function WindCompass({ direction, size = 44 }: WindCompassProps) {
  // La API da la direccion de procedencia; la flecha apunta hacia donde va (+180).
  const rotation = direction + 180
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden>
      <circle cx="22" cy="22" r="20" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" />
      <g transform={`rotate(${rotation} 22 22)`}>
        <path d="M22 6 L27 24 L22 20 L17 24 Z" fill="white" />
      </g>
      <text x="22" y="13" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.7)">N</text>
    </svg>
  )
}
