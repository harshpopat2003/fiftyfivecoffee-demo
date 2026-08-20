"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap, revealOnScroll, splitLinesIn } from "@/lib/motion";
import { branches } from "@/lib/content";

/**
 * Branches as an index, not a card grid.
 *
 * Each row's rule draws itself on scrub as the list scrolls past, and
 * hovering a row floats its photograph next to the cursor — so the
 * list stays quiet and typographic until you interrogate it.
 */
export default function Branches() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useGSAP(
    () => {
      registerGsap();
      const title = root.current?.querySelector<HTMLElement>("[data-split]");
      if (title) splitLinesIn(title);
      revealOnScroll(root.current!);

      if (prefersReducedMotion()) return;

      // Rules draw left-to-right as the list moves through the viewport.
      gsap.fromTo(
        "[data-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: "[data-list]",
            start: "top 82%",
            end: "bottom 78%",
            scrub: 0.6,
          },
        },
      );

      gsap.from("[data-branch-name]", {
        yPercent: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: "[data-list]", start: "top 78%", once: true },
      });

      // Photo follows the pointer while a row is hovered.
      const xTo = gsap.quickTo(preview.current, "x", { duration: 0.55, ease: "power3.out" });
      const yTo = gsap.quickTo(preview.current, "y", { duration: 0.55, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const box = root.current!.getBoundingClientRect();
        xTo(e.clientX - box.left);
        yTo(e.clientY - box.top);
      };

      root.current!.addEventListener("pointermove", onMove);
      return () => root.current?.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="branches" className="relative overflow-hidden bg-cream-deep py-20 sm:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span data-reveal className="eyebrow inline-block">
              Our branches
            </span>
            <h2 data-split className="gs-hide mt-4 h-section">
              29 spots, <em>and counting</em>
            </h2>
          </div>
          <a href="#" data-reveal className="btn btn-ghost text-ink">
            <span>View all locations</span>
          </a>
        </div>

        <div data-list className="mt-16">
          {branches.map((b, i) => (
            <a
              key={b.name}
              href="#"
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered((v) => (v === i ? null : v))}
              className="group relative block"
            >
              <span
                data-rule
                aria-hidden
                className="block h-px origin-left bg-ink/15 transition-colors duration-500 group-hover:bg-ink/40"
              />
              <div className="flex items-center justify-between gap-6 py-6 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:pl-4 sm:py-7">
                <div className="flex items-baseline gap-4 overflow-hidden sm:gap-7">
                  <span className="font-display text-xs font-bold text-ink/30">0{i + 1}</span>
                  <h3 data-branch-name className="text-[clamp(1.5rem,4vw,2.75rem)]">
                    {b.name}
                  </h3>
                </div>

                <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                  <span
                    className={`hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${
                      b.open24 ? "bg-clay/15 text-clay" : "bg-ink/6 text-ink/55"
                    }`}
                  >
                    {b.open24 && <span className="size-1.5 rounded-full bg-clay" />}
                    {b.hours}
                  </span>
                  <span className="hidden text-sm text-ink/45 lg:block">{b.address}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    className="size-5 shrink-0 text-ink/30 transition duration-500 group-hover:translate-x-1 group-hover:text-clay"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
          <span aria-hidden className="block h-px bg-ink/15" />
        </div>
      </div>

      {/* cursor-tracked preview */}
      <div
        ref={preview}
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[3/2] w-72 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-[0_20px_50px_-20px_rgba(21,14,10,0.6)] transition-opacity duration-500 lg:block ${
          hovered === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {hovered !== null && (
          <Image src={branches[hovered].img} alt="" fill sizes="288px" className="object-cover" />
        )}
      </div>
    </section>
  );
}
