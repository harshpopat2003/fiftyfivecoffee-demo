"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, lockScroll, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

/**
 * Brand-mark loader. A counter runs to 100, then the panel splits into
 * four columns that lift away on a stagger, handing straight over to
 * the hero's own entrance.
 *
 * It is time-boxed rather than tied to a fetch, so a slow asset can
 * never trap the page behind it — and scroll stays locked only for as
 * long as the panel is actually on screen.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const panel = root.current;
      if (!panel) return;

      if (prefersReducedMotion()) {
        gsap.set(panel, { autoAlpha: 0, display: "none" });
        return;
      }

      lockScroll(true);
      const count = panel.querySelector<HTMLElement>("[data-loader-count]")!;
      const state = { n: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(panel, { display: "none" });
          lockScroll(false);
          ScrollTrigger.refresh();
        },
      });

      tl.to(state, {
        n: 100,
        duration: 1.15,
        ease: "power2.inOut",
        onUpdate: () => {
          count.textContent = String(Math.round(state.n)).padStart(3, "0");
        },
      })
        .to("[data-loader-bar]", { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 0)
        .to("[data-loader-mark]", { yPercent: -130, autoAlpha: 0, duration: 0.55, ease: "power3.in" }, "-=0.1")
        .to("[data-loader-meta]", { autoAlpha: 0, duration: 0.3 }, "<")
        .to(
          "[data-loader-col]",
          { yPercent: -101, duration: 0.9, ease: "power4.inOut", stagger: 0.07 },
          "-=0.25",
        );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-0 z-[200]" aria-hidden>
      {/* four columns that peel away independently */}
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} data-loader-col className="h-full flex-1 bg-ink" />
        ))}
      </div>

      <div className="relative flex h-full flex-col items-center justify-center gap-8 text-cream">
        <div data-loader-mark>
          <Image
            src="/assets/logo-lockup-light.png"
            alt="55coffee"
            width={1492}
            height={972}
            priority
            className="h-24 w-auto sm:h-32"
          />
        </div>
        <div data-loader-meta className="flex flex-col items-center gap-4">
          <div className="h-px w-48 overflow-hidden bg-cream/20">
            <div data-loader-bar className="h-full origin-left scale-x-0 bg-caramel" />
          </div>
          <span
            data-loader-count
            className="font-display text-xs font-bold tracking-[0.3em] text-cream/50"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
