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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AUDAX Technology — Your Vision. Our Technology." },
      { name: "description", content: "Local leader in cutting-edge computer, office, and electrical equipment. All-in-One systems, monitors and toner cartridges engineered for performance." },
      { property: "og:title", content: "AUDAX Technology — Audacity drives innovation" },
      { property: "og:description", content: "Local leader in cutting-edge computer, office, and electrical equipment." },
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
    </div>
  );
}
