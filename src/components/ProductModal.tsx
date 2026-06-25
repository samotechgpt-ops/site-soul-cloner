import { AnimatePresence, motion } from "motion/react";
import { X, ShoppingCart, Check, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { type Product } from "@/lib/data";
import { formatPriceDzd } from "@/lib/local-store";
import { useCart } from "@/lib/stores";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const add = useCart((s) => s.add);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
    if (!product) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-background/85 p-3 backdrop-blur-xl sm:p-4"
        >
          <div className="pointer-events-none fixed inset-0 precision-lines opacity-15" />
          <motion.article
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.96 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto grid w-full max-w-5xl gap-0 overflow-hidden border border-primary/30 bg-card shadow-glow clip-corner md:grid-cols-[1.1fr_1fr]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center border border-primary/40 bg-background/80 backdrop-blur hover:bg-primary/15"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Gallery */}
            <div className="relative bg-white p-4 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
              {(() => {
                const gallery = (product.images && product.images.length ? product.images : [product.image]).filter(Boolean);
                const src = gallery[active] || product.image;
                return (
                  <>
                    <div className="relative aspect-square overflow-hidden">
                      <img src={src} alt={product.name} className="h-full w-full object-contain" />
                    </div>
                    {gallery.length > 1 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto">
                        {gallery.map((g, i) => (
                          <button key={`${g}-${i}`} type="button" onClick={() => setActive(i)} className={`h-16 w-16 shrink-0 border ${i === active ? "border-primary" : "border-primary/20"} bg-white p-1`}>
                            <img src={g} alt={`${product.name} ${i + 1}`} className="h-full w-full object-contain" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
              <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.25em] text-primary bg-background/70 backdrop-blur border border-primary/40 px-2 py-1 uppercase">
                {product.code || product.id.slice(0, 8).toUpperCase()}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4 bg-background p-5 sm:gap-5 sm:p-6 md:p-8">
              <div>
                <p className="font-mono text-[10px] tracking-[0.35em] text-primary uppercase">▸ {product.categoryLabel}</p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter leading-[1] break-words">{product.name}</h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xl text-primary tabular-nums">
                  {product.priceValue ? formatPriceDzd(product.priceValue) : product.price}
                </span>
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1 border border-primary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                    <Check className="h-3 w-3" /> En stock {product.stock ? `· ${product.stock}` : ""}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 border border-foreground/30 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    <AlertCircle className="h-3 w-3" /> Sold out
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description || "Description à venir."}
              </p>

              <dl className="grid grid-cols-2 gap-3 border-t border-primary/15 pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <div><dt className="text-[9px] text-primary">Référence</dt><dd className="mt-1 text-foreground">{product.code || product.id.slice(0, 8)}</dd></div>
                <div><dt className="text-[9px] text-primary">Catégorie</dt><dd className="mt-1 text-foreground">{product.categoryLabel}</dd></div>
                <div><dt className="text-[9px] text-primary">Prix</dt><dd className="mt-1 text-foreground">{product.priceValue ? formatPriceDzd(product.priceValue) : "Sur devis"}</dd></div>
                <div><dt className="text-[9px] text-primary">Disponibilité</dt><dd className="mt-1 text-foreground">{product.inStock ? "Immédiate" : "Sur commande"}</dd></div>
              </dl>

              <div className="mt-auto flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => { add({ id: product.id, slug: product.id, name: product.name, price: product.priceValue, image: product.image }); }}
                  className="inline-flex flex-1 items-center justify-center gap-2 bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary-foreground transition hover:opacity-90"
                >
                  <ShoppingCart className="h-4 w-4" /> Ajouter au panier
                </button>
                <a
                  href={`/commander?product=${encodeURIComponent(product.id)}`}
                  className="inline-flex items-center justify-center gap-2 border border-primary/50 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  Commander
                </a>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
