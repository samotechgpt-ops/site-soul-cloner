import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

export function CTA() {


  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 gradient-glow opacity-60" />

      {/* Animated rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-primary/40"
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 font-mono text-xs tracking-[0.35em] text-primary uppercase"
        >
          ▸ Ready to Begin
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]"
        >
          Engineer the <br />
          <span className="text-shimmer italic">impossible.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-muted-foreground"
        >
          Let's build the next generation together. From concept to shipping device — we own the entire stack.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <a href="/commander">
            <MagneticButton>Commander en ligne <ArrowRight className="w-4 h-4" /></MagneticButton>
          </a>
          <MagneticButton variant="ghost" onClick={() => window.open("tel:+213555000000", "_self")}>Appeler</MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
