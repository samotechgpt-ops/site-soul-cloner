import logoAsset from "@/assets/audax-gaming-logo.png.asset.json";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={logoAsset.url}
        alt="AUDAX Gaming"
        className="h-10 w-10 shrink-0 drop-shadow-[0_0_12px_oklch(0.62_0.24_25_/_0.7)]"
      />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-bold tracking-[0.25em] text-foreground">
            AUDAX
          </span>
          <span className="mt-0.5 font-mono text-[8px] tracking-[0.4em] text-primary uppercase">
            Gaming
          </span>
        </div>
      )}
    </div>
  );
}
