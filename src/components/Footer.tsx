import { Logo } from "./Logo";

const cols = [
  {
    title: "Sectors",
    links: ["All-In-One", "Monitors", "Toner Cartridges", "Office Tools"],
  },
  {
    title: "Company",
    links: ["Presentation", "About", "Sectors of Activity", "Contact"],
  },
  {
    title: "Shop",
    links: ["VAR N22", "VAR T24M", "VAR XPS22F", "View Cart"],
  },
];

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-primary/20 bg-surface/40 pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Local leader in cutting-edge computer, office, and electrical equipment. Audacity drives innovation.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                Systems Online · Algiers
              </span>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[10px] tracking-[0.35em] text-primary uppercase mb-4">
                ▸ {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors group inline-flex items-center gap-2">
                      <span className="h-px w-0 bg-primary transition-all group-hover:w-3" />
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-primary/10 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            © 2026 Audax Technology — All Rights Reserved
          </p>
          <div className="flex gap-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>

        {/* Giant text */}
        <div className="mt-12 overflow-hidden">
          <div className="font-display text-[18vw] font-bold tracking-tighter leading-none text-center bg-gradient-to-b from-primary/20 to-transparent bg-clip-text text-transparent select-none">
            AUDAX
          </div>
        </div>
      </div>
    </footer>
  );
}
