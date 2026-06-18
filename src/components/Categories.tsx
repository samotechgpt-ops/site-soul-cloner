import { motion } from "motion/react";
import { categories } from "@/lib/data";
import { ScrambleText } from "./ScrambleText";
import { ArrowUpRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

export function Categories() {
  return (
    <section id="categories" className="relative py-32 overflow-hidden">
      <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full gradient-glow blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="mb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 font-mono text-xs tracking-[0.35em] text-primary uppercase"
          >
            ▸ 02 — Sectors of Activity
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tighter leading-[1]"
          >
            Computers. Office. <br />
            <span className="text-primary text-glow-crimson italic">Electrical equipment.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl text-muted-foreground leading-relaxed"
          >
            A wide range of advanced products — from powerful computing systems to efficient office tools and durable electrical components — supporting businesses and individuals in achieving seamless productivity.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="space-y-px bg-primary/20 border border-primary/20">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.code}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.12, duration: 0.8 }}
              className="group relative bg-background p-8 md:p-12 cursor-pointer overflow-hidden"
              role="button"
              tabIndex={0}
              onClick={() => scrollToSection("#products")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") scrollToSection("#products");
              }}
            >
              {/* Hover fill */}
              <div className="absolute inset-0 bg-primary/5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

              <div className="relative grid items-center gap-6 md:grid-cols-[80px_1fr_auto_60px]">
                <div className="font-mono text-2xl font-bold text-primary/40 group-hover:text-primary transition-colors">
                  {cat.code}
                </div>
                <div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight transition-transform group-hover:translate-x-2 duration-500">
                    <ScrambleText text={cat.title} duration={800} />
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {cat.desc}
                  </p>
                </div>
                <div className="hidden md:block font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                  ─── Sector
                </div>
                <div className="h-12 w-12 flex items-center justify-center border border-primary/40 group-hover:bg-primary group-hover:border-primary transition-all" aria-label={`Voir les produits ${cat.title}`}>
                  <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
