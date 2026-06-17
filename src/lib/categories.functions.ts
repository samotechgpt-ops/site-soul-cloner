import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import slugify from "slugify";

export interface PublicCategory {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  icon: string | null;
  sort_order: number;
}

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("id, slug, name_fr, name_ar, icon, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as PublicCategory[];
});

const catSchema = z.object({
  id: z.string().uuid().optional(),
  name_fr: z.string().min(1).max(100),
  name_ar: z.string().min(1).max(100),
  icon: z.string().max(50).optional().default("box"),
  sort_order: z.number().int().default(0),
});

export const upsertCategory = createServerFn({ method: "POST" })
  .inputValidator((input) => catSchema.parse(input))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const slug = slugify(data.name_fr, { lower: true, strict: true });
    if (data.id) {
      const { id, ...rest } = data;
      await supabaseAdmin.from("categories").update(rest).eq("id", id);
      return { id };
    }
    const { data: ins, error } = await supabaseAdmin.from("categories").insert({ ...data, slug }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: ins.id };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
