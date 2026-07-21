interface LogoProps {
  className?: string;
  /** When true, render outlined (stroke) wordmark like the loading screen. Default: solid white. */
  outlined?: boolean;
  /** Show the wordmark text next to the arrow icon. Default true. */
  showText?: boolean;
}

/**
 * AUDAX brand logo — inline SVG per AUDAX Brand Guidelines.
 * - Red arrow "A" (#E30613) replaces the letter A
 * - Wordmark "UDAX" in Exo 2 Black, extra-tight tracking
 */
export function Logo({ className = "", outlined = false, showText = true }: LogoProps) {
  const red = "#E30613";
  return (
    <div className={`inline-flex items-center gap-1.5 leading-none ${className}`}>
      {/* Red arrow "A" */}
      <svg
        viewBox="0 0 40 44"
        aria-hidden="true"
        className="h-[1.1em] w-auto shrink-0 drop-shadow-[0_0_14px_rgba(227,6,19,0.55)]"
      >
        {/* Outer triangle */}
        <polygon points="20,2 39,42 27,42 20,26 13,42 1,42" fill={red} />
        {/* Inner notch to form the A */}
        <polygon points="20,16 24.5,26 15.5,26" fill="#000" />
      </svg>

      {showText && (
        <span
          aria-label="AUDAX"
          className="select-none"
          style={{
            fontFamily: '"Exo 2", "Segoe UI", system-ui, sans-serif',
            fontWeight: 900,
            fontSize: "1em",
            letterSpacing: "0.02em",
            color: outlined ? "transparent" : "#fff",
            WebkitTextStroke: outlined ? "1.2px #fff" : undefined,
          }}
        >
          UDAX
        </span>
      )}
    </div>
  );
}
