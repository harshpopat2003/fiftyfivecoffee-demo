"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, scrollState } from "@/lib/motion";

const links = [
  { href: "#signature", label: "Menu" },
  { href: "#roastery", label: "Roastery" },
  { href: "#branches", label: "Branches" },
];

function Social() {
  return (
    <div className="hidden items-center gap-4 lg:flex">
      {[
        <path
          key="ig"
          d="M4 8.5A4.5 4.5 0 0 1 8.5 4h7A4.5 4.5 0 0 1 20 8.5v7a4.5 4.5 0 0 1-4.5 4.5h-7A4.5 4.5 0 0 1 4 15.5zM12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8M16.6 7.4h.01"
        />,
        <path key="tt" d="M14.8 4v9.6a3.4 3.4 0 1 1-2.9-3.36M14.8 4c.4 2.1 1.85 3.45 3.9 3.75" />,
        <path key="li" d="M4.5 4.5h15v15h-15zM8 10.4V16M8 7.5v.05M11.6 16v-3.4a2 2 0 0 1 4 0V16" />,
      ].map((glyph, i) => (
        <a key={i} href="#" aria-label="Social profile" className="opacity-55 transition hover:opacity-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="size-[18px]"
          >
            {glyph}
          </svg>
        </a>
      ))}
    </div>
  );
}

/**
 * Direction-aware bar. It gets out of the way on the way down and
 * comes back the moment you scroll up, which matters here because so
 * much of the page is pinned full-bleed imagery. A hairline at the top
 * reports overall progress through the page.
 */
export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useGSAP(
    () => {
      registerGsap();
      const bar = root.current!;
      const progress = bar.querySelector<HTMLElement>("[data-progress]")!;

      const yTo = gsap.quickTo(bar, "yPercent", { duration: 0.5, ease: "power3.out" });
      let hidden = false;

      const tick = () => {
        gsap.set(progress, { scaleX: scrollState.progress });

        const y = window.scrollY;
        setStuck(y > 40);

        // Never hide near the very top, and never while the menu is open.
        const shouldHide = scrollState.direction === 1 && y > window.innerHeight * 0.8;
        if (shouldHide !== hidden) {
          hidden = shouldHide;
          yTo(hidden ? -110 : 0);
        }
      };

      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  // An open mobile menu must not scroll away with the bar.
  useEffect(() => {
    if (open) gsap.set(root.current, { yPercent: 0 });
  }, [open]);

  return (
    <header
      ref={root}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        stuck || open ? "bg-cream/85 text-ink backdrop-blur-xl" : "bg-transparent text-ink"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-ink/10">
        <div data-progress className="h-px origin-left scale-x-0 bg-clay" />
      </div>

      <nav className="wrap flex items-center justify-between py-4">
        <Social />

        <a href="#top" aria-label="55coffee — home" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <Image
            src="/assets/logo-lockup.png"
            alt="55coffee"
            width={1492}
            height={972}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </a>

        <div className="hidden items-center gap-7 text-sm font-medium md:flex lg:ml-auto">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="opacity-70 transition hover:opacity-100">
              {l.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex size-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-0.5 w-6 bg-current transition ${open ? "translate-y-1 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-current transition ${open ? "-translate-y-1 -rotate-45" : ""}`} />
        </button>
      </nav>

      <div
        className={`grid overflow-hidden bg-cream text-ink transition-all duration-500 md:hidden ${
          open ? "grid-rows-[1fr] border-t border-ink/10" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="wrap flex flex-col gap-1 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink/10 py-3 font-display text-2xl font-bold last:border-0"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
