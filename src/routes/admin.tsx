import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type ChangeEvent } from "react";
import { Boxes, ClipboardList, LogOut, Plus, Save, Settings, ShieldCheck, Sparkles, Tag, Trash2, Upload, X } from "lucide-react";
import { generateProductDescription } from "@/lib/ai.functions";
import { adminLogin, adminLogout, adminCheck, adminChangePassword } from "@/lib/admin.functions";
import { listAdminProducts, upsertProduct, deleteProduct, type PublicProduct } from "@/lib/products.functions";
import { listCategories, upsertCategory, deleteCategory, type PublicCategory } from "@/lib/categories.functions";
import { listAdminOrders, updateOrderStatus, listAdminLeads, updateLeadStatus } from "@/lib/leads.functions";
import { formatPriceDzd } from "@/lib/local-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin AUDAX Technology — Produits et commandes" },
      { name: "description", content: "Panel admin AUDAX Technology : gérer produits VAR, catégories, photos, prix et commandes clients." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

interface ProductForm {
  id?: string;
  name_fr: string;
  price_dzd: number;
  stock: number;
  category_id: string | null;
  brand: string;
  description_fr: string;
  images: string[]; // storage paths
  imageUrls: string[]; // signed URLs for preview
  featured: boolean;
  active: boolean;
}

interface CategoryForm {
  id?: string;
  name_fr: string;
  name_ar: string;
  icon: string;
  sort_order: number;
}

const blankProduct: ProductForm = {
  name_fr: "", price_dzd: 0, stock: 0, category_id: null, brand: "VAR",
  description_fr: "", images: [], imageUrls: [], featured: false, active: true,
};
const blankCat: CategoryForm = { name_fr: "", name_ar: "", icon: "box", sort_order: 0 };

type AdminTab = "products" | "categories" | "leads" | "settings";
const tabs: Array<{ id: AdminTab; label: string; icon: typeof Boxes }> = [
  { id: "products", label: "Produits", icon: Boxes },
  { id: "categories", label: "Catégories", icon: Tag },
  { id: "leads", label: "Leads", icon: ClipboardList },
  { id: "settings", label: "Paramètres", icon: Settings },
];

function AdminPage() {
  const qc = useQueryClient();
  const callCheck = useServerFn(adminCheck);
  const callLogin = useServerFn(adminLogin);
  const callLogout = useServerFn(adminLogout);
  const callChangePwd = useServerFn(adminChangePassword);
  const callList = useServerFn(listAdminProducts);
  const callUpsert = useServerFn(upsertProduct);
  const callDelete = useServerFn(deleteProduct);
  const callListCats = useServerFn(listCategories);
  const callUpsertCat = useServerFn(upsertCategory);
  const callDeleteCat = useServerFn(deleteCategory);
  const callGenDesc = useServerFn(generateProductDescription);
  const callOrders = useServerFn(listAdminOrders);
  const callUpdateOrder = useServerFn(updateOrderStatus);
  const callLeads = useServerFn(listAdminLeads);
  const callUpdateLead = useServerFn(updateLeadStatus);

  const [tab, setTab] = useState<AdminTab>("products");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState<ProductForm>(blankProduct);
  const [editingCat, setEditingCat] = useState<CategoryForm>(blankCat);
  const [message, setMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [security, setSecurity] = useState({ current: "", next: "", confirm: "" });

  const authQuery = useQuery({ queryKey: ["admin-authed"], queryFn: () => (callCheck as any)() });
  const authed = authQuery.data?.authed === true;

  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => (callList as any)(),
    enabled: authed,
  });
  const catsQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => (callListCats as any)(),
    enabled: authed,
  });
  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => (callOrders as any)(),
    enabled: authed,
    refetchInterval: 15000,
  });
  const leadsQuery = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => (callLeads as any)(),
    enabled: authed,
    refetchInterval: 15000,
  });

  const products = (productsQuery.data ?? []) as any[];
  const cats: PublicCategory[] = (catsQuery.data ?? []);
  const orders = (ordersQuery.data ?? []) as any[];
  const leads = (leadsQuery.data ?? []) as any[];

  const dashboard = useMemo(() => ({
    products: products.length,
    leads: orders.length + leads.length,
    revenue: orders.reduce((s: number, o: any) => s + (o.total_dzd || 0), 0),
    pending: orders.filter((o: any) => o.status === "new" || o.status === "processing").length,
  }), [orders, leads, products]);

  const login = async () => {
    try {
      await callLogin({ data: { password } });
      setMessage("Connecté");
      setPassword("");
      qc.invalidateQueries({ queryKey: ["admin-authed"] });
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erreur");
    }
  };

  const logout = async () => {
    await (callLogout as any)();
    qc.invalidateQueries({ queryKey: ["admin-authed"] });
    setMessage("Déconnecté");
  };

  const uploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error || "Échec upload");
      const { paths, urls } = await res.json();
      setEditing((p) => ({
        ...p,
        images: [...p.images, ...paths].slice(0, 6),
        imageUrls: [...p.imageUrls, ...urls].slice(0, 6),
      }));
      setMessage("Images téléchargées");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erreur upload");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setEditing((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== idx),
      imageUrls: p.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  const aiDescribe = async () => {
    if (!editing.name_fr) { setMessage("Indiquez d'abord le nom"); return; }
    setAiLoading(true);
    try {
      const cat = cats.find((c) => c.id === editing.category_id);
      const result = await callGenDesc({ data: { name: editing.name_fr, category: cat?.name_fr || "Produit VAR", price: editing.price_dzd, hints: editing.description_fr } });
      setEditing((p) => ({ ...p, description_fr: result.description }));
      setMessage("Description générée");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erreur IA");
    } finally {
      setAiLoading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: () => callUpsert({
      data: {
        id: editing.id,
        name_fr: editing.name_fr,
        name_ar: "",
        description_fr: editing.description_fr,
        description_ar: "",
        price_dzd: editing.price_dzd,
        old_price_dzd: null,
        stock: editing.stock,
        category_id: editing.category_id,
        theme: "pro",
        brand: editing.brand,
        specs: {},
        images: editing.images,
        featured: editing.featured,
        active: editing.active,
      },
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["public-products"] });
      setEditing(blankProduct);
      setMessage("Produit enregistré ✓");
    },
    onError: (e) => setMessage(e instanceof Error ? e.message : "Erreur"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => callDelete({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["public-products"] });
      setMessage("Produit supprimé");
    },
  });

  const catSaveMutation = useMutation({
    mutationFn: () => callUpsertCat({
      data: {
        id: editingCat.id,
        name_fr: editingCat.name_fr,
        name_ar: editingCat.name_ar || editingCat.name_fr,
        icon: editingCat.icon || "box",
        sort_order: editingCat.sort_order,
      },
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      setEditingCat(blankCat);
      setMessage("Catégorie enregistrée ✓");
    },
    onError: (e) => setMessage(e instanceof Error ? e.message : "Erreur"),
  });

  const catDeleteMutation = useMutation({
    mutationFn: (id: string) => callDeleteCat({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const editRow = (p: any) => {
    setEditing({
      id: p.id,
      name_fr: p.name_fr || "",
      price_dzd: p.price_dzd || 0,
      stock: p.stock || 0,
      category_id: p.category_id || null,
      brand: p.brand || "VAR",
      description_fr: p.description_fr || "",
      images: p.images || [],
      imageUrls: p.images || [],
      featured: !!p.featured,
      active: p.active !== false,
    });
  };

  const setStatus = async (id: string, status: string) => {
    try {
      await callUpdateOrder({ data: { id, status } });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erreur mise à jour");
    }
  };

  const setLeadStatus = async (id: string, status: string) => {
    try {
      await callUpdateLead({ data: { id, status } });
      qc.invalidateQueries({ queryKey: ["admin-leads"] });
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erreur mise à jour");
    }
  };

  const changePassword = async () => {
    if (security.next.length < 6 || security.next !== security.confirm) {
      setMessage("Le nouveau mot de passe doit correspondre et faire ≥ 6 caractères");
      return;
    }
    try {
      await callChangePwd({ data: { current: security.current, next: security.next } });
      setSecurity({ current: "", next: "", confirm: "" });
      setMessage("Mot de passe modifié ✓");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erreur");
    }
  };

  if (!authed) {
    return (
      <main className="dark min-h-screen overflow-hidden bg-background px-6 py-24 text-foreground">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-md border border-primary/25 bg-card p-6 shadow-glow clip-corner">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">Secure access</p>
              <h1 className="font-display text-3xl font-bold">Admin AUDAX</h1>
            </div>
          </div>
          <input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }} type="password" placeholder="Mot de passe" className="mt-2 w-full border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
          <button type="button" onClick={login} className="mt-4 w-full bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground">Se connecter</button>
          <p className="mt-3 text-sm text-muted-foreground">{message || "Accès administrateur protégé"}</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="dark min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <div className="fixed inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">

        <aside className="min-w-0 w-full border border-primary/20 bg-card/70 p-4 backdrop-blur clip-corner lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-primary/15 pb-4 sm:pb-5">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">Panel admin</p>
              <h1 className="truncate font-display text-xl sm:text-2xl font-bold">AUDAX Technology</h1>
            </div>
            <button type="button" onClick={logout} className="grid h-10 w-10 shrink-0 place-items-center border border-primary/30 hover:bg-primary/10" aria-label="Déconnexion"><LogOut className="h-4 w-4" /></button>
          </div>
          <nav className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 lg:mt-5 lg:grid lg:gap-2 lg:overflow-visible lg:px-0">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`inline-flex shrink-0 items-center gap-2 border px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.2em] transition lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-3 lg:px-4 lg:py-3 lg:text-xs ${tab === item.id ? "border-primary bg-primary text-primary-foreground" : "border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <Link to="/" className="mt-4 inline-flex w-full justify-center border border-primary/40 px-4 py-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground lg:mt-5">Retour site</Link>
          {message && <p className="mt-4 border border-primary/20 bg-primary/10 p-3 text-sm text-primary">{message}</p>}
        </aside>

        <section className="min-w-0 w-full">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[{ label: "Produits", value: dashboard.products }, { label: "Catégories", value: cats.length }, { label: "Leads", value: dashboard.leads }, { label: "Total", value: formatPriceDzd(dashboard.revenue) }].map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="border border-primary/15 bg-card/70 p-4 backdrop-blur">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{stat.label}</p>
                <strong className="mt-2 block break-words font-display text-lg sm:text-2xl text-primary">{stat.value}</strong>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "products" && (
              <motion.div key="products" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <h2 className="truncate font-display text-2xl font-bold">{editing.id ? "Modifier produit" : "Ajouter produit"}</h2>
                    <button type="button" onClick={() => setEditing(blankProduct)} className="grid h-10 w-10 place-items-center border border-primary/30" aria-label="Nouveau"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-4 grid gap-4">
                    <label className="grid gap-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Nom du produit</span>
                      <input value={editing.name_fr} onChange={(e) => setEditing({ ...editing, name_fr: e.target.value })} placeholder="Ex : VAR GS24 Pro" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Marque</span>
                      <input value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} placeholder="VAR" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="grid gap-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Prix (DZD)</span>
                        <input type="number" min={0} value={editing.price_dzd} onChange={(e) => setEditing({ ...editing, price_dzd: Number(e.target.value) })} placeholder="18700" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                      </label>
                      <label className="grid gap-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Stock</span>
                        <input type="number" min={0} value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} placeholder="12" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                      </label>
                    </div>
                    <label className="grid gap-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Catégorie</span>
                      <select value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className="border border-input bg-background px-3 py-3 outline-none focus:border-primary">
                        <option value="">— Aucune —</option>
                        {cats.map((c) => <option key={c.id} value={c.id}>{c.name_fr}</option>)}
                      </select>
                    </label>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="h-4 w-4 accent-primary" /> Actif</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="h-4 w-4 accent-primary" /> Mis en avant</label>
                    </div>
                    <div className="relative">
                      <textarea value={editing.description_fr} onChange={(e) => setEditing({ ...editing, description_fr: e.target.value })} placeholder="Description (ou générez-la avec l'IA)" className="min-h-28 w-full border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                      <button type="button" onClick={aiDescribe} disabled={aiLoading || !editing.name_fr} className="absolute right-2 top-2 inline-flex items-center gap-1 border border-primary/40 bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-40">
                        <Sparkles className="h-3 w-3" /> {aiLoading ? "IA…" : "IA"}
                      </button>
                    </div>
                    <label className="border border-dashed border-primary/40 p-4 text-sm text-muted-foreground">
                      <Upload className="mb-2 h-5 w-5 text-primary" />
                      {uploading ? "Téléchargement…" : "Uploader photos (multi, max 6)"}
                      <input type="file" accept="image/*" multiple disabled={uploading} onChange={uploadFiles} className="mt-2 block w-full text-xs" />
                    </label>
                    {editing.imageUrls.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {editing.imageUrls.map((img, i) => (
                          <div key={`${img}-${i}`} className="relative group border border-primary/20 bg-white">
                            <img src={img} alt={`Aperçu ${i + 1}`} className="h-20 w-full object-contain p-1" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 grid h-5 w-5 place-items-center bg-background/80 border border-primary/30 opacity-0 group-hover:opacity-100" aria-label="Supprimer"><X className="h-3 w-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={() => saveMutation.mutate()} disabled={!editing.name_fr || editing.images.length === 0 || saveMutation.isPending} className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">
                      <Save className="h-4 w-4" /> {saveMutation.isPending ? "Enregistrement…" : "Enregistrer"}
                    </button>
                  </div>
                </div>

                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <h2 className="truncate font-display text-2xl font-bold">Catalogue ({products.length})</h2>
                  {productsQuery.isLoading && <p className="mt-4 text-sm text-muted-foreground">Chargement…</p>}
                  {productsQuery.error && <p className="mt-4 text-sm text-red-400">Erreur : {(productsQuery.error as Error).message}</p>}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                    {products.map((p) => {
                      const cat = cats.find((c) => c.id === p.category_id);
                      const img = (p.images || [])[0];
                      return (
                        <article key={p.id} className="border border-primary/15 bg-background p-3">
                          {img && <img src={img} alt={p.name_fr} className="h-32 w-full bg-white object-contain p-2" />}
                          <h3 className="mt-3 font-bold">{p.name_fr}</h3>
                          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{cat?.name_fr || "Sans catégorie"}</p>
                          <p className="font-mono text-xs text-primary">{formatPriceDzd(p.price_dzd)} · {p.stock} en stock {p.active ? "" : "· Inactif"}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description_fr}</p>
                          <div className="mt-3 flex gap-2">
                            <button type="button" onClick={() => editRow(p)} className="flex-1 border border-primary/30 px-3 py-2 text-xs hover:bg-primary/10">Modifier</button>
                            <button type="button" onClick={() => { if (confirm(`Supprimer ${p.name_fr} ?`)) deleteMutation.mutate(p.id); }} className="border border-primary/30 px-3 py-2 hover:bg-primary/10" aria-label={`Supprimer ${p.name_fr}`}><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "categories" && (
              <motion.div key="categories" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <h2 className="truncate font-display text-2xl font-bold">{editingCat.id ? "Modifier catégorie" : "Ajouter catégorie"}</h2>
                    <button type="button" onClick={() => setEditingCat(blankCat)} className="grid h-10 w-10 place-items-center border border-primary/30"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <input value={editingCat.name_fr} onChange={(e) => setEditingCat({ ...editingCat, name_fr: e.target.value })} placeholder="Nom FR (ex: Moniteurs VAR)" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <input value={editingCat.name_ar} onChange={(e) => setEditingCat({ ...editingCat, name_ar: e.target.value })} placeholder="Nom AR (اختياري)" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <input value={editingCat.icon} onChange={(e) => setEditingCat({ ...editingCat, icon: e.target.value })} placeholder="Icône (monitor, box, laptop…)" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <input type="number" value={editingCat.sort_order} onChange={(e) => setEditingCat({ ...editingCat, sort_order: Number(e.target.value) })} placeholder="Ordre (0, 10, 20…)" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <button type="button" onClick={() => catSaveMutation.mutate()} disabled={!editingCat.name_fr || catSaveMutation.isPending} className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-40"><Save className="h-4 w-4" /> Enregistrer</button>
                  </div>
                </div>
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <h2 className="truncate font-display text-2xl font-bold">Catégories ({cats.length})</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                    {cats.map((c) => (
                      <article key={c.id} className="border border-primary/15 bg-background p-3">
                        <h3 className="font-bold">{c.name_fr}</h3>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{c.icon} · #{c.sort_order}</p>
                        <p className="text-xs text-muted-foreground">{c.slug}</p>
                        <div className="mt-3 flex gap-2">
                          <button type="button" onClick={() => setEditingCat({ id: c.id, name_fr: c.name_fr, name_ar: c.name_ar, icon: c.icon || "box", sort_order: c.sort_order })} className="flex-1 border border-primary/30 px-3 py-2 text-xs hover:bg-primary/10">Modifier</button>
                          <button type="button" onClick={() => { if (confirm(`Supprimer ${c.name_fr} ?`)) catDeleteMutation.mutate(c.id); }} className="border border-primary/30 px-3 py-2 hover:bg-primary/10"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "leads" && (
              <motion.section key="leads" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 grid gap-6">
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-2xl font-bold">Commandes ({orders.length})</h2>
                    <button type="button" onClick={() => qc.invalidateQueries({ queryKey: ["admin-orders"] })} className="border border-primary/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em]">Actualiser</button>
                  </div>
                  {ordersQuery.isLoading && <p className="mt-4 text-sm text-muted-foreground">Chargement…</p>}
                  {ordersQuery.error && <p className="mt-4 text-sm text-red-400">Erreur : {(ordersQuery.error as Error).message}</p>}
                  <div className="mt-4 grid gap-3">
                    {!ordersQuery.isLoading && orders.length === 0 && <p className="text-sm text-muted-foreground">Aucune commande enregistrée.</p>}
                    {orders.map((o: any) => (
                      <article key={o.id} className="border border-primary/15 bg-background p-4">
                        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                          <div className="min-w-0">
                            <h3 className="truncate font-bold">{o.customer_name} · {o.phone}</h3>
                            <p className="text-sm text-muted-foreground">{o.email}</p>
                            <p className="text-sm text-muted-foreground">{o.wilaya} {o.address}</p>
                            <p className="mt-2 font-mono text-xs text-primary">{formatPriceDzd(o.total_dzd || 0)}</p>
                            <p className="mt-1 font-mono text-[10px] text-muted-foreground">{new Date(o.created_at).toLocaleString("fr-DZ")}</p>
                          </div>
                          <select value={o.status || "new"} onChange={(e) => setStatus(o.id, e.target.value)} className="h-10 border border-input bg-background px-3">
                            <option value="new">Nouveau</option>
                            <option value="confirmed">Confirmé</option>
                            <option value="processing">Traitement</option>
                            <option value="done">Terminé</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                        </div>
                        <ul className="mt-3 text-sm text-muted-foreground">{(o.items || []).map((i: any, idx: number) => <li key={`${i.id}-${idx}`}>{i.name} x{i.qty} — {formatPriceDzd(i.price)}</li>)}</ul>
                        {o.notes && <p className="mt-3 border-l border-primary/40 pl-3 text-sm text-muted-foreground">{o.notes}</p>}
                      </article>
                    ))}
                  </div>
                </div>

                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-2xl font-bold">Leads / contacts ({leads.length})</h2>
                    <button type="button" onClick={() => qc.invalidateQueries({ queryKey: ["admin-leads"] })} className="border border-primary/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em]">Actualiser</button>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {!leadsQuery.isLoading && leads.length === 0 && <p className="text-sm text-muted-foreground">Aucun lead enregistré.</p>}
                    {leads.map((l: any) => (
                      <article key={l.id} className="border border-primary/15 bg-background p-4">
                        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                          <div className="min-w-0">
                            <h3 className="truncate font-bold">{l.name} · {l.phone}</h3>
                            <p className="text-sm text-muted-foreground">{l.email}</p>
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{l.source} · {new Date(l.created_at).toLocaleString("fr-DZ")}</p>
                            {l.products && <p className="mt-1 text-xs text-muted-foreground">Produit : {l.products.name_fr}</p>}
                            {l.message && <p className="mt-2 text-sm text-muted-foreground">{l.message}</p>}
                          </div>
                          <select value={l.status || "new"} onChange={(e) => setLeadStatus(l.id, e.target.value)} className="h-10 border border-input bg-background px-3">
                            <option value="new">Nouveau</option>
                            <option value="contacted">Contacté</option>
                            <option value="qualified">Qualifié</option>
                            <option value="closed">Clôturé</option>
                          </select>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {tab === "settings" && (
              <motion.section key="settings" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="mt-6 grid gap-6 xl:grid-cols-2">
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <h2 className="font-display text-2xl font-bold">Sécurité</h2>
                  <div className="mt-4 grid gap-3">
                    <input type="password" value={security.current} onChange={(e) => setSecurity({ ...security, current: e.target.value })} placeholder="Mot de passe actuel" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <input type="password" value={security.next} onChange={(e) => setSecurity({ ...security, next: e.target.value })} placeholder="Nouveau mot de passe" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <input type="password" value={security.confirm} onChange={(e) => setSecurity({ ...security, confirm: e.target.value })} placeholder="Confirmer" className="border border-input bg-background px-3 py-3 outline-none focus:border-primary" />
                    <button type="button" onClick={changePassword} className="bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground">Changer le mot de passe</button>
                  </div>
                </div>
                <div className="border border-primary/20 bg-card/70 p-5 backdrop-blur">
                  <h2 className="font-display text-2xl font-bold">Actions rapides</h2>
                  <div className="mt-4 grid gap-3">
                    <button type="button" onClick={logout} className="border border-primary/30 px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary/10">Déconnexion</button>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
