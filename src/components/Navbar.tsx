import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { label: "Home", href: "#home" },
  { label: "Presentation", href: "#about" },
  { label: "Sectors", href: "#categories" },
  { label: "Products", href: "#products" },
  { label: "Shop", href: "#shop" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 30);
  });

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-primary/15 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6">
        <a href="#home"><Logo /></a>

        <ul className="hidden lg:flex items-center gap-1 font-mono text-[11px] tracking-[0.25em] uppercase">
          {links.map((link, i) => (
            <motion.li
              key={link.label}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.4 + i * 0.06 }}
            >
              <a
                href={link.href}
                className="relative px-4 py-2 text-muted-foreground transition-colors hover:text-foreground group"
              >
                <span className={i === 0 ? "text-primary" : ""}>{link.label}</span>
                <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-3/4" />
              </a>
            </motion.li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Sys Online
            </span>
          </div>
          <button className="relative h-10 w-10 border border-primary/40 hover:border-primary hover:bg-primary/10 transition-all clip-corner flex items-center justify-center">
            <span className="absolute inset-0 flex flex-col justify-center items-center gap-1.5">
              <span className="h-px w-4 bg-foreground" />
              <span className="h-px w-4 bg-foreground" />
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
