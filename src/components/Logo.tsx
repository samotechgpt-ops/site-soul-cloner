import logoAsset from "@/assets/audax-logo.png.asset.json";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = false }: LogoProps) {
  void showText;
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={logoAsset.url}
        alt="AUDAX Technology"
        className="h-8 w-auto shrink-0 drop-shadow-[0_0_18px_oklch(0.62_0.24_25_/_0.45)] sm:h-10"
      />
    </div>
  );
}
