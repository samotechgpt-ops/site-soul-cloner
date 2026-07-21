import iconAsset from "@/assets/audax-icon.png.asset.json";

interface LogoProps {
  className?: string;
  /** Show the "AUDAX" wordmark next to the icon. Default true. */
  showText?: boolean;
  /** Wordmark color. Default white. */
  textColor?: string;
}

/**
 * AUDAX brand logo per the official brand guidelines:
 * red arrow icon (from the guide) + "AUDAX" wordmark in Exo 2 Black.
 */
export function Logo({ className = "", showText = true, textColor = "#ffffff" }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 leading-none ${className}`}>
      <img
        src={iconAsset.url}
        alt="AUDAX"
        className="h-[1.4em] w-auto shrink-0 drop-shadow-[0_0_14px_rgba(227,6,19,0.5)]"
      />
      {showText && (
        <span
          aria-hidden="true"
          className="select-none"
          style={{
            fontFamily: '"Exo 2", "Segoe UI", system-ui, sans-serif',
            fontWeight: 900,
            fontSize: "1em",
            letterSpacing: "0.06em",
            color: textColor,
          }}
        >
          AUDAX
        </span>
      )}
    </div>
  );
}
