import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import innovation from "@/assets/innovation.jpg";
import { MagneticButton } from "./MagneticButton";

const stats = [
  { value: "12+", label: "Years R&D" },
  { value: "98%", label: "Precision Rate" },
  { value: "45", label: "Active Patents" },
  { value: "24/7", label: "System Uptime" },
];

export function Innovation() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full gradient-glow blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden border border-primary/30 clip-corner">
              <motion.img
                src={innovation}
                alt="Innovation"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 1.2 }}
              />
              <div className="absolute inset-0 mix-blend-overlay gradient-glow" />
            </div>
            {/* Rotating ring */}
            <div className="absolute -inset-6 border border-primary/20 rounded-full animate-rotate-slow pointer-events-none" />
            <div className="absolute top-1/2 -right-3 h-3 w-3 rounded-full bg-primary shadow-glow animate-pulse-glow" />
          </motion.div>

          {/* Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 font-mono text-xs tracking-[0.35em] text-primary uppercase"
            >
              ▸ 02 — Our Manifesto
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
              We engineer technology that evolves with your needs. Our all-in-one systems combine intelligent design and dependable performance to support today's goals while preparing you for tomorrow.
            </motion.p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-px bg-primary/20 border border-primary/20">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-background p-6 group hover:bg-primary/10 transition-colors"
                >
                  <div className="font-display text-4xl font-bold text-primary text-glow-crimson group-hover:scale-110 transition-transform origin-left">
                    {s.value}
                  </div>
                  <div className="mt-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <MagneticButton variant="ghost">
                View More <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
