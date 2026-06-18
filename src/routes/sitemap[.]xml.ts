import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://audax-dz.tech";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const paths = [
          { p: "/", pr: "1.0", cf: "daily" },
          { p: "/commander", pr: "0.9", cf: "weekly" },
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
          .map(
            ({ p, pr, cf }) =>
              `  <url><loc>${BASE}${p}</loc><lastmod>${today}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`,
          )
          .join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
