"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { signature } from "@/lib/content";

// next/image rewrites its own URLs for basePath; a plain <video> does not.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The scroll-driven turntable.
 *
 * The section pins and the wheel becomes the transport: scroll position
 * maps straight onto `video.currentTime`, so all five cups turn through
 * a full 360° as you scroll down and unwind when you scroll back up.
 * The clip is encoded with every frame as a keyframe, which is what
 * makes seeking land exactly rather than snapping to the nearest
 * I-frame.
 *
 * Presentation matters as much as the mechanism here: a rounded,
 * letterboxed rectangle reads as an embedded video player no matter how
 * good the footage is. So the clip runs edge to edge with no frame, and
 * its hard top and bottom edges are dissolved into the section colour —
 * what is left looks like a lit set, not a player.
 *
 * The degree readout and the cup labels are written straight to the DOM
 * from the ticker. Routing them through state would re-render the
 * section a few hundred times per pass for no benefit.
 */

/** Where each cup sits across the frame, measured off the render. */
const CUP_X = [0.1, 0.3, 0.5, 0.7, 0.9];

export default function ScrollFilm() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const deg = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const scope = root.current;
      const vid = video.current;
      if (!scope || !vid) return;

      if (prefersReducedMotion()) return; // sits on the poster frame

      // Priming a muted video lets us seek before any user gesture.
      const prime = () => {
        vid.play()
          .then(() => vid.pause())
          .catch(() => {
            /* seeking still works without it in most browsers */
          });
      };
      if (vid.readyState >= 2) prime();
      else vid.addEventListener("loadeddata", prime, { once: true });

      const state = { target: 0, current: 0 };

      const tick = () => {
        const duration = vid.duration;
        if (!duration || Number.isNaN(duration)) return;
        state.current += (state.target - state.current) * 0.12;

        const t = state.current * duration;
        // Skip sub-frame seeks; they cost a decode and change nothing.
        if (Math.abs(vid.currentTime - t) > 1 / 48) vid.currentTime = t;

        if (deg.current) {
          deg.current.textContent = String(Math.round(state.current * 360)).padStart(3, "0");
        }
      };
      gsap.ticker.add(tick);

      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "+=320%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            state.target = self.progress;
          },
        },
      });

      gsap.fromTo(
        "[data-film-bar]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "+=320%", scrub: true },
        },
      );

      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="film"
      className="grain relative h-svh overflow-hidden bg-void text-cream"
      aria-label="Scroll-driven turntable of the 55coffee line-up"
    >
      {/* the set — edge to edge, no frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={video}
          src={`${BASE_PATH}/assets/lineup-scrub.mp4`}
          poster={`${BASE_PATH}/assets/lineup-poster.jpg`}
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="max-h-full w-full object-contain"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 13%, #000 85%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 13%, #000 85%, transparent 100%)",
          }}
        />
      </div>

      {/* dissolve the clip's hard edges into the section */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-void via-void/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-void via-void/60 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[16%] bg-gradient-to-r from-void/85 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[16%] bg-gradient-to-l from-void/85 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between pb-[5vh] pt-[calc(4.5rem+3vh)]">
        {/* heading + live rotation readout */}
        <div className="wrap flex items-start justify-between gap-8">
          <div className="max-w-xl">
            <span className="eyebrow inline-block text-caramel!">Scroll to spin</span>
            <h2 className="mt-4 h-section">
              Every cup, <em className="text-caramel!">every angle</em>
            </h2>
          </div>

          <div className="hidden shrink-0 text-right sm:block">
            <div className="flex items-start justify-end font-display font-extrabold leading-none tracking-tighter text-caramel">
              <span ref={deg} className="text-5xl tabular-nums sm:text-6xl">
                000
              </span>
              <span className="ml-0.5 mt-1 text-2xl">°</span>
            </div>
            <span className="mt-2 block text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-cream/45">
              Rotation
            </span>
          </div>
        </div>

        {/* The dial spans the viewport because the cups do. */}
        <div>
          <div className="relative hidden h-14 w-full lg:block">
            {signature.map((d, i) => (
              <div
                key={d.name}
                className="absolute top-0 -translate-x-1/2 text-center"
                style={{ left: `${CUP_X[i] * 100}%` }}
              >
                <span className="mx-auto mb-2 block h-3 w-px bg-caramel/50" />
                <span className="block font-display text-xs font-bold text-caramel">{d.n}</span>
                <span className="mt-1 block whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cream/50">
                  {d.name}
                </span>
              </div>
            ))}
          </div>

          <div className="wrap mt-3 flex items-center gap-5">
            <span className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-cream/45">
              All five, together
            </span>
            <div className="h-px flex-1 bg-cream/15">
              <div data-film-bar className="h-px origin-left scale-x-0 bg-caramel" />
            </div>
            <span className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-cream/45">
              One full turn
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
