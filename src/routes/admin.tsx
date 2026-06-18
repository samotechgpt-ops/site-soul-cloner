import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Boxes, ClipboardList, LogOut, Plus, RotateCcw, Save, Settings, ShieldCheck, Sparkles, Tag, Trash2, Upload, X } from "lucide-react";
import { type Product, type Category } from "@/lib/data";
import { generateProductDescription } from "@/lib/ai.functions";
import {
  formatPriceDzd,
  getAdminPassword,
  loadLocalOrders,
  loadManagedCategories,
  loadManagedProducts,
  resetManagedCategories,
  resetManagedProducts,
  saveManagedCategories,
  saveManagedProducts,
  setAdminPassword,
  updateLocalOrderStatus,
  uid,
  type LocalOrder,
  type OrderStatus,
} from "@/lib/local-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin AUDAX Gaming — Produits et commandes" },
      { name: "description", content: "Panel admin AUDAX Gaming pour gérer les produits, catégories, photos, prix et commandes clients." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin AUDAX Gaming" },
      { property: "og:description", content: "Gestion produits et commandes AUDAX Gaming." },
    ],
  }),
  component: AdminPage,
});

const blank: Product = { id: "", name: "", category: "monitor", categoryLabel: "Gaming Monitors", categoryId: "monitor", price: "Sur devis", priceValue: 0, inStock: true, stock: 0, image: "", images: [], code: "", description: "" };
const blankCat: Category = { id: "", code: "", slug: "", title: "", desc: "", image: "" };
type AdminTab = "products" | "categories" | "leads" | "settings";

