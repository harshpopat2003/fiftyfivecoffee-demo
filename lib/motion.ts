"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

/**
 * Motion layer.
 *
 * Everything scroll-driven on this site runs off one Lenis instance
 * feeding ScrollTrigger from the GSAP ticker. That single pipeline is
 * what keeps pinned sections, scrubbed clip-paths and the velocity
 * marquee in lockstep instead of fighting each other.
 *
 * Components never talk to Lenis or ScrollTrigger directly — they call
 * the primitives below from useGSAP() and let the scope handle cleanup.
 */

let registered = false;
let lenis: Lenis | null = null;

/** Live scroll telemetry, read by the velocity-reactive pieces. */
export const scrollState = { velocity: 0, direction: 1 as 1 | -1, progress: 0 };

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------ *
 * Smooth scroll
 * ------------------------------------------------------------------ */

export function initLenis() {
  if (lenis || typeof window === "undefined") return null;
  registerGsap();

  if (prefersReducedMotion()) {
    // Native scrolling only — but the telemetry still has to stay live
    // so the progress bar keeps tracking.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return null;
  }

  lenis = new Lenis({
    duration: 1.15,
    // The long tail on this easing is what gives the page its weight.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis.on("scroll", (e: Lenis) => {
    scrollState.velocity = e.velocity;
    // Lenis reports 0 while at rest; keep the last real direction so the
    // marquee does not snap back to neutral every time you pause.
    if (e.direction === 1 || e.direction === -1) scrollState.direction = e.direction;
    scrollState.progress = e.progress;
    ScrollTrigger.update();
  });

  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

/** Freeze the page — used while the loader owns the screen. */
export function lockScroll(locked: boolean) {
  if (typeof document === "undefined") return;
  if (locked) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    lenis?.start();
    document.documentElement.style.overflow = "";
  }
}

export function scrollTo(target: string | number) {
  if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
  else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

/* ------------------------------------------------------------------ *
 * Text
 * ------------------------------------------------------------------ */

type SplitOpts = { delay?: number; trigger?: boolean; start?: string; stagger?: number };

/** Wrap each split part in an overflow-hidden block so it rises out of a mask. */
function mask(parts: Element[]) {
  parts.forEach((part) => {
    const wrapper = document.createElement("span");
    wrapper.style.display = "block";
    wrapper.style.overflow = "hidden";
    // Descenders get clipped without a little breathing room.
    wrapper.style.paddingBottom = "0.1em";
    wrapper.style.marginBottom = "-0.1em";
    part.parentNode?.insertBefore(wrapper, part);
    wrapper.appendChild(part);
    (part as HTMLElement).style.display = "block";
  });
}

/** Lines sweep up out of a mask. The workhorse for section headings. */
export function splitLinesIn(el: HTMLElement, opts: SplitOpts = {}) {
  if (prefersReducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }

  const split = new SplitText(el, { type: "lines", linesClass: "gs-line" });
  mask(split.lines);
  gsap.set(el, { autoAlpha: 1 });

  gsap.from(split.lines, {
    yPercent: 118,
    duration: 1.15,
    ease: "power4.out",
    stagger: opts.stagger ?? 0.085,
    delay: opts.delay ?? 0,
    scrollTrigger:
      opts.trigger === false ? undefined : { trigger: el, start: opts.start ?? "top 86%", once: true },
  });

  return split;
}

/**
 * Word-level version with a touch of rotation. Reserved for the two
 * display headlines so it stays a moment rather than a tic.
 */
export function splitWordsIn(el: HTMLElement, opts: SplitOpts = {}) {
  if (prefersReducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }

  const split = new SplitText(el, { type: "lines,words", linesClass: "gs-line", wordsClass: "gs-word" });
  mask(split.lines);
  gsap.set(el, { autoAlpha: 1 });

  gsap.from(split.words, {
    yPercent: 120,
    rotate: 4,
    duration: 1.2,
    ease: "power4.out",
    stagger: opts.stagger ?? 0.045,
    delay: opts.delay ?? 0,
    scrollTrigger:
      opts.trigger === false ? undefined : { trigger: el, start: opts.start ?? "top 86%", once: true },
  });

  return split;
}

/* ------------------------------------------------------------------ *
 * Scroll primitives
 * ------------------------------------------------------------------ */

/** Soft entrance for supporting copy. Deliberately quieter than the headings. */
export function revealOnScroll(scope: HTMLElement, selector = "[data-reveal]") {
  const targets = gsap.utils.toArray<HTMLElement>(selector, scope);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    gsap.set(targets, { autoAlpha: 1, y: 0 });
    return;
  }

  targets.forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: Number(el.dataset.revealDelay ?? 0),
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      },
    );
  });
}

/** Number that counts as the section scrolls, rather than on a fixed timer. */
export function scrubCount(el: HTMLElement, value: number, prefix = "", suffix = "", trigger?: Element) {
  const state = { n: 0 };
  const write = () => {
    el.textContent = `${prefix}${Math.round(state.n)}${suffix}`;
  };

  if (prefersReducedMotion()) {
    state.n = value;
    write();
    return;
  }

  gsap.to(state, {
    n: value,
    ease: "none",
    onUpdate: write,
    scrollTrigger: {
      trigger: trigger ?? el,
      start: "top 88%",
      end: "bottom 60%",
      scrub: 0.6,
    },
  });
}

/** Scroll-linked parallax. Positive `strength` trails the page. */
export function parallax(el: HTMLElement, strength = 8) {
  if (prefersReducedMotion()) return;

  gsap.fromTo(
    el,
    { yPercent: -strength },
    {
      yPercent: strength,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

/** Clip-path wipe, fired once on entry. */
export function maskWipe(el: HTMLElement, from = "inset(0% 0% 100% 0%)") {
  if (prefersReducedMotion()) {
    gsap.set(el, { clipPath: "none" });
    return;
  }

  gsap.fromTo(
    el,
    { clipPath: from },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "power3.out",
      duration: 1.5,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    },
  );
}

/**
 * Cards that pile up: as each card arrives the one beneath it shrinks
 * and dims, so the stack reads as depth rather than as a list.
 * Relies on the cards being `position: sticky` in the markup.
 *
 * Both ends of the filter are stated explicitly. Tweening `filter` from
 * a computed `none` makes GSAP substitute 0 for the absent brightness
 * rather than the identity 1, so the card animates up from pure black
 * instead of down from full brightness.
 */
export function stickyStack(cards: HTMLElement[]) {
  if (prefersReducedMotion() || cards.length < 2) return;

  cards.forEach((card, i) => {
    if (i === cards.length - 1) return;
    gsap.fromTo(
      card,
      { scale: 1, filter: "brightness(1)" },
      {
        scale: 0.94 - (cards.length - 2 - i) * 0.02,
        filter: "brightness(0.72)",
        ease: "none",
        scrollTrigger: {
          trigger: cards[i + 1],
          start: "top 90%",
          end: "top 30%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

export { gsap, ScrollTrigger, SplitText };
