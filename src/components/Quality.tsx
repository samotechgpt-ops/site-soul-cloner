import { motion } from "motion/react";
import innovation from "@/assets/innovation.jpg";
import { metrics } from "@/lib/data";
import { Counter } from "./Counter";
import { MagneticButton } from "./MagneticButton";
import { ArrowUpRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

export function Quality() {
  return (
    <section id="about" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full gradient-glow blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden border border-primary/30 clip-corner">
              <motion.img
                src={innovation}
                alt="Innovation engine"
                loading="lazy"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 1.2 }}
              />
              <div className="absolute inset-0 mix-blend-overlay gradient-glow" />
            </div>
            <div className="absolute -inset-6 border border-primary/20 rounded-full animate-rotate-slow pointer-events-none" />
            <div className="absolute top-1/2 -right-3 h-3 w-3 rounded-full bg-primary shadow-glow animate-pulse-glow" />

            {/* Floating metric tags */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 border border-cyan-glow/50 bg-background/80 backdrop-blur px-4 py-3 font-mono text-[10px] tracking-[0.25em] text-cyan-glow uppercase shadow-cyan"
            >
              ◢ ISO 9001 · Certified
            </motion.div>
          </motion.div>

          {/* Content */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-6 font-mono text-xs tracking-[0.35em] text-primary uppercase"
            >
              ▸ 04 — Our Manifesto
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl md:text-6xl font-bold tracking-tighter leading-[1]"
            >
              Audacity drives <br />
              <span className="text-primary text-glow-crimson italic">innovation.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl text-muted-foreground leading-relaxed"
            >
              Our commitment to high-performance technology and reliable solutions has solidified our reputation as a trusted partner within the region's evolving tech landscape. We engineer the impossible — and ship it.
            </motion.p>

            {/* Metric bars */}
            <div className="mt-12 space-y-5">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i }}
                >
                  <div className="mb-2 flex items-baseline justify-between font-mono text-[10px] tracking-[0.3em] uppercase">
                    <span className="text-muted-foreground">{m.label}</span>
                    <Counter to={m.value} suffix="%" className="text-primary text-lg font-bold" />
                  </div>
                  <div className="relative h-1.5 w-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.value}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 * i + 0.3, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-y-0 left-0 gradient-crimson shadow-glow"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <MagneticButton variant="ghost" onClick={() => scrollToSection("#products")}>
                View More <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
