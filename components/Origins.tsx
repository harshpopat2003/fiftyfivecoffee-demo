"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, maskWipe, prefersReducedMotion, registerGsap, revealOnScroll, splitLinesIn } from "@/lib/motion";
import { origins } from "@/lib/content";

/**
 * Four columns travelling at four different speeds.
 *
 * Alternate columns are pushed up and down against the page as it
 * scrolls, so the grid shears instead of sliding as one block. Each
 * frame also wipes open from the bottom the first time it enters —
 * the two effects together read as a camera move over a contact sheet.
 */
export default function Origins() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const title = root.current?.querySelector<HTMLElement>("[data-split]");
      if (title) splitLinesIn(title);
      revealOnScroll(root.current!);

      const cols = gsap.utils.toArray<HTMLElement>("[data-col]", root.current!);
      cols.forEach((col) => {
        maskWipe(col.querySelector<HTMLElement>("[data-frame]")!);
        if (prefersReducedMotion()) return;

        const drift = Number(col.dataset.drift ?? 0);
        gsap.fromTo(
          col,
          { y: drift },
          {
            y: -drift,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" className="overflow-hidden bg-cream py-20 sm:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <span data-reveal className="eyebrow inline-block">
              Traceable origins
            </span>
            <h2 data-split className="gs-hide mt-4 h-section">
              We know <em>whose farm</em> it came from
            </h2>
          </div>
          <p data-reveal className="max-w-xs text-sm leading-relaxed text-ink/60">
            Farm, lot, processing method and harvest year — on the sack, and on the record.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {origins.map((o, i) => (
            <figure
              key={o.caption}
              data-col
              data-drift={[64, -34, 46, -20][i % 4]}
              className={i % 2 === 1 ? "lg:mt-16" : undefined}
            >
              <div data-frame className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={o.img}
                  alt={o.caption}
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em]">
                  {o.meta}
                </span>
              </div>
              <figcaption className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink/55">
                {o.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
