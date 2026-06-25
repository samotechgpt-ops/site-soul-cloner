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
import { Showcase } from "@/components/Showcase";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VAR Algérie — Moniteurs VAR, PC VAR & Ordinateurs | audax-dz.tech" },
      { name: "description", content: "Achetez la marque VAR en Algérie : moniteurs VAR N22 / T24M, PC de bureau VAR XPS22F / XPS22M et accessoires informatiques VAR. Prix DZD, livraison 69 wilayas, paiement à la livraison." },
      { property: "og:title", content: "VAR Algérie — Moniteurs VAR & Ordinateurs VAR" },
      { property: "og:description", content: "Distributeur officiel VAR en Algérie. Moniteurs VAR, PC VAR All-In-One et accessoires informatiques. Livraison 69 wilayas." },
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
        <Showcase />
        <ScrollVideo />
        <CTA />
      </main>
      {/* Hidden SEO content to disambiguate the brand "VAR" from football VAR / arbitrage vidéo */}
      <div className="sr-only" aria-hidden="false">
        <h2>VAR — marque d'informatique en Algérie</h2>
        <p>
          VAR est une marque de matériel informatique distribuée en Algérie par AUDAX Technology.
          La gamme VAR comprend des moniteurs (VAR N22, VAR T24M, VAR GS24), des PC de bureau
          All-In-One (VAR XPS22F, VAR XPS22M) et des accessoires (clavier VAR, souris VAR).
          Cette page concerne la marque informatique VAR — il ne s'agit pas de l'assistance vidéo
          à l'arbitrage (Video Assistant Referee) utilisée au football ni d'un jeu vidéo.
          Achetez vos produits VAR neufs en Algérie avec livraison dans les 69 wilayas et
          paiement à la livraison.
        </p>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "VAR Algérie", alternateName: ["VAR DZ", "AUDAX Technology", "Distributeur VAR Algérie"], url: "https://audax-dz.tech/", logo: "https://audax-dz.tech/favicon.ico", brand: { "@type": "Brand", name: "VAR" }, areaServed: { "@type": "Country", name: "Algeria" }, contactPoint: [{ "@type": "ContactPoint", telephone: "+213770741873", contactType: "customer service", areaServed: "DZ", availableLanguage: ["French", "Arabic"] }], sameAs: ["https://audax-dz.tech/", "https://wa.me/213770741873"] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Store", "@id": "https://audax-dz.tech/#store", name: "VAR Algérie — Boutique informatique", image: "https://audax-dz.tech/favicon.ico", telephone: "+213770741873", priceRange: "DZD", url: "https://audax-dz.tech/", address: { "@type": "PostalAddress", addressCountry: "DZ", addressRegion: "Alger" }, areaServed: { "@type": "Country", name: "Algeria" }, makesOffer: [{ "@type": "Offer", itemOffered: { "@type": "Product", name: "Moniteur VAR N22", brand: "VAR", category: "Moniteur informatique" } }, { "@type": "Offer", itemOffered: { "@type": "Product", name: "Moniteur VAR T24M", brand: "VAR", category: "Moniteur informatique" } }, { "@type": "Offer", itemOffered: { "@type": "Product", name: "PC All-In-One VAR XPS22F", brand: "VAR", category: "Ordinateur de bureau" } }, { "@type": "Offer", itemOffered: { "@type": "Product", name: "PC All-In-One VAR XPS22M", brand: "VAR", category: "Ordinateur de bureau" } }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "VAR Algérie", alternateName: "VAR DZ", url: "https://audax-dz.tech/", potentialAction: { "@type": "SearchAction", target: "https://audax-dz.tech/commander?q={search_term_string}", "query-input": "required name=search_term_string" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Catalogue VAR Algérie", itemListElement: [
        { name: "Moniteur VAR N22", category: "Moniteur" },
        { name: "Moniteur VAR T24M", category: "Moniteur" },
        { name: "PC All-In-One VAR XPS22F", category: "Ordinateur de bureau" },
        { name: "PC All-In-One VAR XPS22M", category: "Ordinateur de bureau" },
        { name: "Moniteur VAR GS24PRO", category: "Moniteur" }
      ].map((p, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": "Product", name: p.name, brand: { "@type": "Brand", name: "VAR" }, category: p.category } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
        { "@type": "Question", name: "Qu'est-ce que la marque VAR ?", acceptedAnswer: { "@type": "Answer", text: "VAR est une marque de matériel informatique : moniteurs, PC de bureau All-In-One et accessoires. Elle est distribuée en Algérie par AUDAX Technology. Il ne s'agit pas de l'assistance vidéo à l'arbitrage au football." } },
        { "@type": "Question", name: "Où acheter des produits VAR en Algérie ?", acceptedAnswer: { "@type": "Answer", text: "Sur audax-dz.tech, le distributeur officiel VAR en Algérie, avec livraison dans les 69 wilayas et paiement à la livraison." } },
        { "@type": "Question", name: "Quels produits VAR sont disponibles ?", acceptedAnswer: { "@type": "Answer", text: "Les moniteurs VAR N22, VAR T24M, VAR GS24PRO et les PC All-In-One VAR XPS22F / XPS22M, ainsi que des accessoires informatiques de la marque VAR." } },
        { "@type": "Question", name: "Comment commander un produit VAR ?", acceptedAnswer: { "@type": "Answer", text: "Via le site audax-dz.tech ou WhatsApp au +213 770 74 18 73. Paiement à la livraison dans toute l'Algérie." } }
      ] }) }} />

      <Footer />
      <CartDrawer />
    </div>
  );
}
