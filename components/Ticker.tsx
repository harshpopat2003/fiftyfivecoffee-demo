"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap, scrollState } from "@/lib/motion";
import { tickerItems } from "@/lib/content";

/**
 * Marquee strip that answers to the scroll wheel.
 *
 * It always drifts, but scroll velocity feeds its timeScale and a small
 * skew, and the sign of the scroll direction flips it — so shoving the
 * page down visibly throws the strip, and it settles back to its idle
 * drift when you stop. That reactivity is the point; a constant loop
 * reads as decoration, this reads as physics.
 */
export default function Ticker() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (prefersReducedMotion()) return;

      const tracks = gsap.utils.toArray<HTMLElement>("[data-track]", root.current!);
      const loop = gsap.to(tracks, { xPercent: -100, duration: 30, ease: "none", repeat: -1 });

      const skew = gsap.quickTo(tracks, "skewX", { duration: 0.5, ease: "power3.out" });
      let current = 1;

      const tick = () => {
        // Velocity is px/frame from Lenis; clamp so a trackpad fling
        // stretches the strip without tearing it apart.
        const v = gsap.utils.clamp(-28, 28, scrollState.velocity);
        const target = scrollState.direction * gsap.utils.clamp(1, 7, 1 + Math.abs(v) * 0.22);
        current += (target - current) * 0.08;
        loop.timeScale(current);
        skew(gsap.utils.clamp(-7, 7, -v * 0.28));
      };

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        loop.kill();
      };
    },
    { scope: root },
  );

  const run = (key: string) => (
    <div
      key={key}
      data-track
      aria-hidden={key !== "a"}
      className="flex shrink-0 items-center gap-8 whitespace-nowrap px-4 text-[0.7rem] font-semibold uppercase tracking-[0.28em]"
    >
      {tickerItems.map((item) => (
        <span key={item} className="flex items-center gap-8">
          {item}
          <span className="text-caramel">◆</span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className="relative z-[60] flex overflow-hidden bg-ink py-2.5 text-cream">
      {run("a")}
      {run("b")}
    </div>
  );
}
