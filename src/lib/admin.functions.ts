import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ password: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { verifyPassword, issueSession } = await import("@/lib/admin-auth.server");
    const ok = await verifyPassword(data.password);
    if (!ok) {
      // small delay to slow brute force
      await new Promise((r) => setTimeout(r, 500));
      throw new Error("Mot de passe incorrect");
    }
    await issueSession();
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { clearSession } = await import("@/lib/admin-auth.server");
  await clearSession();
  return { ok: true };
});

export const adminCheck = createServerFn({ method: "GET" }).handler(async () => {
  const { isAdmin } = await import("@/lib/admin-auth.server");
  return { authed: await isAdmin() };
});

export const adminChangePassword = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ current: z.string(), next: z.string().min(6) }).parse(input))
  .handler(async ({ data }) => {
    const { requireAdmin, changePassword } = await import("@/lib/admin-auth.server");
    await requireAdmin();
    await changePassword(data.current, data.next);
    return { ok: true };
  });

export const adminGetSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("@/lib/admin-auth.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("admin_settings").select("whatsapp_number").eq("id", 1).maybeSingle();
  return { whatsapp_number: data?.whatsapp_number ?? "" };
});

export const adminUpdateWhatsapp = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ whatsapp_number: z.string().min(6).max(20) }).parse(input))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("admin_settings").update({ whatsapp_number: data.whatsapp_number }).eq("id", 1);
    return { ok: true };
  });

export const getPublicWhatsapp = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("admin_settings").select("whatsapp_number").eq("id", 1).maybeSingle();
  return { whatsapp_number: data?.whatsapp_number ?? "213770741873" };
});
