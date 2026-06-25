import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const generateProductDescription = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        name: z.string().min(1).max(200),
        category: z.string().max(200).optional().default(""),
        price: z.number().optional().default(0),
        hints: z.string().max(500).optional().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing — activez Lovable Cloud / AI.");

    const prompt = `Tu es copywriter e-commerce pour AUDAX Technology, distributeur algérien de matériel informatique VAR.
Écris UNE description produit en français, 2 à 3 phrases (max 60 mots), ton premium professionnel et vente informatique, sans emojis, sans listes, sans guillemets autour du texte.
Mets en avant performance, fiabilité et l'usage concret. Évite le prix sauf si pertinent.

Produit : ${data.name}
Catégorie : ${data.category || "Non précisée"}
Prix indicatif (DZD) : ${data.price || "non communiqué"}
Notes additionnelles : ${data.hints || "aucune"}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Tu rédiges des descriptions e-commerce courtes et percutantes." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`AI gateway error ${res.status}: ${txt.slice(0, 200)}`);
    }
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = json.choices?.[0]?.message?.content?.trim() || "";
    return { description: text };
  });
