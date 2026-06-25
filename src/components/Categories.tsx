import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { categories as defaultCategories, type Category } from "@/lib/data";
import { CATEGORIES_CHANGED_EVENT, loadManagedCategories } from "@/lib/local-store";
import { ScrambleText } from "./ScrambleText";
import { ArrowUpRight } from "lucide-react";

function openSector(cat: Category) {
  window.location.href = `/commander?category=${encodeURIComponent(cat.slug || cat.id)}`;
}

export function Categories() {
  const [cats, setCats] = useState<Category[]>(() => defaultCategories);

  useEffect(() => {
    setCats(loadManagedCategories());
    const sync = () => setCats(loadManagedCategories());
    window.addEventListener(CATEGORIES_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CATEGORIES_CHANGED_EVENT, sync);
  }, []);

  return (
    <section id="categories" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full gradient-glow blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="mb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 font-mono text-xs tracking-[0.35em] text-primary uppercase"
          >
            ▸ 02 — Catégories informatiques
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tighter leading-[1]"
          >
            Choisissez votre <span className="text-primary text-glow-crimson italic">équipement.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl text-muted-foreground leading-relaxed"
          >
            Chaque produit AUDAX Technology est rattaché à une catégorie claire : moniteurs, PC All-In-One, accessoires et solutions professionnelles.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((cat, i) => (
            <motion.button
              type="button"
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              onClick={() => openSector(cat)}
              className="business-panel group relative overflow-hidden border border-primary/25 bg-card/40 text-left clip-corner"
            >
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[4/5]">
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-0 precision-lines opacity-35 mix-blend-overlay" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
                <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.3em] text-primary border border-primary/40 bg-background/60 backdrop-blur px-2 py-1 uppercase">
                  ◢ {cat.code}
                </span>
                <span className="absolute top-3 right-3 h-9 w-9 grid place-items-center border border-primary/40 bg-background/60 backdrop-blur group-hover:bg-primary group-hover:border-primary transition">
                  <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition-transform" />
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    <ScrambleText text={cat.title} duration={700} />
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{cat.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
