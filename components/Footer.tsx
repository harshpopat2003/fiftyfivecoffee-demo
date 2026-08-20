"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap, revealOnScroll } from "@/lib/motion";
import { brand } from "@/lib/content";

const quickLinks = [
  { href: "#story", label: "Our story" },
  { href: "#signature", label: "Menu" },
  { href: "#branches", label: "Locations" },
  { href: "#", label: "Newsroom" },
  { href: "#", label: "Careers" },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      revealOnScroll(root.current!);
      if (prefersReducedMotion()) return;

      // The wordmark is scrubbed, so it keeps rising for as long as
      // there is footer left to scroll.
      gsap.fromTo(
        "[data-footer-word]",
        { yPercent: 42, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom bottom", scrub: 0.8 },
        },
      );
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="overflow-hidden bg-ink pt-20 text-cream">
      <div className="wrap grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <a href="#top" aria-label="55coffee — home" className="inline-block">
            <Image
              src="/assets/logo-lockup-light.png"
              alt="55coffee"
              width={1492}
              height={972}
              className="h-14 w-auto"
            />
          </a>
          <p data-reveal className="mt-4 max-w-xs text-sm leading-relaxed text-cream/55">
            Beyond coffee. Born in Oman, crafted for every cup.
          </p>
          <a
            href={`mailto:${brand.email}`}
            data-reveal
            className="mt-4 inline-block text-sm text-caramel underline-offset-4 hover:underline"
          >
            {brand.email}
          </a>
        </div>

        <div data-reveal>
          <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/40">Quick links</h5>
          <div className="mt-5 flex flex-col gap-2.5">
            {quickLinks.map((l, i) => (
              <a
                key={`${l.label}-${i}`}
                href={l.href}
                className="text-sm text-cream/75 transition hover:text-caramel"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div data-reveal>
          <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/40">We’re social</h5>
          <div className="mt-5 flex flex-col gap-2.5">
            {["Instagram", "LinkedIn", "TikTok"].map((s) => (
              <a key={s} href="#" className="text-sm text-cream/75 transition hover:text-caramel">
                {s}
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className="wrap flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 py-6 text-xs text-cream/45">
        <span>{brand.regions}</span>
        <div className="flex gap-5">
          {["Privacy", "Terms", "Cookies"].map((l) => (
            <a key={l} href="#" className="transition hover:text-cream">
              {l}
            </a>
          ))}
        </div>
        <span>
          Demo concept by <b className="font-semibold text-cream/70">The Auren Studio</b>
        </span>
      </div>

      <div className="overflow-hidden">
        <div
          data-footer-word
          aria-hidden
          className="select-none whitespace-nowrap text-center font-display font-extrabold leading-[0.78] tracking-tighter text-cream/6"
          style={{ fontSize: "clamp(4rem, 20vw, 18rem)" }}
        >
          55coffee
        </div>
      </div>
    </footer>
  );
}
