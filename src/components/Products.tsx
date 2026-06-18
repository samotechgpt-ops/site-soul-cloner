import { motion } from "motion/react";
import { ArrowUpRight, ShoppingCart, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { type Product } from "@/lib/data";
import { formatPriceDzd, loadManagedProducts, PRODUCTS_CHANGED_EVENT } from "@/lib/local-store";
import { useCart } from "@/lib/stores";
import { TiltCard } from "./TiltCard";
import { ProductModal } from "./ProductModal";
import soldierDisplay from "@/assets/audax-soldier-display.jpg";

export function Products() {
  const [items, setItems] = useState<Product[]>(loadManagedProducts);
  const [active, setActive] = useState<Product | null>(null);
  const add = useCart((s) => s.add);

  useEffect(() => {
    const sync = () => setItems(loadManagedProducts());
    window.addEventListener(PRODUCTS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PRODUCTS_CHANGED_EVENT, sync);
  }, []);

  return (
    <section id="products" className="relative py-32 overflow-hidden">
      <span id="products-allinone" className="absolute -top-24" />
      <span id="products-monitor" className="absolute -top-24" />
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

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 grid items-center gap-8 border border-primary/20 bg-card/40 p-6 backdrop-blur clip-corner lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden border border-primary/20 bg-background/60 clip-corner">
            <img src={soldierDisplay} alt="Soldat esport AUDAX Gaming avec écran gaming" loading="lazy" width={1280} height={960} className="aspect-[4/3] h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">◢ Esport display protocol</p>
            <h3 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tighter md:text-6xl">Bold vision.<br /><span className="text-primary text-glow-crimson italic">Smarter displays.</span></h3>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">Une expérience visuelle inspirée gaming : écrans VAR, All-In-One performants, animations HUD, scanlines et catalogue en mouvement pour retrouver l’énergie esport demandée.</p>
            <button type="button" onClick={() => { window.location.href = "/commander"; }} className="mt-7 border border-primary px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary transition hover:bg-primary hover:text-primary-foreground">Commander</button>
          </div>
        </motion.div>

        <div className="relative overflow-hidden border border-primary/20 bg-background/50 py-6 clip-corner">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
          <div className="product-carousel-track flex w-max gap-6 px-6">
            {[...items, ...items].map((p, i) => (
            <motion.div
              key={`${p.id}-${i}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-[280px] shrink-0 md:w-[320px]"
            >
              <TiltCard className="group">
                <article className="esport-panel relative border border-primary/20 bg-card/50 backdrop-blur clip-corner overflow-hidden">
                  <button type="button" onClick={() => setActive(p)} className="block w-full text-left" aria-label={`Voir ${p.name}`}>
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
                  </div>
                  </button>

                  {/* Action buttons (outside the inner button to avoid nested buttons) */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); add({ id: p.id, slug: p.id, name: p.name, price: p.priceValue, image: p.image }); }}
                    className="absolute bottom-[42%] right-3 h-10 w-10 flex items-center justify-center border border-primary/40 bg-background/80 backdrop-blur transition-all hover:bg-primary hover:border-primary"
                    aria-label={`Ajouter ${p.name} au panier`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActive(p); }}
                    className="absolute bottom-[42%] left-3 h-10 w-10 flex items-center justify-center border border-primary/40 bg-background/80 backdrop-blur group-hover:bg-primary group-hover:border-primary transition-all"
                    aria-label={`Voir ${p.name}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <div className="relative p-5 bg-background">
                    <div className="mb-1 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                      {p.categoryLabel}
                    </div>
                    <button type="button" onClick={() => setActive(p)} className="text-left">
                      <h3 className="font-display text-lg font-bold tracking-tight hover:text-primary transition">{p.name}</h3>
                    </button>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-primary tabular-nums">{p.priceValue ? formatPriceDzd(p.priceValue) : p.price}</span>
                      <button
                        type="button"
                        onClick={() => setActive(p)}
                        className="inline-flex items-center gap-1 border border-primary/40 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                      >
                        Détails <ArrowUpRight className="w-3 h-3" />
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
      </div>
      <ProductModal product={active} onClose={() => setActive(null)} />
    </section>
  );
}
