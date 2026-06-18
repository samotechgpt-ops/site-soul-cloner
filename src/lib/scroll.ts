export function scrollToSection(selector: string) {
  if (typeof window === "undefined") return;
  const target = document.querySelector(selector);
  if (!target) return;

  const scroller = (window as typeof window & { __audaxScrollTo?: (selector: string) => void }).__audaxScrollTo;
  if (scroller) {
    scroller(selector);
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  if (selector.startsWith("#")) history.pushState(null, "", selector);
}