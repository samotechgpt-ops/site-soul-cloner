import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const createLead = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        name: z.string().trim().min(2).max(100),
        phone: z.string().trim().min(6).max(20),
        email: z.string().email().max(150).optional().or(z.literal("")).transform((v) => v || null),
        message: z.string().max(2000).optional(),
        source: z.string().max(50).optional().default("contact"),
        product_id: z.string().uuid().optional().nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        customer_name: z.string().trim().min(2).max(100),
        phone: z.string().trim().min(6).max(20),
        email: z.string().email().optional().or(z.literal("")).transform((v) => v || null),
        address: z.string().max(300).optional(),
        wilaya: z.string().max(80).optional(),
        items: z.array(z.object({ id: z.string(), name: z.string(), price: z.number(), qty: z.number().int().min(1) })).min(1),
        total_dzd: z.number().min(0),
        notes: z.string().max(1000).optional(),
        whatsapp_sent: z.boolean().default(false),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAdminLeads = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("@/lib/admin-auth.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("leads").select("*, products(name_fr, slug)").order("created_at", { ascending: false }).limit(500);
  return data ?? [];
});

export const listAdminOrders = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("@/lib/admin-auth.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
  return data ?? [];
});

export const updateLeadStatus = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid(), status: z.string().max(30) }).parse(input))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("leads").update({ status: data.status }).eq("id", data.id);
    return { ok: true };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid(), status: z.string().max(30) }).parse(input))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
    return { ok: true };
  });

export const adminStats = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("@/lib/admin-auth.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ count: leads }, { count: orders }, { count: products }, { count: newLeads }] = await Promise.all([
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);
  return { leads: leads ?? 0, orders: orders ?? 0, products: products ?? 0, newLeads: newLeads ?? 0 };
});
