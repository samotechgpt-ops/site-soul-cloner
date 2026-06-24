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
        <Products />
        <Stats />
        <Categories />
        <Quality />
        <ScrollVideo />
        <CTA />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "AUDAX Algérie", alternateName: ["AUDAX DZ", "AUDAX Gaming Algérie", "AUDAX Technology", "Audax Tech"], url: "https://audax-dz.tech/", logo: "https://audax-dz.tech/favicon.ico", brand: "AUDAX", areaServed: { "@type": "Country", name: "Algeria" }, contactPoint: [{ "@type": "ContactPoint", telephone: "+213770741873", contactType: "customer service", areaServed: "DZ", availableLanguage: ["French", "Arabic"] }], sameAs: ["https://audax-dz.tech/", "https://wa.me/213770741873"] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", "@id": "https://audax-dz.tech/#business", name: "AUDAX Algérie", image: "https://audax-dz.tech/favicon.ico", telephone: "+213770741873", priceRange: "DZD", url: "https://audax-dz.tech/", address: { "@type": "PostalAddress", addressCountry: "DZ", addressRegion: "Alger" }, areaServed: { "@type": "Country", name: "Algeria" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "AUDAX Algérie", url: "https://audax-dz.tech/", potentialAction: { "@type": "SearchAction", target: "https://audax-dz.tech/commander?q={search_term_string}", "query-input": "required name=search_term_string" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Catalogue AUDAX", itemListElement: ["VAR N22", "VAR T24M", "VAR XPS22F", "VAR XPS22M", "VAR GS24PRO"].map((name, index) => ({ "@type": "ListItem", position: index + 1, name })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
        { "@type": "Question", name: "Où acheter du matériel gaming AUDAX en Algérie ?", acceptedAnswer: { "@type": "Answer", text: "Sur audax-dz.tech avec livraison dans les 69 wilayas et paiement à la livraison." } },
        { "@type": "Question", name: "Quels produits AUDAX sont disponibles ?", acceptedAnswer: { "@type": "Answer", text: "Moniteurs gaming VAR N22, VAR T24M, GS24PRO et PC All-In-One VAR XPS22F / XPS22M." } },
        { "@type": "Question", name: "Comment commander rapidement ?", acceptedAnswer: { "@type": "Answer", text: "Via le site audax-dz.tech ou WhatsApp au +213 770 74 18 73." } }
      ] }) }} />

      <Footer />
      <CartDrawer />
    </div>
  );
}
