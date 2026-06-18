import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Boxes, ClipboardList, LogOut, Plus, RotateCcw, Save, Settings, ShieldCheck, Trash2, Upload } from "lucide-react";
import { type Product } from "@/lib/data";
import { formatPriceDzd, getAdminPassword, loadLocalOrders, loadManagedProducts, resetManagedProducts, saveManagedProducts, setAdminPassword, updateLocalOrderStatus, uid, type LocalOrder, type OrderStatus } from "@/lib/local-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin AUDAX Gaming — Produits et commandes" },
      { name: "description", content: "Panel admin AUDAX Gaming pour gérer les produits, photos, prix et commandes clients." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin AUDAX Gaming" },
      { property: "og:description", content: "Gestion produits et commandes AUDAX Gaming." },
    ],
  }),
  component: AdminPage,
});

const blank: Product = { id: "", name: "", category: "monitor", categoryLabel: "Monitor", price: "Sur devis", priceValue: 0, inStock: true, image: "", code: "", description: "" };
type AdminTab = "products" | "leads" | "settings";

const tabs: Array<{ id: AdminTab; label: string; icon: typeof Boxes }> = [
  { id: "products", label: "Produits", icon: Boxes },
  { id: "leads", label: "Leads", icon: ClipboardList },
  { id: "settings", label: "Paramètres", icon: Settings },
];

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<AdminTab>("products");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [editing, setEditing] = useState<Product>(blank);
  const [message, setMessage] = useState("");
  const [security, setSecurity] = useState({ current: "", next: "", confirm: "" });

  const dashboard = useMemo(() => ({
    products: products.length,
    leads: orders.length,
    revenue: orders.reduce((sum, order) => sum + order.total_dzd, 0),
    pending: orders.filter((order) => order.status === "new" || order.status === "processing").length,
  }), [orders, products]);

  useEffect(() => {
    setAuthed(window.localStorage.getItem("audax-admin-ok") === "1");
    setProducts(loadManagedProducts());
    setOrders(loadLocalOrders());
    const refreshOrders = () => setOrders(loadLocalOrders());
    window.addEventListener("audax-orders-changed", refreshOrders);
    return () => window.removeEventListener("audax-orders-changed", refreshOrders);
  }, []);

  const login = () => {
    if (password === getAdminPassword()) {
      window.localStorage.setItem("audax-admin-ok", "1");
      setAuthed(true);
      setMessage("Connecté");
    } else setMessage("Mot de passe incorrect");
  };

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditing((p) => ({ ...p, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const save = () => {
    const nextProduct: Product = { ...editing, id: editing.id || uid("prod"), price: editing.priceValue ? formatPriceDzd(editing.priceValue) : "Sur devis", categoryLabel: editing.category === "monitor" ? "Monitor" : "All In One", code: editing.code || editing.name.slice(0, 8).toUpperCase() };
    const next = products.some((p) => p.id === nextProduct.id) ? products.map((p) => (p.id === nextProduct.id ? nextProduct : p)) : [nextProduct, ...products];
    setProducts(next);
    saveManagedProducts(next);
    setEditing(blank);
    setMessage("Produit enregistré");
  };

  const remove = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    saveManagedProducts(next);
  };

  const setStatus = (id: string, status: OrderStatus) => {
    updateLocalOrderStatus(id, status);
    setOrders(loadLocalOrders());
  };

  const logout = () => {
    window.localStorage.removeItem("audax-admin-ok");
    setAuthed(false);
    setPassword("");
  };

  const changePassword = () => {
    if (security.current !== getAdminPassword()) {
      setMessage("Mot de passe actuel incorrect");
      return;
    }
    if (security.next.length < 6 || security.next !== security.confirm) {
      setMessage("Le nouveau mot de passe doit correspondre et contenir au moins 6 caractères");
      return;
    }
    setAdminPassword(security.next);
    setSecurity({ current: "", next: "", confirm: "" });
    setMessage("Mot de passe admin modifié");
  };

  if (!authed) {
    return <main className="dark min-h-screen overflow-hidden bg-background px-6 py-24 text-foreground"><div className="absolute inset-0 bg-grid opacity-20" /><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-md border border-primary/25 bg-card p-6 shadow-glow clip-corner"><div className="mb-6 flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-primary" /><div><p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">Secure access</p><h1 className="font-display text-3xl font-bold">Admin AUDAX</h1></div></div><input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }} type="password" placeholder="Mot de passe" className="mt-2 w-full border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><button type="button" onClick={login} className="mt-4 w-full bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground">Se connecter</button><p className="mt-3 text-sm text-muted-foreground">{message || "Accès administrateur protégé"}</p></motion.div></main>;
  }

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto grid min-h-screen max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="border border-primary/20 bg-card/70 p-4 backdrop-blur clip-corner lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-primary/15 pb-5">
            <div className="min-w-0"><p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">Panel admin</p><h1 className="truncate font-display text-2xl font-bold">AUDAX Gaming</h1></div>
            <button type="button" onClick={logout} className="grid h-10 w-10 shrink-0 place-items-center border border-primary/30 hover:bg-primary/10" aria-label="Déconnexion"><LogOut className="h-4 w-4" /></button>
          </div>
          <nav className="mt-5 grid gap-2">
            {tabs.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] transition ${tab === item.id ? "border-primary bg-primary text-primary-foreground" : "border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}><Icon className="h-4 w-4 shrink-0" /><span className="truncate">{item.label}</span></button>;
            })}
          </nav>
          <Link to="/" className="mt-5 inline-flex w-full justify-center border border-primary/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground">Retour site</Link>
          {message && <p className="mt-4 border border-primary/20 bg-primary/10 p-3 text-sm text-primary">{message}</p>}
        </aside>

        <section className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-4">
            {[{ label: "Produits", value: dashboard.products }, { label: "Leads", value: dashboard.leads }, { label: "En cours", value: dashboard.pending }, { label: "Total", value: formatPriceDzd(dashboard.revenue) }].map((stat) => <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="border border-primary/15 bg-card/70 p-4 backdrop-blur"><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{stat.label}</p><strong className="mt-2 block font-display text-2xl text-primary">{stat.value}</strong></motion.div>)}
          </div>

          <AnimatePresence mode="wait">
            {tab === "products" && (
              <motion.div key="products" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="truncate font-display text-2xl font-bold">{editing.id ? "Modifier produit" : "Ajouter produit"}</h2><button type="button" onClick={() => setEditing(blank)} className="grid h-10 w-10 place-items-center border border-primary/30"><Plus className="h-4 w-4" /></button></div><div className="mt-4 grid gap-3"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Nom" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} placeholder="Code" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><input type="number" value={editing.priceValue} onChange={(e) => setEditing({ ...editing, priceValue: Number(e.target.value) })} placeholder="Prix DZD — 0 = Sur devis" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as Product["category"] })} className="border border-input bg-background px-3 py-3 outline-none focus:border-primary"><option value="monitor">Monitor</option><option value="allinone">All In One</option></select><label className="flex items-center gap-3 text-sm text-muted-foreground"><input type="checkbox" checked={editing.inStock} onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })} className="h-4 w-4 accent-primary" /> En stock</label><textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Description" className="min-h-24 border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><label className="border border-dashed border-primary/40 p-4 text-sm text-muted-foreground"><Upload className="mb-2 h-5 w-5 text-primary" />Uploader photo<input type="file" accept="image/*" onChange={upload} className="mt-2 block w-full text-xs" /></label>{editing.image && <img src={editing.image} alt="Aperçu produit" className="h-44 w-full bg-foreground object-contain p-3" />}<button type="button" onClick={save} disabled={!editing.name || !editing.image} className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"><Save className="h-4 w-4" /> Enregistrer</button></div></div>
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="truncate font-display text-2xl font-bold">Catalogue</h2><button type="button" onClick={() => { resetManagedProducts(); setProducts(loadManagedProducts()); setMessage("Catalogue réinitialisé"); }} className="inline-flex shrink-0 items-center gap-2 text-xs text-muted-foreground underline"><RotateCcw className="h-3 w-3" /> Reset</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">{products.map((p) => <article key={p.id} className="border border-primary/15 bg-background p-3"><img src={p.image} alt={p.name} className="h-32 w-full bg-foreground object-contain p-2" /><h3 className="mt-3 font-bold">{p.name}</h3><p className="font-mono text-xs text-primary">{formatPriceDzd(p.priceValue)}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => setEditing(p)} className="flex-1 border border-primary/30 px-3 py-2 text-xs hover:bg-primary/10"><Plus className="inline h-3 w-3" /> Modifier</button><button type="button" onClick={() => remove(p.id)} className="border border-primary/30 px-3 py-2 hover:bg-primary/10" aria-label={`Supprimer ${p.name}`}><Trash2 className="h-4 w-4" /></button></div></article>)}</div></div>
              </motion.div>
            )}

            {tab === "leads" && (
              <motion.section key="leads" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 border border-primary/20 bg-card/70 p-5 backdrop-blur"><h2 className="font-display text-2xl font-bold">Commandes / leads</h2><div className="mt-4 grid gap-3">{orders.length === 0 && <p className="text-sm text-muted-foreground">Aucune commande pour l’instant.</p>}{orders.map((o) => <article key={o.id} className="border border-primary/15 bg-background p-4"><div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><div className="min-w-0"><h3 className="truncate font-bold">{o.customer_name} · {o.phone}</h3><p className="text-sm text-muted-foreground">{o.email}</p><p className="text-sm text-muted-foreground">{o.wilaya} {o.address}</p><p className="mt-2 font-mono text-xs text-primary">{formatPriceDzd(o.total_dzd)}</p></div><select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className="h-10 border border-input bg-background px-3"><option value="new">Nouveau</option><option value="confirmed">Confirmé</option><option value="processing">Traitement</option><option value="done">Terminé</option><option value="cancelled">Annulé</option></select></div><ul className="mt-3 text-sm text-muted-foreground">{o.items.map((i) => <li key={i.id}>{i.name} x{i.qty} — {formatPriceDzd(i.price)}</li>)}</ul>{o.notes && <p className="mt-3 border-l border-primary/40 pl-3 text-sm text-muted-foreground">{o.notes}</p>}</article>)}</div></motion.section>
            )}

            {tab === "settings" && (
              <motion.section key="settings" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 grid gap-6 xl:grid-cols-2"><div className="border border-primary/20 bg-card/70 p-5 backdrop-blur"><h2 className="font-display text-2xl font-bold">Sécurité</h2><div className="mt-4 grid gap-3"><input type="password" value={security.current} onChange={(e) => setSecurity({ ...security, current: e.target.value })} placeholder="Mot de passe actuel" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><input type="password" value={security.next} onChange={(e) => setSecurity({ ...security, next: e.target.value })} placeholder="Nouveau mot de passe" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><input type="password" value={security.confirm} onChange={(e) => setSecurity({ ...security, confirm: e.target.value })} placeholder="Confirmer" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><button type="button" onClick={changePassword} className="bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground">Changer le mot de passe</button></div></div><div className="border border-primary/20 bg-card/70 p-5 backdrop-blur"><h2 className="font-display text-2xl font-bold">Actions rapides</h2><div className="mt-4 grid gap-3"><button type="button" onClick={() => { resetManagedProducts(); setProducts(loadManagedProducts()); setMessage("Produits restaurés"); }} className="border border-primary/30 px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary/10">Restaurer le catalogue</button><button type="button" onClick={logout} className="border border-primary/30 px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary/10">Déconnexion</button></div></div></motion.section>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}