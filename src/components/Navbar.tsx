import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Logo } from "./Logo";
import { scrollToSection } from "@/lib/scroll";

const links = [
  { label: "Home", hash: "#home" },
  { label: "About", hash: "#about" },
  { label: "Categories", hash: "#categories" },
  { label: "Products", hash: "#products" },
  { label: "Contact", hash: "#contact" },
];

function goTo(hash: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/") {
    window.location.href = `/${hash}`;
    return;
  }
  scrollToSection(hash);
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 30);
  });

  return (
    <>
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
          <button type="button" onClick={() => goTo("#home")} className="flex items-center" aria-label="AUDAX Gaming">
            <Logo />
          </button>

          <ul className="hidden lg:flex items-center gap-1 font-mono text-[11px] tracking-[0.25em] uppercase">
            {links.map((link, i) => (
              <motion.li key={link.label} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.4 + i * 0.06 }}>
                <button
                  type="button"
                  onClick={() => goTo(link.hash)}
                  className="relative px-4 py-2 text-muted-foreground transition-colors hover:text-foreground group"
                >
                  <span className={i === 0 ? "text-primary" : ""}>{link.label}</span>
                  <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-3/4" />
                </button>
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a href="/commander" className="hidden sm:inline-flex bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-primary-foreground transition hover:opacity-90">
              Commander
            </a>
            <Link to="/admin" className="hidden sm:inline-flex border border-primary/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-primary transition hover:bg-primary hover:text-primary-foreground">
              Admin
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative h-10 w-10 border border-primary/40 hover:border-primary hover:bg-primary/10 transition-all clip-corner flex items-center justify-center"
              aria-label="Ouvrir le menu"
            >
              <span className="flex flex-col gap-1.5">
                <span className="h-px w-4 bg-foreground" />
                <span className="h-px w-4 bg-foreground" />
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute inset-0 gaming-scanlines opacity-20 pointer-events-none" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 h-12 w-12 grid place-items-center border border-primary/40 hover:bg-primary/10"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.nav
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-auto flex h-full max-w-[1100px] flex-col justify-center px-8"
            >
              <p className="mb-6 font-mono text-[10px] tracking-[0.35em] text-primary uppercase">▸ Navigation</p>
              <ul className="grid gap-2">
                {links.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => { setOpen(false); setTimeout(() => goTo(link.hash), 250); }}
                      className="group flex w-full items-baseline justify-between border-b border-primary/15 py-4 text-left font-display text-4xl md:text-6xl font-bold tracking-tighter transition hover:text-primary"
                    >
                      <span>{link.label}</span>
                      <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">0{i + 1}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="/commander" className="bg-primary px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground">
                  Commander maintenant
                </a>
                <Link to="/admin" onClick={() => setOpen(false)} className="border border-primary/40 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary hover:bg-primary hover:text-primary-foreground">
                  Espace Admin
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
