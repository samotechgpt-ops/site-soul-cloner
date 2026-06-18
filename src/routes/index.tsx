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
import { Products } from "@/components/Products";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AUDAX Gaming — High-Performance Gear for Gamers" },
      { name: "description", content: "AUDAX Gaming — équipement gaming haute performance : All-In-One, moniteurs, cartouches toner et accessoires bureautiques. Audacity drives innovation." },
      { property: "og:title", content: "AUDAX Gaming — Audacity drives innovation" },
      { property: "og:description", content: "Équipement gaming haute performance : All-In-One, moniteurs, accessoires." },
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
        <Products />
        <CTA />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
