"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap, revealOnScroll, splitLinesIn } from "@/lib/motion";
import { compareRows } from "@/lib/content";

function Tick() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M5 12.5l4.5 4.5L19 7" data-tick-path pathLength={1} />
    </svg>
  );
}

function Cross() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="size-5">
      <path d="M7 7l10 10M17 7L7 17" />
    </svg>
  );
}

/**
 * The table builds itself under the scrollbar.
 *
 * Rows wipe in from the left on scrub rather than fading in on a
 * trigger, a caramel column sweeps down behind the 55coffee side, and
 * each tick draws its stroke as its row lands. Reversing the wheel
 * un-builds it, which is the tell that it is genuinely scroll-linked.
 */
export default function Compare() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const title = root.current?.querySelector<HTMLElement>("[data-split]");
      if (title) splitLinesIn(title);
      revealOnScroll(root.current!);

      if (prefersReducedMotion()) return;

      const table = root.current!.querySelector<HTMLElement>("[data-table]")!;
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", table);

      const tl = gsap.timeline({
        scrollTrigger: { trigger: table, start: "top 80%", end: "bottom 75%", scrub: 0.7 },
      });

      // The highlight column drops first so rows land into it.
      tl.fromTo("[data-column]", { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0);

      rows.forEach((row, i) => {
        tl.fromTo(
          row,
          { clipPath: "inset(0% 100% 0% 0%)", autoAlpha: 0.15 },
          { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, ease: "power2.out" },
          i * 0.6,
        );
        tl.fromTo(
          row.querySelector("[data-tick-path]"),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: "power2.out" },
          i * 0.6 + 0.25,
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="compare" className="bg-cream py-20 sm:py-28">
      <div className="wrap">
        <div className="max-w-2xl">
          <span data-reveal className="eyebrow inline-block">
            The difference
          </span>
          <h2 data-split className="gs-hide mt-4 h-section">
            55 vs. the <em>usual cup</em>
          </h2>
        </div>

        <div data-table className="relative mt-14 overflow-hidden rounded-3xl border border-ink/10">
          {/* the sweeping highlight behind the 55coffee column */}
          <div
            data-column
            aria-hidden
            className="absolute right-[5.5rem] top-0 z-0 h-full w-[5.5rem] origin-top bg-caramel/12 sm:right-[8rem] sm:w-[8rem]"
          />

          <div className="relative z-10 grid grid-cols-[1fr_5.5rem_5.5rem] items-center gap-2 bg-ink px-5 py-4 text-cream sm:grid-cols-[1fr_8rem_8rem] sm:px-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">Standard</span>
            <span className="text-center font-display text-sm font-bold sm:text-base">55coffee</span>
            <span className="text-center text-xs font-medium text-cream/50 sm:text-sm">Ordinary chain</span>
          </div>

          {compareRows.map((row) => (
            <div
              key={row}
              data-row
              className="relative z-10 grid grid-cols-[1fr_5.5rem_5.5rem] items-center gap-2 border-t border-ink/8 px-5 py-4 sm:grid-cols-[1fr_8rem_8rem] sm:px-8"
            >
              <span className="text-sm font-medium sm:text-base">{row}</span>
              <span className="flex justify-center text-clay">
                <Tick />
              </span>
              <span className="flex justify-center text-ink/20">
                <Cross />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
