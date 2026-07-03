import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronRight, Sparkles, Zap, ArrowLeft } from "lucide-react";
import { products as seedProducts, type Product } from "@/lib/data";
import { uid, formatPriceDzd } from "@/lib/local-store";
import { listPublicProducts } from "@/lib/products.functions";
import { createOrder } from "@/lib/leads.functions";
import { mapPublicProduct } from "@/lib/product-mapping";
import { WILAYAS } from "@/lib/wilayas";

export const Route = createFileRoute("/commander")({
  head: () => ({
    meta: [
      { title: "Commander produits VAR Algérie — Moniteurs & PC All-In-One" },
      { name: "description", content: "Commandez vos produits informatiques VAR en Algérie : moniteurs VAR N22, T24M, PC All-In-One XPS22F/XPS22M, accessoires IT. Livraison 69 wilayas et devis rapide." },
      { name: "keywords", content: "commander VAR Algérie, moniteur VAR N22, VAR T24M, PC VAR XPS22F, XPS22M, ordinateur VAR Algérie, matériel informatique Alger, livraison 69 wilayas" },
      { property: "og:title", content: "Commander produits VAR — Algérie" },
      { property: "og:description", content: "Choisissez vos produits AUDAX et recevez un devis rapide partout en Algérie." },
      { property: "og:url", content: "/commander" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/commander" }],
  }),
  component: LandingPage,
});

const requestTypes = [
  { id: "products", label: "Produits du catalogue", icon: Zap },
  { id: "custom", label: "Autre / Demande spéciale", icon: Sparkles },
];

const orbs = Array.from({ length: 14 }, (_, i) => ({ id: i, x: (i * 73) % 100, y: (i * 41) % 100, d: 14 + (i % 6) * 2 }));

function LandingPage() {
  const call = useServerFn(listPublicProducts);
  const submitOrder = useServerFn(createOrder);
  const { data } = useQuery({
    queryKey: ["public-products"],
    queryFn: () => call({ data: {} }),
    staleTime: 30_000,
  });
  const products: Product[] = useMemo(() => {
    const mapped = (data ?? []).map(mapPublicProduct);
    return mapped.length > 0 ? mapped : seedProducts;
  }, [data]);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<"products" | "custom">("products");
  const [customRequest, setCustomRequest] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", wilaya: "", address: "", notes: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "custom") setMode("custom");
    const category = params.get("category");
    if (category && products.length) {
      const matches = products.filter((p: Product) => (p.categoryId || p.category) === category);
      if (matches.length) {
        const pre: Record<string, number> = {};
        for (const m of matches) pre[m.id] = 1;
        setSelected(pre);
      }
    }
  }, [products]);

  const total = useMemo(() => Object.entries(selected).reduce((sum, [id, qty]) => {
    const p = products.find((x) => x.id === id);
    return sum + (p?.priceValue || 0) * qty;
  }, 0), [selected, products]);

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: s[id] ? 0 : 1 }));
  const setQty = (id: string, qty: number) => setSelected((s) => ({ ...s, [id]: Math.max(0, qty) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.wilaya || submitting) return;
    const items = Object.entries(selected).filter(([, q]) => q > 0).map(([id, qty]) => {
      const p = products.find((x) => x.id === id)!;
      return { id, name: p.name, price: p.priceValue, qty };
    });
    if (mode === "custom" && customRequest.trim()) {
      items.push({ id: uid("custom"), name: `Autre : ${customRequest.trim()}`, price: 0, qty: 1 });
    }
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      await submitOrder({
        data: {
          customer_name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          wilaya: form.wilaya || undefined,
          address: form.address || undefined,
          notes: form.notes || undefined,
          items,
          total_dzd: total,
          whatsapp_sent: false,
        },
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <main className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
        <AnimatedBg />
        <div className="relative mx-auto grid min-h-screen max-w-2xl place-items-center px-6 text-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="business-panel border border-primary/40 bg-card/70 p-10 clip-corner shadow-glow">
            <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring" }} className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-primary bg-primary/10"><Check className="h-10 w-10 text-primary" /></motion.div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tighter">Commande reçue.</h1>
            <p className="mt-3 text-muted-foreground">Nous vous contactons sous 24h pour validation.</p>
            <Link to="/" className="mt-8 inline-flex items-center gap-2 border border-primary px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] text-primary hover:bg-primary hover:text-primary-foreground"><ArrowLeft className="h-3 w-3" /> Retour à l'accueil</Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="dark relative min-h-screen overflow-hidden bg-background text-foreground">
      <AnimatedBg />
      <div className="relative mx-auto max-w-[1300px] px-4 py-10 sm:px-6 sm:py-12 lg:py-20">
        <motion.header initial={false} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap items-center justify-between gap-3 sm:mb-12">
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground hover:text-primary"><ArrowLeft className="h-3 w-3" /> Accueil</Link>
          <span className="animate-hud-flicker font-mono text-[10px] uppercase tracking-[0.35em] text-primary">◉ Live · Commande sécurisée</span>
        </motion.header>

        <div className="mb-10 text-center sm:mb-12">
          <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} className="font-display text-[2.25rem] sm:text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]">
            Configure ta <span className="text-primary text-glow-crimson italic">commande</span>
          </motion.h1>
          <motion.p initial={false} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-muted-foreground">
            Sélectionne tes produits AUDAX ou décris ton besoin. Livraison 69 wilayas et zones premium.
          </motion.p>
        </div>

        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Left: products */}
          <motion.section initial={false} animate={{ opacity: 1, x: 0 }} className="business-panel border border-primary/25 bg-card/60 p-4 backdrop-blur clip-corner sm:p-6">
            <div className="mb-5 flex flex-wrap gap-2">
              {requestTypes.map((r) => {
                const Icon = r.icon;
                const active = mode === r.id;
                return (
                  <button key={r.id} type="button" onClick={() => setMode(r.id as typeof mode)} className={`inline-flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 text-muted-foreground hover:border-primary"}`}>
                    <Icon className="h-3 w-3" /> {r.label}
                  </button>
                );
              })}
            </div>

            <h2 className="font-display text-2xl font-bold">{mode === "products" ? "Choisis tes produits" : "Décris ton besoin"}</h2>

            {mode === "custom" && (
              <textarea value={customRequest} onChange={(e) => setCustomRequest(e.target.value)} placeholder="Ex : Imprimante laser couleur, écran 27 pouces, PC bureautique, onduleur, toner..." className="mt-4 min-h-32 w-full border border-input bg-background px-4 py-3 outline-none focus:border-primary" />
            )}

            <div className="mt-4 max-h-[480px] space-y-2 overflow-auto pr-1">
              {products.map((p) => {
                const qty = selected[p.id] || 0;
                const active = qty > 0;
                return (
                  <motion.div key={p.id} layout className={`grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3 border p-3 transition sm:grid-cols-[64px_minmax(0,1fr)_auto] ${active ? "border-primary bg-primary/5" : "border-primary/15 bg-background/60 hover:border-primary/40"}`}>
                    <button type="button" onClick={() => toggle(p.id)} className="h-14 w-14 overflow-hidden bg-white sm:h-16 sm:w-16"><img src={p.image} alt={p.name} className="h-full w-full object-contain p-1" /></button>
                    <button type="button" onClick={() => toggle(p.id)} className="min-w-0 text-left">
                      <p className="truncate font-bold">{p.name}</p>
                      <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{p.categoryLabel} · {p.code}</p>
                      <p className="mt-1 font-mono text-xs text-primary">{p.priceValue ? formatPriceDzd(p.priceValue) : "Sur devis"} {!p.inStock && <span className="ml-2 text-muted-foreground">(rupture)</span>}</p>
                    </button>
                    <div className="col-span-2 sm:col-span-1 sm:col-start-3">
                      {active ? (
                        <div className="flex w-full items-center justify-end border border-primary/40 sm:w-auto">
                          <button type="button" onClick={() => setQty(p.id, qty - 1)} className="h-9 w-10 hover:bg-primary/10">−</button>
                          <span className="w-10 text-center font-mono text-sm tabular-nums">{qty}</span>
                          <button type="button" onClick={() => setQty(p.id, qty + 1)} className="h-9 w-10 hover:bg-primary/10">+</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => toggle(p.id)} className="w-full border border-primary/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto">Ajouter</button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Right: form */}
          <motion.aside initial={false} animate={{ opacity: 1, x: 0 }} className="business-panel border border-primary/25 bg-card/60 p-4 backdrop-blur clip-corner sm:p-6">
            <h2 className="font-display text-2xl font-bold">Tes coordonnées</h2>
            <div className="mt-4 grid gap-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom complet *" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Téléphone *" type="tel" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
              <select required value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} className="border border-input bg-background px-3 py-3 outline-none focus:border-primary">
                <option value="">Wilaya de livraison *</option>
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Adresse" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (mode de paiement, heure de livraison...)" className="min-h-20 border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
            </div>

            <div className="mt-5 border-t border-primary/20 pt-4">
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em]">
                <span className="text-muted-foreground">Total estimé</span>
                <span className="text-primary">{total ? formatPriceDzd(total) : "Sur devis"}</span>
              </div>
              <motion.button whileTap={{ scale: 0.96 }} type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 font-mono text-xs uppercase tracking-[0.3em] text-primary-foreground hover:opacity-90">
                Envoyer la commande <ChevronRight className="h-4 w-4" />
              </motion.button>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">◉ Traitée par AUDAX Technology · 69 wilayas</p>
            </div>
          </motion.aside>
        </form>
      </div>
    </main>
  );
}

function AnimatedBg() {
  return (
    <>
      <div className="absolute inset-0 bg-grid animate-grid-pan opacity-30" />
      <div className="absolute inset-0 gradient-glow opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {orbs.map((o) => (
          <motion.div key={o.id} className="absolute h-1.5 w-1.5 rounded-full bg-primary/70" style={{ left: `${o.x}%`, top: `${o.y}%` }}
            animate={{ y: ["0%", "-200%"], opacity: [0, 1, 0] }}
            transition={{ duration: o.d, repeat: Infinity, delay: (o.id % 5) * 0.7, ease: "linear" }} />
        ))}
      </div>
    </>
  );
}
