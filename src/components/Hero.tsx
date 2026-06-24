import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { ScrambleText } from "./ScrambleText";
import { scrollToSection } from "@/lib/scroll";
import heroBg from "@/assets/hero-bg.jpg";
import soldierDisplay from "@/assets/audax-soldier-display.jpg";
import gamingShowcase from "@/assets/audax-gaming-showcase.mp4.asset.json";
import audaxLogo from "@/assets/audax-technology-logo.png.asset.json";
import gamingVideo from "@/assets/gaming-bg-loop.mp4.asset.json";

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  top: `${100 + ((i * 19) % 20)}%`,
  x: `${(i * 29) % 100}%`,
  y: `${(i * 43) % 100}%`,
  duration: 8 + (i % 7),
  delay: (i % 6) * 0.55,
}));

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section ref={ref} id="home" className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <video
          src={gamingVideo.url}
          autoPlay
          loop
          muted
          playsInline
          poster={heroBg}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/55 to-background" />
        <div className="absolute inset-0 bg-grid animate-grid-pan opacity-30" />
        <div className="absolute inset-0 gaming-scanlines opacity-30 pointer-events-none" />
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute h-1 w-1 rounded-full bg-primary/60"
            initial={{
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              y: ["0%", "-100%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
            style={{ left: particle.left, top: particle.top }}
          />
        ))}
      </div>

      {/* Scan line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />

      {/* HUD labels */}
      <div className="absolute top-20 left-4 right-4 z-20 flex justify-between gap-2 font-mono text-[9px] tracking-[0.3em] text-muted-foreground uppercase sm:top-24 sm:left-6 sm:right-6 sm:text-[10px] sm:tracking-[0.35em]">
        <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.8 }} className="truncate">
          <ScrambleText text="[ SYS.01 ] — VISION ENGINE V12" duration={1200} />
        </motion.span>
        <motion.span initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.8 }} className="hidden sm:inline">
          <ScrambleText text="LAT 36.7538 / LON 3.0588" duration={1200} />
        </motion.span>
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, y: titleY }}
        className="relative z-20 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-4 pt-28 pb-20 sm:px-6 sm:pt-32"
      >
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1fr_1.3fr]">
          {/* Portrait card */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 2.4 }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            {/* MONITOR MOCKUP */}
            <div className="relative">
              {/* Bezel */}
              <div className="relative rounded-[18px] bg-gradient-to-b from-zinc-900 to-black p-3 sm:p-4 shadow-glow border border-primary/30">
                {/* Screen */}
                <div className="relative aspect-video overflow-hidden rounded-md bg-black border border-primary/20">
                  <video
                    src={gamingShowcase.url}
                    poster={soldierDisplay}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    aria-label="Démo gaming AUDAX Technology"
                  />
                  {/* Subtle screen reflection */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
                  {/* In-screen HUD corner */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-2 rounded border border-primary/40 bg-background/70 px-2 py-1 font-mono text-[10px] tracking-[0.3em] text-primary uppercase backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    LIVE · 144 FPS
                  </div>
                  <CornerBrackets />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-glow to-transparent animate-scan z-30" />
                </div>
                {/* Bottom bezel with LOGO */}
                <div className="mt-3 flex items-center justify-between gap-3 px-2">
                  <img
                    src={audaxLogo.url}
                    alt="AUDAX Technology"
                    className="h-8 sm:h-10 w-auto drop-shadow-[0_0_10px_rgba(220,38,38,0.7)]"
                  />
                  <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                    <span>VAR · 240Hz</span>
                    <span className="h-2 w-2 rotate-45 bg-primary" />
                  </div>
                </div>
              </div>

              {/* Stand */}
              <div className="mx-auto h-6 w-24 sm:w-32 bg-gradient-to-b from-zinc-800 to-black border-x border-b border-primary/20" />
              <div className="mx-auto h-2 w-40 sm:w-56 rounded-b-full bg-gradient-to-b from-zinc-900 to-black shadow-[0_20px_40px_-10px_rgba(220,38,38,0.4)]" />

              {/* Floating tags */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -left-4 border border-primary/50 bg-background/80 backdrop-blur px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-primary uppercase z-10"
              >
                ◢ ID·AX-22
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-2 -right-4 sm:-right-6 border border-cyan-glow/50 bg-background/80 backdrop-blur px-4 py-3 font-mono text-[10px] tracking-[0.25em] text-cyan-glow uppercase shadow-cyan z-10"
              >
                ◉ Neural · 99.8%
              </motion.div>
            </div>
          </motion.div>

          {/* Headline */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6 }}
              className="mb-6 inline-flex animate-hud-flicker items-center gap-3 border border-primary/30 bg-primary/5 px-4 py-2 font-mono text-[10px] tracking-[0.35em] text-primary uppercase"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Next Generation Devices · Est. 2013
            </motion.div>

            <h1 className="font-display text-[2.5rem] leading-[0.95] tracking-tighter font-bold sm:text-7xl lg:text-[7rem] lg:leading-[0.92]">
              <AnimatedWord text="BOLD" delay={2.7} />{" "}
              <AnimatedWord text="VISION." delay={2.85} className="text-primary text-glow-crimson italic" />
              <br />
              <AnimatedWord text="SMARTER" delay={3.0} />{" "}
              <AnimatedWord text="DISPLAYS" delay={3.15} className="text-shimmer" />
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 3.5, duration: 1 }}
              className="mt-8 h-px w-full max-w-md origin-left bg-gradient-to-r from-primary to-transparent"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.6 }}
              className="mt-6 max-w-xl text-base text-muted-foreground leading-relaxed lg:mx-0 mx-auto"
            >
              Precision shapes every pixel. Moniteurs VAR et PC All-In-One AUDAX livrent la clarté, la réactivité et l’énergie gaming attendues pour travailler, streamer et jouer avec confiance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.8 }}
              className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <MagneticButton onClick={() => { window.location.href = "/commander"; }}>
                Commander <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={() => scrollToSection("#categories")}>Browse Products</MagneticButton>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase"
      >
        Scroll
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}

function AnimatedWord({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 1, ease: [0.33, 1, 0.68, 1] }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
}

function CornerBrackets() {
  return (
    <>
      <span className="absolute top-3 left-3 h-4 w-4 border-l-2 border-t-2 border-primary" />
      <span className="absolute top-3 right-3 h-4 w-4 border-r-2 border-t-2 border-primary" />
      <span className="absolute bottom-3 left-3 h-4 w-4 border-l-2 border-b-2 border-primary" />
      <span className="absolute bottom-3 right-3 h-4 w-4 border-r-2 border-b-2 border-primary" />
    </>
  );
}
