"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap, revealOnScroll, scrollState } from "@/lib/motion";
import { testimonials } from "@/lib/content";

function Quote({ quote, name, place }: { quote: string; name: string; place: string }) {
  return (
    <figure className="w-[19rem] shrink-0 rounded-3xl bg-cream px-7 py-6 shadow-[0_2px_20px_rgba(21,14,10,0.06)] sm:w-[23rem]">
      <div className="text-sm tracking-[0.2em] text-caramel">★★★★★</div>
      <blockquote className="mt-3 text-[0.98rem] leading-relaxed text-ink/85">{quote}</blockquote>
      <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
        {name} · {place}
      </figcaption>
    </figure>
  );
}

/**
 * Two rows of reviews sliding against each other.
 *
 * Their base offset is scrubbed to scroll position, and scroll velocity
 * adds a skew on top — so the rows shear when you move fast and settle
 * flat when you stop. The 4.8 counts up on the same scroll window.
 */
export default function Proof() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      revealOnScroll(root.current!);

      const scope = root.current!;
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", scope);
      const score = scope.querySelector<HTMLElement>("[data-score]")!;

      if (prefersReducedMotion()) {
        score.textContent = "4.8";
        return;
      }

      rows.forEach((row) => {
        const dir = Number(row.dataset.dir);
        gsap.fromTo(
          row,
          { xPercent: 4 * dir },
          {
            xPercent: -12 * dir,
            ease: "none",
            scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });

      const skew = gsap.quickTo(rows, "skewX", { duration: 0.6, ease: "power3.out" });
      const tick = () => {
        skew(gsap.utils.clamp(-5, 5, -scrollState.velocity * 0.2));
      };
      gsap.ticker.add(tick);

      const state = { n: 0 };
      gsap.to(state, {
        n: 4.8,
        ease: "none",
        onUpdate: () => {
          score.textContent = state.n.toFixed(1);
        },
        scrollTrigger: { trigger: score, start: "top 92%", end: "top 55%", scrub: 0.6 },
      });

      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  const half = Math.ceil(testimonials.length / 2);

  return (
    <section ref={root} className="overflow-hidden bg-cream-deep py-20 sm:py-28">
      <div className="wrap flex flex-col items-center text-center">
        <div data-reveal className="text-lg tracking-[0.3em] text-caramel">
          ★★★★★
        </div>
        <strong
          data-score
          className="mt-4 block font-display text-[clamp(4rem,14vw,10rem)] font-extrabold leading-none tracking-tighter"
        >
          0.0
        </strong>
        <p data-reveal className="mt-4 max-w-lg text-base text-ink/70 sm:text-lg">
          Average from <strong className="font-semibold text-ink">2,410</strong> guests across Muscat, Salalah
          and Batinah.
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-5">
        <div data-row data-dir="1" className="flex w-max gap-5 pl-5 will-transform">
          {testimonials.slice(0, half).map((t) => (
            <Quote key={t.name} {...t} />
          ))}
        </div>
        <div data-row data-dir="-1" className="flex w-max gap-5 pl-5 will-transform">
          {testimonials.slice(half).map((t) => (
            <Quote key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
