import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { type Product } from "@/lib/data";
import { formatPriceDzd, loadLocalOrders, loadManagedProducts, resetManagedProducts, saveManagedProducts, updateLocalOrderStatus, uid, type LocalOrder, type OrderStatus } from "@/lib/local-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin AUDAX Gaming — Produits et commandes" },
      { name: "description", content: "Panel admin AUDAX Gaming pour gérer les produits, photos, prix et commandes clients." },
      { property: "og:title", content: "Admin AUDAX Gaming" },
      { property: "og:description", content: "Gestion produits et commandes AUDAX Gaming." },
    ],
  }),
  component: AdminPage,
});

const blank: Product = { id: "", name: "", category: "monitor", categoryLabel: "Monitor", price: "Sur devis", priceValue: 0, inStock: true, image: "", code: "", description: "" };

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [editing, setEditing] = useState<Product>(blank);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAuthed(window.localStorage.getItem("audax-admin-ok") === "1");
    setProducts(loadManagedProducts());
    setOrders(loadLocalOrders());
  }, []);

  const login = () => {
    if (password === "Azerty2026") {
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

  if (!authed) {
    return <main className="dark min-h-screen bg-background px-6 py-24 text-foreground"><div className="mx-auto max-w-md border border-primary/25 bg-card p-6"><h1 className="font-display text-3xl font-bold">Admin AUDAX</h1><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mot de passe" className="mt-6 w-full border border-input bg-background px-3 py-3 outline-none focus:border-primary" /><button onClick={login} className="mt-4 w-full bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground">Se connecter</button><p className="mt-3 text-sm text-muted-foreground">{message}</p></div></main>;
  }

  return (
    <main className="dark min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-[1400px]"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">Panel admin</p><h1 className="font-display text-4xl font-bold">Produits & commandes</h1></div><Link to="/" className="border border-primary/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.2em]">Retour site</Link></div>{message && <p className="mt-4 text-sm text-primary">{message}</p>}
        <section className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]"><div className="border border-primary/20 bg-card p-5"><h2 className="font-display text-2xl font-bold">Produit</h2><div className="mt-4 grid gap-3"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Nom" className="border border-input bg-background px-3 py-3" /><input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} placeholder="Code" className="border border-input bg-background px-3 py-3" /><input type="number" value={editing.priceValue} onChange={(e) => setEditing({ ...editing, priceValue: Number(e.target.value) })} placeholder="Prix DZD" className="border border-input bg-background px-3 py-3" /><select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as Product["category"] })} className="border border-input bg-background px-3 py-3"><option value="monitor">Monitor</option><option value="allinone">All In One</option></select><textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Description" className="min-h-24 border border-input bg-background px-3 py-3" /><label className="border border-dashed border-primary/40 p-4 text-sm text-muted-foreground">Uploader photo<input type="file" accept="image/*" onChange={upload} className="mt-2 block w-full text-xs" /></label>{editing.image && <img src={editing.image} alt="Aperçu" className="h-40 w-full bg-foreground object-contain p-3" />}<button onClick={save} disabled={!editing.name || !editing.image} className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-40"><Save className="h-4 w-4" /> Enregistrer</button></div></div>
          <div className="border border-primary/20 bg-card p-5"><div className="flex justify-between gap-3"><h2 className="font-display text-2xl font-bold">Catalogue</h2><button onClick={() => { resetManagedProducts(); setProducts(loadManagedProducts()); }} className="text-xs text-muted-foreground underline">Réinitialiser</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{products.map((p) => <article key={p.id} className="border border-primary/15 bg-background p-3"><img src={p.image} alt={p.name} className="h-32 w-full bg-foreground object-contain p-2" /><h3 className="mt-3 font-bold">{p.name}</h3><p className="font-mono text-xs text-primary">{formatPriceDzd(p.priceValue)}</p><div className="mt-3 flex gap-2"><button onClick={() => setEditing(p)} className="flex-1 border border-primary/30 px-3 py-2 text-xs"><Plus className="inline h-3 w-3" /> Modifier</button><button onClick={() => remove(p.id)} className="border border-primary/30 px-3 py-2"><Trash2 className="h-4 w-4" /></button></div></article>)}</div></div></section>
        <section className="mt-8 border border-primary/20 bg-card p-5"><h2 className="font-display text-2xl font-bold">Commandes / leads</h2><div className="mt-4 grid gap-3">{orders.length === 0 && <p className="text-sm text-muted-foreground">Aucune commande pour l’instant.</p>}{orders.map((o) => <article key={o.id} className="border border-primary/15 bg-background p-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-bold">{o.customer_name} · {o.phone}</h3><p className="text-sm text-muted-foreground">{o.wilaya} {o.address}</p><p className="mt-2 font-mono text-xs text-primary">{formatPriceDzd(o.total_dzd)}</p></div><select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className="h-10 border border-input bg-background px-3"><option value="new">Nouveau</option><option value="confirmed">Confirmé</option><option value="processing">Traitement</option><option value="done">Terminé</option><option value="cancelled">Annulé</option></select></div><ul className="mt-3 text-sm text-muted-foreground">{o.items.map((i) => <li key={i.id}>{i.name} x{i.qty}</li>)}</ul></article>)}</div></section>
      </div>
    </main>
  );
}