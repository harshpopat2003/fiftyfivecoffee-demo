"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap, splitWordsIn } from "@/lib/motion";
import { payments } from "@/lib/content";

/**
 * The closing frame pins and pushes in.
 *
 * A bean macro sits behind the CTA and scales down across the pin while
 * its scrim lifts, so the section arrives dark and opens up as you
 * commit to it. The headline splits in on the same beat.
 */
export default function Order() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const title = root.current?.querySelector<HTMLElement>("[data-split]");
      if (title) splitWordsIn(title, { start: "top 80%" });

      if (prefersReducedMotion()) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      })
        .fromTo("[data-order-bg]", { scale: 1.3, yPercent: -6 }, { scale: 1, yPercent: 6, ease: "none" }, 0)
        .fromTo("[data-order-scrim]", { opacity: 0.86 }, { opacity: 0.58, ease: "none" }, 0);

      gsap.from("[data-order-fade]", {
        autoAlpha: 0,
        y: 32,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 62%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="order"
      className="grain relative flex min-h-[85svh] items-center overflow-hidden bg-void py-24 text-cream sm:py-32"
    >
      <div data-order-bg className="absolute inset-0 will-transform">
        <Image src="/assets/gen-beans.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div data-order-scrim className="absolute inset-0 bg-void" style={{ opacity: 0.78 }} />

      <div className="wrap relative z-10 text-center">
        <h2 data-split className="gs-hide mx-auto max-w-4xl h-display">
          Don’t just crave it. <em className="text-caramel!">Get it.</em>
        </h2>
        <p data-order-fade className="mx-auto mt-6 max-w-lg text-base text-cream/65 sm:text-lg">
          Pick it up, drive through, or have it sent. Delivery across Muscat, Salalah and Batinah.
        </p>

        <div data-order-fade className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#" className="btn btn-accent btn-lg">
            Order delivery
          </a>
          <a href="#branches" className="btn btn-ghost btn-lg text-cream">
            <span>Pick up in store</span>
          </a>
        </div>

        <div data-order-fade className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {payments.map((p) => (
            <span
              key={p}
              className="rounded-lg border border-cream/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cream/55"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
