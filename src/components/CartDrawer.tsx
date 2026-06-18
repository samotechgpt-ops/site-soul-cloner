import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/stores";
import { formatPriceDzd, saveLocalOrder, uid } from "@/lib/local-store";
import { WILAYAS } from "@/lib/wilayas";

export function CartDrawer() {
  const { items, isOpen, close, remove, setQty, clear, total, count } = useCart();
  const [form, setForm] = useState({ customer_name: "", phone: "", email: "", address: "", wilaya: "", notes: "" });
  const [done, setDone] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const orderTotal = total();
  const canSubmit = form.customer_name.trim().length > 1 && form.phone.trim().length > 5 && items.length > 0;
  const whatsappText = useMemo(
    () => encodeURIComponent(confirmationText || `Nouvelle commande AUDAX Gaming\n${items.map((i) => `- ${i.name} x${i.qty}`).join("\n")}\nTotal: ${formatPriceDzd(orderTotal)}\nClient: ${form.customer_name}\nTél: ${form.phone}`),
    [confirmationText, form.customer_name, form.phone, items, orderTotal],
  );

  const submit = () => {
    if (!canSubmit) return;
    const savedItems = items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty }));
    setConfirmationText(`Nouvelle commande AUDAX Gaming\n${savedItems.map((i) => `- ${i.name} x${i.qty}`).join("\n")}\nTotal: ${formatPriceDzd(orderTotal)}\nClient: ${form.customer_name}\nTél: ${form.phone}\nWilaya: ${form.wilaya}\nAdresse: ${form.address}`);
    saveLocalOrder({
      id: uid("cmd"),
      ...form,
      items: savedItems,
      total_dzd: orderTotal,
      status: "new",
      created_at: new Date().toISOString(),
    });
    clear();
    setDone(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => useCart.getState().open()}
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center border border-primary/50 bg-background/90 shadow-glow backdrop-blur clip-corner sm:bottom-5"
        aria-label="Ouvrir le panier"
      >
        <ShoppingCart className="h-5 w-5 text-primary" />
        {count() > 0 && <span className="absolute -top-2 -right-2 grid h-6 min-w-6 place-items-center bg-primary px-1 font-mono text-[10px] text-primary-foreground">{count()}</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.45 }} className="fixed inset-y-0 right-0 z-[90] w-full max-w-md overflow-y-auto border-l border-primary/25 bg-background p-5 shadow-glow">
            <div className="flex items-center justify-between border-b border-primary/20 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Commande</p>
                <h2 className="font-display text-2xl font-bold">Votre panier</h2>
              </div>
              <button type="button" onClick={close} className="grid h-10 w-10 place-items-center border border-primary/30 hover:bg-primary/10" aria-label="Fermer"><X className="h-5 w-5" /></button>
            </div>

            {done ? (
              <div className="mt-8 border border-primary/25 bg-primary/10 p-5">
                <h3 className="font-display text-xl font-bold text-primary">Commande enregistrée</h3>
                <p className="mt-2 text-sm text-muted-foreground">Elle est visible dans le panel admin. Vous pouvez aussi l’envoyer par WhatsApp.</p>
                <a href={`https://wa.me/213555000000?text=${whatsappText}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full justify-center bg-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground">Envoyer WhatsApp</a>
                <button type="button" onClick={() => { setDone(false); close(); }} className="mt-3 w-full border border-primary/30 px-4 py-3 font-mono text-xs uppercase tracking-[0.2em]">Fermer</button>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-4">
                  {items.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Votre panier est vide.</p>}
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[72px_1fr] gap-3 border border-primary/15 bg-card/60 p-3">
                      <img src={item.image} alt={item.name} className="h-20 w-20 bg-foreground object-contain p-2" />
                      <div>
                        <div className="flex justify-between gap-2"><h3 className="font-display text-sm font-bold">{item.name}</h3><button type="button" onClick={() => remove(item.id)} aria-label="Retirer"><Trash2 className="h-4 w-4 text-primary" /></button></div>
                        <p className="mt-1 font-mono text-xs text-primary">{formatPriceDzd(item.price)}</p>
                        <div className="mt-3 flex items-center gap-2"><button type="button" onClick={() => setQty(item.id, item.qty - 1)} className="grid h-8 w-8 place-items-center border border-primary/30"><Minus className="h-3 w-3" /></button><span className="w-8 text-center font-mono text-sm">{item.qty}</span><button type="button" onClick={() => setQty(item.id, item.qty + 1)} className="grid h-8 w-8 place-items-center border border-primary/30"><Plus className="h-3 w-3" /></button></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-primary/20 pt-5">
                  <div className="mb-5 flex items-center justify-between"><span className="text-sm text-muted-foreground">Total</span><strong className="font-mono text-primary">{formatPriceDzd(orderTotal)}</strong></div>
                  <div className="grid gap-3">
                    <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="Nom complet" className="border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Téléphone" className="border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" />
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email optionnel" className="border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" />
                    <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Adresse" className="border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" />
                    <select value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} className="border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary">
                      <option value="">Wilaya / zone AUDAX</option>
                      {WILAYAS.map((wilaya) => <option key={wilaya} value={wilaya}>{wilaya}</option>)}
                    </select>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Note optionnelle" className="min-h-20 border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" />
                    <button type="button" disabled={!canSubmit} onClick={submit} className="bg-primary px-4 py-4 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Valider la commande</button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}