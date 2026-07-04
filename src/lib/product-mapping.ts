import type { Product } from "@/lib/data";
import type { PublicProduct } from "@/lib/products.functions";
import { formatPriceDzd } from "@/lib/local-store";

export function mapPublicProduct(p: PublicProduct): Product {
  const image = p.images?.[0] || "";
  const code = typeof p.specs?.code === "string" && p.specs.code.trim()
    ? p.specs.code.trim()
    : (p.slug || "").slice(0, 10).toUpperCase() || "VAR";
  return {
    id: p.id,
    name: p.name_fr,
    category: p.category_slug ?? "misc",
    categoryLabel: p.category_name_fr ?? "Produit VAR",
    categoryId: p.category_id ?? undefined,
    price: p.price_dzd ? formatPriceDzd(p.price_dzd) : "Sur devis",
    priceValue: p.price_dzd || 0,
    inStock: (p.stock ?? 0) > 0,
    stock: p.stock ?? 0,
    image,
    images: p.images ?? [],
    code,
    description: p.description_fr ?? "",
  };
}