const tabs: Array<{ id: AdminTab; label: string; icon: typeof Boxes }> = [
  { id: "products", label: "Produits", icon: Boxes },
  { id: "categories", label: "Catégories", icon: Tag },
  { id: "leads", label: "Leads", icon: ClipboardList },
  { id: "settings", label: "Paramètres", icon: Settings },
];

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<AdminTab>("products");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [editing, setEditing] = useState<Product>(blank);
  const [editingCat, setEditingCat] = useState<Category>(blankCat);
  const [message, setMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [security, setSecurity] = useState({ current: "", next: "", confirm: "" });
  const callGenDesc = useServerFn(generateProductDescription);

  const dashboard = useMemo(() => ({
    products: products.length,
    leads: orders.length,
    revenue: orders.reduce((sum, order) => sum + order.total_dzd, 0),
    pending: orders.filter((order) => order.status === "new" || order.status === "processing").length,
  }), [orders, products]);

  useEffect(() => {
    setAuthed(window.localStorage.getItem("audax-admin-ok") === "1");
    setProducts(loadManagedProducts());
    setCats(loadManagedCategories());
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
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const readers = files.map((file) => new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.readAsDataURL(file);
    }));
    Promise.all(readers).then((urls) => {
      setEditing((p) => ({
        ...p,
        image: p.image || urls[0],
        images: [...(p.images || []), ...urls],
      }));
    });
  };

  const removeImage = (idx: number) => {
    setEditing((p) => {
      const next = (p.images || []).filter((_, i) => i !== idx);
      return { ...p, images: next, image: next[0] || "" };
    });
  };

  const aiDescribe = async () => {
    if (!editing.name) { setMessage("Indiquez d'abord le nom du produit"); return; }
    setAiLoading(true);
    try {
      const cat = cats.find((c) => c.id === (editing.categoryId || editing.category));
      const result = await callGenDesc({ data: { name: editing.name, category: cat?.title || editing.categoryLabel || "", price: editing.priceValue || 0, hints: editing.description } });
      setEditing((p) => ({ ...p, description: result.description }));
      setMessage("Description générée par IA");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur IA";
      setMessage(msg);
    } finally {
      setAiLoading(false);
    }
  };

  const uploadCat = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditingCat((c) => ({ ...c, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const save = () => {
    const cat = cats.find((c) => c.id === (editing.categoryId || editing.category));
    const catId = cat?.id || editing.category || "monitor";
    const catLabel = cat?.title || editing.categoryLabel || "Produit";
    const nextProduct: Product = {
      ...editing,
      id: editing.id || uid("prod"),
      price: editing.priceValue ? formatPriceDzd(editing.priceValue) : "Sur devis",
      category: catId,
      categoryId: catId,
      categoryLabel: catLabel,
      code: editing.code || editing.name.slice(0, 8).toUpperCase(),
    };
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

  const saveCat = () => {
    if (!editingCat.title) { setMessage("Titre catégorie requis"); return; }
    const slug = (editingCat.slug || editingCat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    const id = editingCat.id || `cat-${slug}-${Date.now().toString(36)}`;
    const nextCat: Category = {
      ...editingCat,
      id,
      slug,
      code: editingCat.code || String(cats.length + 1).padStart(2, "0"),
    };
    const next = cats.some((c) => c.id === nextCat.id) ? cats.map((c) => (c.id === nextCat.id ? nextCat : c)) : [...cats, nextCat];
    setCats(next);
    saveManagedCategories(next);
    setEditingCat(blankCat);
    setMessage("Catégorie enregistrée");
  };

  const removeCat = (id: string) => {
    const next = cats.filter((c) => c.id !== id);
    setCats(next);
    saveManagedCategories(next);
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
    if (security.current !== getAdminPassword()) { setMessage("Mot de passe actuel incorrect"); return; }
    if (security.next.length < 6 || security.next !== security.confirm) { setMessage("Le nouveau mot de passe doit correspondre et contenir au moins 6 caractères"); return; }
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
            {[{ label: "Produits", value: dashboard.products }, { label: "Catégories", value: cats.length }, { label: "Leads", value: dashboard.leads }, { label: "Total", value: formatPriceDzd(dashboard.revenue) }].map((stat) => <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="border border-primary/15 bg-card/70 p-4 backdrop-blur"><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{stat.label}</p><strong className="mt-2 block font-display text-2xl text-primary">{stat.value}</strong></motion.div>)}
          </div>

          <AnimatePresence mode="wait">
            {tab === "products" && (
              <motion.div key="products" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="truncate font-display text-2xl font-bold">{editing.id ? "Modifier produit" : "Ajouter produit"}</h2><button type="button" onClick={() => setEditing(blank)} className="grid h-10 w-10 place-items-center border border-primary/30"><Plus className="h-4 w-4" /></button></div>
                  <div className="mt-4 grid gap-3">
                    <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Nom" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} placeholder="Code" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" min={0} value={editing.priceValue} onChange={(e) => setEditing({ ...editing, priceValue: Number(e.target.value) })} placeholder="Prix DZD" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                      <input type="number" min={0} value={editing.stock ?? 0} onChange={(e) => { const n = Number(e.target.value); setEditing({ ...editing, stock: n, inStock: n > 0 }); }} placeholder="Quantité" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    </div>
                    <select value={editing.categoryId || editing.category} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value, category: e.target.value })} className="border border-input bg-background px-3 py-3 outline-none focus:border-primary">
                      {cats.length === 0 && <option value="">Aucune catégorie — créez-en une</option>}
                      {cats.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <label className="flex items-center gap-3 text-sm text-muted-foreground"><input type="checkbox" checked={editing.inStock} onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })} className="h-4 w-4 accent-primary" /> Disponible à la vente</label>
                    <div className="relative">
                      <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Description (ou générez-la avec l'IA)" className="min-h-28 w-full border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                      <button type="button" onClick={aiDescribe} disabled={aiLoading || !editing.name} className="absolute right-2 top-2 inline-flex items-center gap-1 border border-primary/40 bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-40">
                        <Sparkles className="h-3 w-3" /> {aiLoading ? "IA…" : "IA"}
                      </button>
                    </div>
                    <label className="border border-dashed border-primary/40 p-4 text-sm text-muted-foreground"><Upload className="mb-2 h-5 w-5 text-primary" />Uploader photos (multi)<input type="file" accept="image/*" multiple onChange={upload} className="mt-2 block w-full text-xs" /></label>
                    {(editing.images && editing.images.length > 0) && (
                      <div className="grid grid-cols-4 gap-2">
                        {editing.images.map((img, i) => (
                          <div key={`${img.slice(0, 32)}-${i}`} className="relative group border border-primary/20 bg-white">
                            <img src={img} alt={`Aperçu ${i + 1}`} className="h-20 w-full object-contain p-1" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 grid h-5 w-5 place-items-center bg-background/80 border border-primary/30 opacity-0 group-hover:opacity-100" aria-label="Supprimer image"><X className="h-3 w-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={save} disabled={!editing.name || !editing.image} className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"><Save className="h-4 w-4" /> Enregistrer</button>
                  </div>
                </div>
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="truncate font-display text-2xl font-bold">Catalogue</h2><button type="button" onClick={() => { resetManagedProducts(); setProducts(loadManagedProducts()); setMessage("Catalogue réinitialisé"); }} className="inline-flex shrink-0 items-center gap-2 text-xs text-muted-foreground underline"><RotateCcw className="h-3 w-3" /> Reset</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">{products.map((p) => { const cat = cats.find((c) => c.id === (p.categoryId || p.category)); return <article key={p.id} className="border border-primary/15 bg-background p-3"><img src={p.image} alt={p.name} className="h-32 w-full bg-foreground object-contain p-2" /><h3 className="mt-3 font-bold">{p.name}</h3><p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{cat?.title || p.categoryLabel}</p><p className="font-mono text-xs text-primary">{formatPriceDzd(p.priceValue)} {typeof p.stock === "number" && p.stock > 0 ? `· ${p.stock} en stock` : p.inStock ? "" : "· Rupture"}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => setEditing({ ...p, categoryId: p.categoryId || p.category, images: p.images && p.images.length ? p.images : (p.image ? [p.image] : []) })} className="flex-1 border border-primary/30 px-3 py-2 text-xs hover:bg-primary/10"><Plus className="inline h-3 w-3" /> Modifier</button><button type="button" onClick={() => remove(p.id)} className="border border-primary/30 px-3 py-2 hover:bg-primary/10" aria-label={`Supprimer ${p.name}`}><Trash2 className="h-4 w-4" /></button></div></article>; })}</div></div>
              </motion.div>
            )}

            {tab === "categories" && (
              <motion.div key="categories" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="truncate font-display text-2xl font-bold">{editingCat.id ? "Modifier catégorie" : "Ajouter catégorie"}</h2><button type="button" onClick={() => setEditingCat(blankCat)} className="grid h-10 w-10 place-items-center border border-primary/30"><Plus className="h-4 w-4" /></button></div>
                  <div className="mt-4 grid gap-3">
                    <input value={editingCat.title} onChange={(e) => setEditingCat({ ...editingCat, title: e.target.value })} placeholder="Titre (ex: Gaming Monitors)" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <input value={editingCat.code} onChange={(e) => setEditingCat({ ...editingCat, code: e.target.value })} placeholder="Code (01, 02, ...)" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <input value={editingCat.slug} onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })} placeholder="Slug (auto si vide)" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <textarea value={editingCat.desc} onChange={(e) => setEditingCat({ ...editingCat, desc: e.target.value })} placeholder="Description" className="min-h-24 border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <label className="border border-dashed border-primary/40 p-4 text-sm text-muted-foreground"><Upload className="mb-2 h-5 w-5 text-primary" />Image catégorie<input type="file" accept="image/*" onChange={uploadCat} className="mt-2 block w-full text-xs" /></label>
                    {editingCat.image && <img src={editingCat.image} alt="Aperçu catégorie" className="h-44 w-full object-cover" />}
                    <button type="button" onClick={saveCat} disabled={!editingCat.title} className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"><Save className="h-4 w-4" /> Enregistrer</button>
                  </div>
                </div>
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="truncate font-display text-2xl font-bold">Catégories</h2><button type="button" onClick={() => { resetManagedCategories(); setCats(loadManagedCategories()); setMessage("Catégories réinitialisées"); }} className="inline-flex shrink-0 items-center gap-2 text-xs text-muted-foreground underline"><RotateCcw className="h-3 w-3" /> Reset</button></div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                    {cats.map((c) => {
                      const count = products.filter((p) => (p.categoryId || p.category) === c.id).length;
                      return (
                        <article key={c.id} className="border border-primary/15 bg-background p-3">
                          {c.image && <img src={c.image} alt={c.title} className="h-32 w-full object-cover" />}
                          <h3 className="mt-3 font-bold">{c.title}</h3>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{c.code} · {count} produits</p>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.desc}</p>
                          <div className="mt-3 flex gap-2">
                            <button type="button" onClick={() => setEditingCat(c)} className="flex-1 border border-primary/30 px-3 py-2 text-xs hover:bg-primary/10">Modifier</button>
                            <button type="button" onClick={() => removeCat(c.id)} className="border border-primary/30 px-3 py-2 hover:bg-primary/10" aria-label={`Supprimer ${c.title}`}><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "leads" && (
              <motion.section key="leads" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 border border-primary/20 bg-card/70 p-5 backdrop-blur"><h2 className="font-display text-2xl font-bold">Commandes / leads</h2><div className="mt-4 grid gap-3">{orders.length === 0 && <p className="text-sm text-muted-foreground">Aucune commande pour l’instant.</p>}{orders.map((o) => <article key={o.id} className="border border-primary/15 bg-background p-4"><div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><div className="min-w-0"><h3 className="truncate font-bold">{o.customer_name} · {o.phone}</h3><p className="text-sm text-muted-foreground">{o.email}</p><p className="text-sm text-muted-foreground">{o.wilaya} {o.address}</p><p className="mt-2 font-mono text-xs text-primary">{formatPriceDzd(o.total_dzd)}</p></div><select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className="h-10 border border-input bg-background px-3"><option value="new">Nouveau</option><option value="confirmed">Confirmé</option><option value="processing">Traitement</option><option value="done">Terminé</option><option value="cancelled">Annulé</option></select></div><ul className="mt-3 text-sm text-muted-foreground">{o.items.map((i) => <li key={i.id}>{i.name} x{i.qty} — {formatPriceDzd(i.price)}</li>)}</ul>{o.notes && <p className="mt-3 border-l border-primary/40 pl-3 text-sm text-muted-foreground">{o.notes}</p>}</article>)}</div></motion.section>
            )}

            {tab === "settings" && (
              <motion.section key="settings" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 grid gap-6 xl:grid-cols-2"><div className="border border-primary/20 bg-card/70 p-5 backdrop-blur"><h2 className="font-display text-2xl font-bold">Sécurité</h2><div className="mt-4 grid gap-3"><input type="password" value={security.current} onChange={(e) => setSecurity({ ...security, current: e.target.value })} placeholder="Mot de passe actuel" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><input type="password" value={security.next} onChange={(e) => setSecurity({ ...security, next: e.target.value })} placeholder="Nouveau mot de passe" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><input type="password" value={security.confirm} onChange={(e) => setSecurity({ ...security, confirm: e.target.value })} placeholder="Confirmer" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><button type="button" onClick={changePassword} className="bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground">Changer le mot de passe</button></div></div><div className="border border-primary/20 bg-card/70 p-5 backdrop-blur"><h2 className="font-display text-2xl font-bold">Actions rapides</h2><div className="mt-4 grid gap-3"><button type="button" onClick={() => { resetManagedProducts(); setProducts(loadManagedProducts()); setMessage("Produits restaurés"); }} className="border border-primary/30 px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary/10">Restaurer le catalogue</button><button type="button" onClick={() => { resetManagedCategories(); setCats(loadManagedCategories()); setMessage("Catégories restaurées"); }} className="border border-primary/30 px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary/10">Restaurer les catégories</button><button type="button" onClick={logout} className="border border-primary/30 px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary/10">Déconnexion</button></div></div></motion.section>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}