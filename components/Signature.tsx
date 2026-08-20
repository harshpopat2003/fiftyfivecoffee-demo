"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger, splitLinesIn } from "@/lib/motion";
import { signature } from "@/lib/content";

/**
 * The flavour rail runs sideways off the page's vertical scroll.
 *
 * The section pins, and the wheel drives the track's x instead of the
 * page's y — so five cards get a full screen each without the visitor
 * having to find a horizontal scrollbar or drag anything. Card scale
 * and the counter are driven off the same progress value, and below
 * `lg` it degrades to a normal snap carousel where pinning would fight
 * touch scrolling.
 */
export default function Signature() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      registerGsap();
      const title = root.current?.querySelector<HTMLElement>("[data-split]");
      if (title) splitLinesIn(title);

      if (prefersReducedMotion()) return;

      // Only pin on pointer-and-space; touch keeps the native carousel.
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          const el = track.current;
          const scope = root.current;
          if (!el || !scope) return;

          const distance = () => el.scrollWidth - window.innerWidth + 96;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 0.9,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setActive(Math.min(signature.length - 1, Math.round(self.progress * (signature.length - 1))));
              },
            },
          });

          tl.to(el, { x: () => -distance(), ease: "none" });

          // Each card lifts as it passes the middle of the screen.
          gsap.utils.toArray<HTMLElement>("[data-card]", el).forEach((card) => {
            gsap.fromTo(
              card,
              { scale: 0.9, filter: "brightness(0.65)" },
              {
                scale: 1,
                filter: "brightness(1)",
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tl,
                  start: "left 78%",
                  end: "center 52%",
                  scrub: true,
                },
              },
            );
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="signature"
      className="grain relative overflow-hidden bg-ink py-20 text-cream lg:h-svh lg:py-0"
    >
      <div className="lg:flex lg:h-full lg:flex-col">
        <div className="wrap flex shrink-0 flex-wrap items-end justify-between gap-6 lg:pt-[calc(4.5rem+3vh)]">
          <div className="max-w-2xl">
            <span className="eyebrow inline-block text-caramel!">Signature series</span>
            <h2 data-split className="gs-hide mt-4 h-section">
              Five cups that <em className="text-caramel!">define us</em>
            </h2>
          </div>

          <div className="flex items-end gap-5">
            <span className="font-display text-6xl font-extrabold leading-none text-caramel">
              {signature[active].n}
            </span>
            <span className="pb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cream/40">
              / 05 · scroll to browse
            </span>
          </div>
        </div>

        {/* Below lg this is a real horizontal scroller; above it, GSAP drives x. */}
        {/* Height-driven above lg so a short viewport never clips a card. */}
        <div className="no-scrollbar mt-10 overflow-x-auto lg:mt-8 lg:min-h-0 lg:flex-1 lg:overflow-visible">
          <div
            ref={track}
            className="flex snap-x snap-mandatory gap-6 px-[max(1.25rem,calc((100vw-1280px)/2+4rem))] pb-4 lg:h-full lg:snap-none lg:items-stretch lg:pb-0 lg:will-change-transform"
          >
            {signature.map((d) => (
              <article
                key={d.name}
                data-card
                className="flex w-[78vw] shrink-0 flex-col snap-start sm:w-[26rem] lg:h-full lg:w-[22rem]"
              >
                <div className="relative min-h-[14rem] aspect-[4/5] overflow-hidden rounded-[1.75rem] lg:aspect-auto lg:min-h-[8rem] lg:flex-1">
                  <Image
                    src={d.img}
                    alt={d.name}
                    fill
                    sizes="(max-width: 640px) 78vw, 400px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 font-display text-sm font-bold backdrop-blur">
                    {d.n}
                  </span>
                  <span className="absolute bottom-4 left-4 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-caramel">
                    {d.meta}
                  </span>
                </div>
                <h3 className="mt-5 shrink-0 text-2xl sm:text-3xl">{d.name}</h3>
                <p className="mt-2.5 shrink-0 max-w-sm text-sm leading-relaxed text-cream/60">{d.body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Progress rail, filled straight from the active index. */}
        <div className="wrap mt-6 hidden shrink-0 items-center gap-4 lg:flex lg:pb-[5vh]">
          <div className="h-px flex-1 bg-cream/15">
            <div
              className="h-px bg-caramel transition-all duration-500 ease-out"
              style={{ width: `${((active + 1) / signature.length) * 100}%` }}
            />
          </div>
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-cream/40">
            {signature[active].name}
          </span>
        </div>
      </div>
    </section>
  );
}
