import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __audaxScrollTo?: (selector: string) => void;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    window.__audaxScrollTo = (selector: string) => {
      const el = document.querySelector(selector);
      if (!el) return;
      lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.1 });
      if (selector.startsWith("#")) history.pushState(null, "", selector);
    };

    // Intercept in-page anchor clicks so Lenis handles them
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/" || !url.hash) return;
      if (window.location.pathname !== "/") return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.4 });
      history.pushState(null, "", `/${url.hash}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      delete window.__audaxScrollTo;
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
