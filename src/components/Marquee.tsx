const words = ["AUDACITY", "◆", "INNOVATION", "◆", "PRECISION", "◆", "VISION", "◆", "TECHNOLOGY", "◆"];

export function Marquee() {
  return (
    <div className="relative border-y border-primary/20 bg-surface/40 py-6 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex shrink-0 items-center gap-12 px-6">
            {words.map((w, j) => (
              <span
                key={j}
                className={`font-display text-3xl md:text-5xl font-bold tracking-tighter ${w === "◆" ? "text-primary text-glow-crimson" : "text-foreground/80"}`}
              >
                {w}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
