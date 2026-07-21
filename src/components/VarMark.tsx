import varMark from "@/assets/var-wordmark-white.png.asset.json";

interface VarMarkProps {
  className?: string;
  /** Accessible label; defaults to "VAR". */
  label?: string;
}

/**
 * Renders the "VAR" wordmark using the official brand logo shape.
 * Uses a CSS mask so it inherits the current text color (works for red,
 * white, or shimmer variants). Sized relative to the surrounding text
 * via `1em` height so it drops in place of the literal text "VAR".
 */
export function VarMark({ className = "", label = "VAR" }: VarMarkProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block align-[-0.08em] ${className}`}
      style={{
        WebkitMaskImage: `url(${varMark.url})`,
        maskImage: `url(${varMark.url})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        backgroundColor: "currentColor",
        height: "0.82em",
        width: "3.6em",
        verticalAlign: "baseline",
      }}
    />
  );
}
