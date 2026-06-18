import { motion } from "motion/react";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { type Product } from "@/lib/data";
import { formatPriceDzd, loadManagedProducts, PRODUCTS_CHANGED_EVENT } from "@/lib/local-store";
import { useCart } from "@/lib/stores";
import { TiltCard } from "./TiltCard";

export function Products() {
  const [items, setItems] = useState<Product[]>(loadManagedProducts);
  const add = useCart((s) => s.add);

  useEffect(() => {
    const sync = () => setItems(loadManagedProducts());
    window.addEventListener(PRODUCTS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PRODUCTS_CHANGED_EVENT, sync);
  }, []);

  return (
    <section id="products" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-20 flex items-end justify-between flex-wrap gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-4 font-mono text-xs tracking-[0.35em] text-primary uppercase"
            >
              ▸ 03 — The Catalogue
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-6xl font-bold tracking-tighter leading-[1]"
            >
              Innovation built<br />for <span className="text-primary text-glow-crimson italic">tomorrow.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-sm text-muted-foreground text-sm"
          >
            8 active references across All-In-One systems and professional monitors — engineered for performance and longevity.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="group">
                <article className="esport-panel relative border border-primary/20 bg-card/50 backdrop-blur clip-corner overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

                    {/* Status badge */}
                    {!p.inStock && (
                      <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.25em] text-foreground bg-foreground/10 backdrop-blur border border-foreground/20 px-2 py-1 uppercase">
                        Sold out
                      </div>
                    )}
                    {p.inStock && (
                      <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.25em] text-primary bg-background/60 backdrop-blur border border-primary/40 px-2 py-1 uppercase">
                        ◉ In Stock
                      </div>
                    )}

                    {/* Code */}
                    <div className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.25em] text-foreground/70 bg-background/60 backdrop-blur px-2 py-1 uppercase">
                      {p.code}
                    </div>

                    {/* Arrow */}
                    <button
                      type="button"
                      onClick={() => add({ id: p.id, slug: p.id, name: p.name, price: p.priceValue, image: p.image })}
                      className="absolute bottom-3 right-3 h-10 w-10 flex items-center justify-center border border-primary/40 bg-background/80 backdrop-blur transition-all hover:bg-primary hover:border-primary"
                      aria-label={`Ajouter ${p.name} au panier`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => add({ id: p.id, slug: p.id, name: p.name, price: p.priceValue, image: p.image })}
                      className="absolute bottom-3 left-3 h-9 w-9 flex items-center justify-center border border-primary/40 bg-background/60 backdrop-blur group-hover:bg-primary group-hover:border-primary transition-all"
                      aria-label={`Commander ${p.name}`}
                    >
                      <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                    </button>
                  </div>

                  <div className="relative p-5 bg-background">
                    <div className="mb-1 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                      {p.categoryLabel}
                    </div>
                    <h3 className="font-display text-lg font-bold tracking-tight">{p.name}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-primary tabular-nums">{p.priceValue ? formatPriceDzd(p.priceValue) : p.price}</span>
                      <button
                        type="button"
                        onClick={() => add({ id: p.id, slug: p.id, name: p.name, price: p.priceValue, image: p.image })}
                        className="border border-primary/40 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                      >
                        {p.priceValue ? "Commander" : "Devis"}
                      </button>
                    </div>
                    <div className="mt-4 h-px w-full bg-primary/20 overflow-hidden">
                      <div className="h-full w-0 bg-primary transition-all duration-700 group-hover:w-full" />
                    </div>
                  </div>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
