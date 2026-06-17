import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BUCKET = "product-images";
const SIGNED_EXPIRY = 60 * 60 * 24 * 365; // 1 year

export async function uploadProductImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!allowed.includes(ext)) throw new Error("Format image non supporté");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image trop volumineuse (max 5MB)");

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const buf = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buf, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return path;
}

export async function getSignedUrl(path: string): Promise<string> {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, SIGNED_EXPIRY);
  return data?.signedUrl ?? "";
}

export async function signImageArray(paths: string[] | null | undefined): Promise<string[]> {
  if (!paths || paths.length === 0) return [];
  return Promise.all(paths.map(getSignedUrl));
}

export async function deleteProductImage(path: string) {
  if (!path || path.startsWith("http")) return;
  await supabaseAdmin.storage.from(BUCKET).remove([path]);
}
