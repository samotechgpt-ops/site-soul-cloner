interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0" aria-label="Audax">
        <defs>
          <linearGradient id="audaxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.72 0.26 25)" />
            <stop offset="100%" stopColor="oklch(0.52 0.24 20)" />
          </linearGradient>
        </defs>
        {/* Left blade */}
        <path d="M32 6 L8 58 L18 58 L32 28 Z" fill="url(#audaxGrad)" />
        {/* Right blade */}
        <path d="M32 6 L56 58 L46 58 L32 28 Z" fill="url(#audaxGrad)" />
        {/* Crossbar */}
        <rect x="20" y="42" width="24" height="5" fill="url(#audaxGrad)" />
        {/* Top notch */}
        <path d="M30 6 L34 6 L33 14 L31 14 Z" fill="oklch(0.13 0.015 25)" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-bold tracking-[0.25em] text-foreground">
            AUDAX
          </span>
          <span className="mt-0.5 font-mono text-[8px] tracking-[0.4em] text-muted-foreground uppercase">
            Technology
          </span>
        </div>
      )}
    </div>
  );
}
