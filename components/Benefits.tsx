"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, revealOnScroll, splitLinesIn, stickyStack } from "@/lib/motion";
import { benefits } from "@/lib/content";

const icons: Record<string, React.ReactNode> = {
  bean: (
    <>
      <ellipse cx="20" cy="20" rx="9" ry="13" transform="rotate(35 20 20)" />
      <path d="M13.5 26.5C17.5 22.5 22.5 17.5 26.5 13.5" />
    </>
  ),
  roaster: (
    <>
      <path d="M8 31h24" />
      <path d="M12.5 31V17a7.5 7.5 0 0 1 15 0v14" />
      <path d="M20 9.5V6" />
      <path d="M16 22h8" />
    </>
  ),
  cup: (
    <>
      <path d="M10 14h16v9a8 8 0 0 1-16 0z" />
      <path d="M26 16.5h2.5a3.75 3.75 0 0 1 0 7.5H26" />
      <path d="M9 33h20" />
    </>
  ),
  pin: (
    <>
      <circle cx="20" cy="17" r="5.5" />
      <path d="M20 33c7-8 11-12.5 11-16a11 11 0 1 0-22 0c0 3.5 4 8 11 16z" />
    </>
  ),
};

/**
 * Four reasons, delivered as a stack rather than a grid.
 *
 * Each card sticks a little lower than the one before it, so as you
 * scroll they pile up and you can still see the shoulder of every card
 * underneath. The cards below shrink and dim on scrub, which is what
 * turns the pile into depth instead of clutter.
 */
export default function Benefits() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const title = root.current?.querySelector<HTMLElement>("[data-split]");
      if (title) splitLinesIn(title);
      revealOnScroll(root.current!);

      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", root.current!);
      stickyStack(cards);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="benefits" className="bg-cream py-20 sm:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span data-reveal className="eyebrow inline-block">
              Why it tastes like this
            </span>
            <h2 data-split className="gs-hide mt-4 h-section">
              It’s a <em>55</em> thing
            </h2>
          </div>
          <p data-reveal className="max-w-xs text-sm leading-relaxed text-ink/60">
            Four things we refuse to outsource. Keep scrolling — they stack.
          </p>
        </div>
      </div>

      {/* The stack. Each card sticks 2.5rem lower than the last. */}
      <div className="wrap mt-16">
        <div className="flex flex-col gap-[8vh]">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="sticky"
              style={{ top: `calc(9vh + ${i * 2.5}rem)`, zIndex: i + 1 }}
            >
              <article
                data-stack-card
                className="grain relative grid min-h-[19rem] origin-top overflow-hidden rounded-[2rem] border border-ink/10 bg-ink text-cream shadow-[0_24px_60px_-30px_rgba(21,14,10,0.5)] will-transform sm:min-h-[22rem] lg:grid-cols-[1.15fr_1fr]"
              >
                <div className="relative z-10 flex flex-col justify-between p-8 sm:p-11">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-caramel text-ink">
                      <svg
                        viewBox="0 0 40 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-8"
                      >
                        {icons[b.icon]}
                      </svg>
                    </div>
                    <span className="font-display text-sm font-bold tracking-widest text-cream/35">
                      {b.n} / 04
                    </span>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-4xl sm:text-5xl">{b.title}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">{b.body}</p>
                  </div>
                </div>

                <div className="relative min-h-[12rem] overflow-hidden lg:min-h-0">
                  <Image
                    src={b.img}
                    alt={b.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent lg:from-ink lg:via-ink/25" />
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
