import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import officeWide from "@/assets/var-business-showroom.jpg";
import showroomLoop from "@/assets/var-showroom-loop.mp4.asset.json";

export function ScrollVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative h-[80vh] overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <video
          src={showroomLoop.url}
          poster={officeWide}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6">
        <p className="font-mono text-[11px] tracking-[0.4em] text-primary uppercase">▸ Distributeur officiel VAR · Algérie</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl md:text-7xl font-bold tracking-tighter leading-[0.95]">
          La marque <span className="text-primary text-glow-crimson italic">VAR</span>, livrée chez vous.
        </h2>
        <p className="mt-6 max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
          Moniteurs VAR, ordinateurs de bureau All-In-One VAR et accessoires informatiques —
          neufs, sous garantie constructeur, livrés dans les 69 wilayas avec paiement à la livraison.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span className="border border-primary/40 bg-background/40 backdrop-blur px-3 py-2 text-primary">◢ Marque VAR officielle</span>
          <span className="border border-primary/30 bg-background/40 backdrop-blur px-3 py-2 text-muted-foreground">Garantie constructeur</span>
          <span className="border border-primary/30 bg-background/40 backdrop-blur px-3 py-2 text-muted-foreground">Paiement à la livraison</span>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
    </section>
  );
}
