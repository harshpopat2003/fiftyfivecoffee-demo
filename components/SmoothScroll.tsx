"use client";

import { useEffect } from "react";
import { destroyLenis, initLenis, registerGsap, ScrollTrigger, scrollTo } from "@/lib/motion";

/**
 * Owns the single Lenis instance for the page and hands anchor links
 * over to it, so in-page navigation eases with the same physics as the
 * wheel instead of snapping past every pinned section.
 */
export default function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    initLenis();

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href === "#" || !document.querySelector(href)) return;
      e.preventDefault();
      scrollTo(href);
    };

    document.addEventListener("click", onClick);

    // Late-loading images change every pinned section's end point.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 1200);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      destroyLenis();
    };
  }, []);

  return null;
}
