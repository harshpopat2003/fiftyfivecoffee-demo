"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap, splitWordsIn } from "@/lib/motion";
import { hero } from "@/lib/content";

/**
 * The hero is one pinned scene rather than a screenful of content.
 *
 * Act one is the cream headline wrapped around a landscape window. As
 * you scroll, that window's clip-path opens to full bleed while the two
 * headline lines part and dissolve, and act two — the dark statement
 * and the fact row — rises out of the image now filling the viewport.
 *
 * The window's starting shape is measured from a real laid-out element
 * (`data-hero-slot`) rather than hard-coded percentages, so the type
 * frames the image at every viewport instead of landing on top of it.
 *
 * Act one leaves as ONE element. Staggering the individual children out
 * put the scrubbed exit and the on-load entrance on the same targets,
 * and the entrance won — the body copy stayed lit all the way into act
 * two. The children still stagger *in*; only the exit is grouped.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const scope = root.current;
      const slot = scope?.querySelector<HTMLElement>("[data-hero-slot]");
      if (!scope || !slot) return;

      /** The clip-path that makes the window sit exactly on the slot. */
      const slotInset = () => {
        const r = slot.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const pct = (n: number) => `${Math.max(0, n)}%`;
        return `inset(${pct((r.top / vh) * 100)} ${pct(((vw - r.right) / vw) * 100)} ${pct(
          ((vh - r.bottom) / vh) * 100,
        )} ${pct((r.left / vw) * 100)} round 28px)`;
      };

      const counters = gsap.utils.toArray<HTMLElement>("[data-count]", scope);
      const writeCount = (el: HTMLElement, n: number) => {
        el.textContent = `${el.dataset.prefix ?? ""}${Math.round(n)}${el.dataset.suffix ?? ""}`;
      };

      if (prefersReducedMotion()) {
        gsap.set("[data-hero-window]", { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set("[data-hero-act2]", { autoAlpha: 1, y: 0 });
        counters.forEach((el) => writeCount(el, Number(el.dataset.count)));
        return;
      }

      gsap.set("[data-hero-window]", { clipPath: slotInset() });
      gsap.set("[data-hero-act2]", { autoAlpha: 0, y: 60 });

      // --- act one, on load -------------------------------------------
      const l1 = scope.querySelector<HTMLElement>("[data-hero-l1]");
      const l2 = scope.querySelector<HTMLElement>("[data-hero-l2]");
      if (l1) splitWordsIn(l1, { delay: 1.35, trigger: false });
      if (l2) splitWordsIn(l2, { delay: 1.46, trigger: false });

      gsap.from("[data-hero-fade]", {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        delay: 1.65,
      });

      gsap.from("[data-hero-window]", {
        clipPath: "inset(46% 44% 46% 44% round 28px)",
        duration: 1.5,
        ease: "power4.out",
        delay: 1.05,
      });

      gsap.from("[data-hero-badge]", {
        autoAlpha: 0,
        scale: 0.85,
        duration: 0.8,
        ease: "back.out(2)",
        stagger: 0.1,
        delay: 2.05,
      });

      // --- the scrubbed scene -----------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "+=220%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        "[data-hero-window]",
        { clipPath: () => slotInset() },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 },
        0,
      )
        .to("[data-hero-img]", { scale: 1, ease: "none", duration: 1 }, 0)
        .to("[data-hero-scrim]", { opacity: 0.68, ease: "none", duration: 1 }, 0)
        // Act one clears as one block — see the note at the top of the file.
        .to("[data-hero-act1]", { autoAlpha: 0, ease: "power2.in", duration: 0.8 }, 0)
        .to("[data-hero-l1]", { xPercent: -16, ease: "power2.in", duration: 0.8 }, 0)
        .to("[data-hero-l2]", { xPercent: 16, ease: "power2.in", duration: 0.8 }, 0)
        .to("[data-hero-act2]", { autoAlpha: 1, y: 0, ease: "power2.out", stagger: 0.07 }, 0.75);

      // Facts count as part of the same scene, not on their own trigger.
      counters.forEach((el, i) => {
        const state = { n: 0 };
        tl.to(
          state,
          { n: Number(el.dataset.count), ease: "none", onUpdate: () => writeCount(el, state.n) },
          0.9 + i * 0.05,
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative h-svh w-full overflow-hidden bg-cream"
      aria-label="55coffee — espresso meets Oman"
    >
      {/* the window that opens to full bleed */}
      <div
        data-hero-window
        className="grain absolute inset-0 z-0 overflow-hidden"
        style={{ clipPath: "inset(42% 22% 26% 22% round 28px)" }}
      >
        <div data-hero-img className="absolute inset-0 scale-[1.14] will-transform">
          <Image
            src="/assets/hero-1.jpg"
            alt="A 55coffee order being handed over"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_40%]"
          />
        </div>
        <div data-hero-scrim className="absolute inset-0 bg-void" style={{ opacity: 0.14 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-void/15 to-transparent" />
      </div>

      {/* act one — the type frames the window instead of sitting on it */}
      <div
        data-hero-act1
        className="pointer-events-none relative z-20 flex h-full flex-col pb-[4vh] pt-[calc(4.5rem+3vh)]"
      >
        <div className="wrap shrink-0 text-center">
          <span data-hero-fade className="eyebrow inline-block">
            {hero.eyebrow}
          </span>
          <h1 className="mt-3">
            <span data-hero-l1 className="gs-hide block h-hero">
              {hero.titleTop}
            </span>
            <span data-hero-l2 className="gs-hide block h-hero text-clay">
              {hero.titleBottom}
            </span>
          </h1>
        </div>

        {/* invisible; only there to give the window a measurable home */}
        <div className="wrap flex min-h-0 flex-1 py-[2.5vh]">
          <div data-hero-slot className="relative mx-auto w-full max-w-3xl">
            <span
              data-hero-badge
              className="absolute left-4 top-4 hidden rounded-full bg-cream px-4 py-2 text-xs font-semibold shadow-lg lg:block"
            >
              Ground to order
            </span>
            <span
              data-hero-badge
              className="absolute bottom-4 right-4 hidden rounded-full bg-caramel px-4 py-2 text-xs font-semibold text-ink shadow-lg lg:block"
            >
              Roasted in Khazaen
            </span>
          </div>
        </div>

        {/* One line, set as a statement rather than a paragraph. */}
        <div className="wrap flex shrink-0 justify-center">
          <p data-hero-fade className="max-w-2xl text-center text-pretty">
            <span className="mx-auto mb-5 block h-px w-12 bg-clay/50" />
            <span className="text-lg leading-[1.55] text-ink/60 sm:text-xl sm:leading-[1.5]">
              From a small kiosk in Salalah to{" "}
              <em className="font-semibold text-ink not-italic">29 branches nationwide</em> — quality,
              identity and community in every sip.
            </span>
          </p>
        </div>
      </div>

      {/* act two — revealed once the image owns the whole viewport */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center">
        <div className="wrap">
          <h2 data-hero-act2 className="h-display max-w-3xl text-cream opacity-0">
            {hero.actTwoLead} <em className="text-caramel!">{hero.actTwoAccent}</em>
          </h2>
          <p data-hero-act2 className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70 opacity-0 sm:text-base">
            {hero.actTwoSub}
          </p>

          <div
            data-hero-act2
            className="mt-10 grid max-w-3xl grid-cols-3 gap-4 border-t border-cream/20 pt-7 opacity-0"
          >
            {hero.facts.map((f) => (
              <div key={f.label}>
                <strong
                  data-count={f.value}
                  data-prefix={"prefix" in f ? f.prefix : ""}
                  data-suffix={"suffix" in f ? f.suffix : ""}
                  className="block font-display text-4xl font-extrabold tracking-tight text-caramel sm:text-6xl"
                >
                  0
                </strong>
                <span className="mt-2 block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cream/55 sm:text-xs">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
