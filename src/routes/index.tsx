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
      { title: "AUDAX Gaming Algérie — VAR N22, T24M, XPS22F" },
      { name: "description", content: "Commandez les moniteurs VAR N22, T24M et PC All-In-One AUDAX Gaming XPS22F/XPS22M en Algérie. Catalogue, prix et panier." },
      { property: "og:title", content: "AUDAX Gaming Algérie — Produits VAR" },
      { property: "og:description", content: "Moniteurs VAR, PC All-In-One, prix en DZD et commande rapide AUDAX Gaming." },
    ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "AUDAX Gaming", url: "https://audax-tech.com/", brand: "AUDAX", areaServed: "DZ", sameAs: ["https://audax-tech.com/"] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Catalogue AUDAX Gaming", itemListElement: ["VAR N22", "VAR T24M", "VAR XPS22F", "VAR XPS22M", "VAR GS24PRO"].map((name, index) => ({ "@type": "ListItem", position: index + 1, name })) }) }} />
      <Footer />
      <CartDrawer />
    </div>
  );
}
