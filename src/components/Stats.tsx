import { motion } from "motion/react";
import { stats } from "@/lib/data";
import { Counter } from "./Counter";

export function Stats() {
  return (
    <section className="relative py-16 md:py-24 border-y border-primary/20 bg-surface/30 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-2 gap-px lg:grid-cols-4 bg-primary/20 border border-primary/20">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group relative bg-background p-8 lg:p-10 hover:bg-primary/5 transition-colors duration-500"
            >
              <div className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                0{i + 1}
              </div>
              <Counter
                to={s.value}
                suffix={s.suffix}
                className="font-display text-6xl lg:text-7xl font-bold text-primary text-glow-crimson block leading-none"
              />
              <div className="mt-4 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                {s.label}
              </div>
              <div className="mt-6 h-px w-0 bg-primary transition-all duration-700 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
