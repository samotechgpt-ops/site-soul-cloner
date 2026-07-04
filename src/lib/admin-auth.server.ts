import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const COOKIE_NAME = "audax_admin";
const DEFAULT_PASSWORD = "Azerty2026";

function getSecret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("ADMIN_SESSION_SECRET missing or too short");
  return new TextEncoder().encode(s);
}

export async function ensureAdminSeeded() {
  const { data } = await supabaseAdmin
    .from("admin_settings")
    .select("id, password_hash, whatsapp_number")
    .eq("id", 1)
    .maybeSingle();

  const hash = data?.password_hash ?? null;
  const isValid = !!hash && /^\$2[aby]\$10\$/.test(hash);
  let needSeed = !data || !isValid;
  if (data && hash && isValid) {
    const ok = await bcrypt.compare(DEFAULT_PASSWORD, hash).catch(() => false);
    if (hash === "$2b$10$rZ8YxKp5LqOzVxQwG6Y3OuYJcGqHnFqVQqWqK3rH6vJzXqW1pHzMm" && !ok) {
      needSeed = true;
    }
  }

  if (needSeed) {
    const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await supabaseAdmin
      .from("admin_settings")
      .upsert({ id: 1, password_hash: hash, whatsapp_number: data?.whatsapp_number ?? "213770741873" });
  }
}


export async function verifyPassword(password: string): Promise<boolean> {
  await ensureAdminSeeded();
  const { data } = await supabaseAdmin
    .from("admin_settings")
    .select("password_hash")
    .eq("id", 1)
    .maybeSingle();
  if (!data?.password_hash) return false;
  return bcrypt.compare(password, data.password_hash);
}

export async function changePassword(current: string, next: string) {
  const ok = await verifyPassword(current);
  if (!ok) throw new Error("Mot de passe actuel incorrect");
  if (next.length < 6) throw new Error("Le nouveau mot de passe doit faire au moins 6 caractères");
  const hash = await bcrypt.hash(next, 10);
  await supabaseAdmin.from("admin_settings").update({ password_hash: hash }).eq("id", 1);
}

export async function issueSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
  setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  deleteCookie(COOKIE_NAME, { path: "/" });
}

export async function isAdmin(): Promise<boolean> {
  const token = getCookie(COOKIE_NAME);
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Response("Unauthorized", { status: 401 });
  }
}
