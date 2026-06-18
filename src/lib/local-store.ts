import { products, categories as defaultCategories, type Product, type Category } from "./data";

export const PRODUCTS_CHANGED_EVENT = "audax-products-changed";
export const ORDERS_CHANGED_EVENT = "audax-orders-changed";
export const CATEGORIES_CHANGED_EVENT = "audax-categories-changed";

const PRODUCTS_KEY = "audax-admin-products";
const ORDERS_KEY = "audax-local-orders";
const CATEGORIES_KEY = "audax-admin-categories";
const ADMIN_PASSWORD_KEY = "audax-admin-password";
export const DEFAULT_ADMIN_PASSWORD = "Azerty2026";

export type OrderStatus = "new" | "confirmed" | "processing" | "done" | "cancelled";

export interface LocalOrder {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  address?: string;
  wilaya?: string;
  notes?: string;
  items: Array<{ id: string; name: string; price: number; qty: number }>;
  total_dzd: number;
  status: OrderStatus;
  created_at: string;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function formatPriceDzd(value: number) {
  if (!value) return "Sur devis";
  return `${new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(value)} د.ج`;
}

export function loadManagedProducts(): Product[] {
  if (!isBrowser()) return products;
  const saved = safeParse<Product[]>(window.localStorage.getItem(PRODUCTS_KEY), []);
  return saved.length ? saved : products;
}

export function saveManagedProducts(next: Product[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(PRODUCTS_CHANGED_EVENT));
}

export function resetManagedProducts() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(PRODUCTS_KEY);
  window.dispatchEvent(new Event(PRODUCTS_CHANGED_EVENT));
}

export function loadManagedCategories(): Category[] {
  if (!isBrowser()) return defaultCategories;
  const saved = safeParse<Category[]>(window.localStorage.getItem(CATEGORIES_KEY), []);
  return saved.length ? saved : defaultCategories;
}

export function saveManagedCategories(next: Category[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CATEGORIES_CHANGED_EVENT));
}

export function resetManagedCategories() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CATEGORIES_KEY);
  window.dispatchEvent(new Event(CATEGORIES_CHANGED_EVENT));
}


export function loadLocalOrders(): LocalOrder[] {
  if (!isBrowser()) return [];
  return safeParse<LocalOrder[]>(window.localStorage.getItem(ORDERS_KEY), []);
}

export function saveLocalOrder(order: LocalOrder) {
  if (!isBrowser()) return;
  const next = [order, ...loadLocalOrders()];
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(ORDERS_CHANGED_EVENT));
}

export function updateLocalOrderStatus(id: string, status: OrderStatus) {
  if (!isBrowser()) return;
  const next = loadLocalOrders().map((order) => (order.id === id ? { ...order, status } : order));
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(ORDERS_CHANGED_EVENT));
}

export function getAdminPassword() {
  if (!isBrowser()) return DEFAULT_ADMIN_PASSWORD;
  return window.localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
}

export function setAdminPassword(nextPassword: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ADMIN_PASSWORD_KEY, nextPassword);
}

export function uid(prefix = "audax") {
  if (isBrowser() && "crypto" in window && "randomUUID" in window.crypto) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}