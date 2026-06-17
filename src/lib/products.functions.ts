import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import slugify from "slugify";

export interface PublicProduct {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string | null;
  description_fr: string | null;
  description_ar: string | null;
  price_dzd: number;
  old_price_dzd: number | null;
  stock: number;
  category_id: string | null;
  category_slug: string | null;
  category_name_fr: string | null;
  category_name_ar: string | null;
  theme: string | null;
  brand: string | null;
  specs: Record<string, string>;
  images: string[];
  featured: boolean;
}


async function withSignedImages<T extends { images: string[] | null }>(rows: T[]): Promise<(T & { images: string[] })[]> {
  const { signImageArray } = await import("@/lib/storage.server");
  return Promise.all(
    rows.map(async (r) => ({ ...r, images: await signImageArray(r.images) })),
  );
}

export const listPublicProducts = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z
      .object({
        categorySlug: z.string().optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().int().min(1).max(100).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("products")
      .select("id, slug, name_fr, name_ar, description_fr, description_ar, price_dzd, old_price_dzd, stock, category_id, theme, brand, specs, images, featured, categories(slug, name_fr, name_ar)")
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (data.featured) q = q.eq("featured", true);
    if (data.categorySlug) {
      const { data: cat } = await supabaseAdmin.from("categories").select("id").eq("slug", data.categorySlug).maybeSingle();
      if (cat) q = q.eq("category_id", cat.id);
    }
    if (data.search && data.search.trim()) {
      const s = data.search.trim();
      q = q.or(`name_fr.ilike.%${s}%,name_ar.ilike.%${s}%,brand.ilike.%${s}%,description_fr.ilike.%${s}%`);
    }
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const mapped = (rows ?? []).map((r: any) => ({
      ...r,
      category_slug: r.categories?.slug ?? null,
      category_name_fr: r.categories?.name_fr ?? null,
      category_name_ar: r.categories?.name_ar ?? null,
      categories: undefined,
    }));
    return withSignedImages(mapped as any) as Promise<PublicProduct[]>;
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .select("id, slug, name_fr, name_ar, description_fr, description_ar, price_dzd, old_price_dzd, stock, category_id, theme, brand, specs, images, featured, categories(slug, name_fr, name_ar)")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const mapped: any = { ...row, category_slug: (row as any).categories?.slug, category_name_fr: (row as any).categories?.name_fr, category_name_ar: (row as any).categories?.name_ar, categories: undefined };
    const [signed] = await withSignedImages([mapped]);
    return signed as PublicProduct;
  });

const productInputSchema = z.object({
  id: z.string().uuid().optional(),
  name_fr: z.string().min(2).max(200),
  name_ar: z.string().max(200).optional().default(""),
  description_fr: z.string().max(5000).optional().default(""),
  description_ar: z.string().max(5000).optional().default(""),
  price_dzd: z.number().min(0),
  old_price_dzd: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0).default(0),
  category_id: z.string().uuid().optional().nullable(),
  theme: z.string().default("pro"),
  brand: z.string().optional().default(""),
  specs: z.record(z.string(), z.any()).optional().default({}),
  images: z.array(z.string()).max(6).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const listAdminProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("@/lib/admin-auth.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, categories(slug, name_fr)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return withSignedImages((data ?? []) as any[]);
});

export const upsertProduct = createServerFn({ method: "POST" })
  .inputValidator((input) => productInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const baseSlug = slugify(data.name_fr, { lower: true, strict: true }) || `produit-${Date.now()}`;
    if (data.id) {
      const { id, ...rest } = data;
      const { error } = await supabaseAdmin.from("products").update(rest as any).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    let slug = baseSlug;
    let i = 1;
    while (true) {
      const { data: ex } = await supabaseAdmin.from("products").select("id").eq("slug", slug).maybeSingle();
      if (!ex) break;
      slug = `${baseSlug}-${i++}`;
    }
    const { id: _ignored, ...rest } = data;
    const { data: ins, error } = await supabaseAdmin.from("products").insert({ ...rest, slug } as any).select("id").single();
    if (error) throw new Error(error.message);
    return { id: ins.id };
  });


export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Optional: cleanup images from storage
    const { data: prod } = await supabaseAdmin.from("products").select("images").eq("id", data.id).maybeSingle();
    if (prod?.images?.length) {
      await supabaseAdmin.storage.from("product-images").remove(prod.images);
    }
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
