import { createFileRoute } from "@tanstack/react-router";
import { CursorGlow } from "@/components/CursorGlow";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Stats } from "@/components/Stats";
import { Categories } from "@/components/Categories";
import { Quality } from "@/components/Quality";
import { ScrollVideo } from "@/components/ScrollVideo";
import { Products } from "@/components/Products";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AUDAX Algérie — VAR N22, T24M, XPS22F | audax-dz.tech" },
      { name: "description", content: "Commandez moniteurs gaming VAR N22, T24M et PC All-In-One AUDAX XPS22F/XPS22M en Algérie. Prix DZD, livraison 69 wilayas, paiement à la livraison." },
      { property: "og:title", content: "AUDAX Algérie — Catalogue Gaming VAR" },
      { property: "og:description", content: "Moniteurs VAR, PC All-In-One et accessoires gaming AUDAX. Livraison 69 wilayas." },
      { property: "og:url", content: "https://audax-dz.tech/" },
    ],
    links: [{ rel: "canonical", href: "https://audax-dz.tech/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="dark relative bg-background text-foreground">
      <SmoothScroll />
      <Preloader />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Categories />
        <Quality />
        <ScrollVideo />
        <Products />
        <CTA />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "AUDAX Algérie", alternateName: ["AUDAX DZ", "AUDAX Gaming Algérie", "AUDAX Technology"], url: "https://audax-dz.tech/", brand: "AUDAX", areaServed: { "@type": "Country", name: "Algeria" }, sameAs: ["https://audax-dz.tech/"] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "AUDAX Algérie", url: "https://audax-dz.tech/", potentialAction: { "@type": "SearchAction", target: "https://audax-dz.tech/commander?q={search_term_string}", "query-input": "required name=search_term_string" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Catalogue AUDAX", itemListElement: ["VAR N22", "VAR T24M", "VAR XPS22F", "VAR XPS22M", "VAR GS24PRO"].map((name, index) => ({ "@type": "ListItem", position: index + 1, name })) }) }} />

      <Footer />
      <CartDrawer />
    </div>
  );
}
