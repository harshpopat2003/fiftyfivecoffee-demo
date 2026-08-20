"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { roastSteps } from "@/lib/content";

/**
 * The roastery pins behind its own copy.
 *
 * One full-bleed frame holds the viewport while the three process steps
 * hand over to each other on top of it — the image slowly de-scales and
 * darkens across the whole scene, and the roast profile plots itself in
 * time with the steps. It reads as one continuous shot rather than
 * three cards that happen to be about roasting.
 *
 * The chart carries a full-length ghost of the curve underneath the live
 * trace. Without it the panel read as an empty box for the first two
 * steps and only became a chart on the third.
 */
export default function Roastery() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      registerGsap();
      const scope = root.current;
      if (!scope) return;

      const curve = scope.querySelector<SVGPathElement>("[data-curve]");
      const markers = gsap.utils.toArray<SVGCircleElement>("[data-curve-marker]", scope);
      const markerAt = [0.08, 0.52, 0.97];

      // Markers are placed onto the path itself rather than at guessed
      // coordinates, so they stay put if the curve is ever redrawn.
      if (curve) {
        const len = curve.getTotalLength();
        markers.forEach((m) => {
          const pt = curve.getPointAtLength(len * markerAt[Number(m.dataset.markerIndex)]);
          m.setAttribute("cx", String(pt.x));
          m.setAttribute("cy", String(pt.y));
        });
      }

      if (prefersReducedMotion()) {
        gsap.set("[data-step]", { autoAlpha: 1, y: 0 });
        gsap.set("[data-curve]", { strokeDashoffset: 0 });
        gsap.set("[data-curve-area], [data-curve-dot]", { opacity: 1 });
        return;
      }

      gsap.set("[data-step]", { autoAlpha: 0, y: 40 });
      gsap.set("[data-step]:first-child", { autoAlpha: 1, y: 0 });

      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", scope);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: `+=${steps.length * 90}%`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            setStep((prev) => (prev === i ? prev : i));
          },
        },
      });

      // One beat per step; the frame breathes across all of them.
      const SEG = 1;
      const span = SEG * steps.length;

      tl.fromTo("[data-roast-img]", { scale: 1.18 }, { scale: 1, ease: "none", duration: span }, 0)
        .fromTo("[data-roast-scrim]", { opacity: 0.34 }, { opacity: 0.66, ease: "none", duration: span }, 0)
        .fromTo("[data-curve-area]", { opacity: 0 }, { opacity: 1, ease: "none", duration: span }, 0)
        .to("[data-curve-dot]", { opacity: 1, duration: 0.25 }, 0);

      // One proxy drives the trace and the probe together, so the dot is
      // always exactly at the head of the drawn line.
      if (curve) {
        const len = curve.getTotalLength();
        const dots = gsap.utils.toArray<SVGCircleElement>("[data-curve-dot]", scope);
        const head = { p: 0 };

        tl.to(
          head,
          {
            p: 1,
            ease: "none",
            duration: span,
            onUpdate: () => {
              curve.style.strokeDashoffset = String(1 - head.p);
              const pt = curve.getPointAtLength(len * head.p);
              dots.forEach((d) => {
                d.setAttribute("cx", String(pt.x));
                d.setAttribute("cy", String(pt.y));
              });
              markers.forEach((m) => {
                const passed = head.p >= markerAt[Number(m.dataset.markerIndex)];
                m.setAttribute("stroke", passed ? "#e8a45c" : "rgba(245,239,229,0.3)");
              });
            },
          },
          0,
        );
      }

      // Steps hand over one at a time, with a short crossfade between.
      steps.forEach((el, i) => {
        if (i > 0) {
          tl.to(el, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" }, i * SEG);
        }
        if (i < steps.length - 1) {
          tl.to(el, { autoAlpha: 0, y: -40, duration: 0.28, ease: "power2.in" }, (i + 1) * SEG - 0.3);
        }
      });
    },
    { scope: root },
  );

  const CURVE = "M34 132 C 78 126, 104 98, 136 78 S 214 42, 258 30 L 326 20";

  return (
    <section
      ref={root}
      id="roastery"
      className="grain relative flex h-svh items-center overflow-hidden bg-void text-cream"
    >
      <div data-roast-img className="absolute inset-0 will-transform">
        <Image
          src="/assets/gen-roastery.jpg"
          alt="The Volcano Roastery in Khazaen, Muscat"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div data-roast-scrim className="absolute inset-0 bg-void" style={{ opacity: 0.34 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/55 to-void/10" />

      <div className="wrap relative z-10 grid w-full items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="eyebrow inline-block text-caramel!">Volcano Roastery · Khazaen, Muscat</span>
          <h2 className="mt-4 h-section max-w-xl">
            We roast it <em className="text-caramel!">ourselves</em>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/60 sm:text-base">
            Owning the roastery means owning the outcome. Same profile, same team, same week — so the cup you
            buy in Salalah tastes like the one in Ghubrah.
          </p>

          {/* The three steps occupy the same slot and hand over. */}
          <div className="relative mt-12 h-44 sm:h-40">
            {roastSteps.map((s) => (
              <div key={s.n} data-step className="absolute inset-0 flex gap-5 border-t border-cream/15 pt-6">
                <b className="font-display text-lg font-bold text-caramel">{s.n}</b>
                <div>
                  <h3 className="text-2xl sm:text-3xl">{s.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/60">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {roastSteps.map((s, i) => (
              <span
                key={s.n}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === step ? "w-10 bg-caramel" : "w-4 bg-cream/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* The roast profile, plotted as a proper chart. */}
        <div className="hidden lg:block">
          <div className="rounded-[1.75rem] border border-cream/15 bg-void/50 p-7 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-cream/45">
                Roast profile · {roastSteps[step].title}
              </span>
              <span className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-caramel">
                <span className="size-1.5 rounded-full bg-caramel" />
                Locked
              </span>
            </div>

            <svg viewBox="0 0 340 172" fill="none" className="mt-5 w-full">
              <defs>
                <linearGradient id="roast-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e8a45c" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#e8a45c" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* temperature scale */}
              {[
                { y: 18, t: "220°" },
                { y: 56, t: "190°" },
                { y: 94, t: "160°" },
                { y: 132, t: "130°" },
              ].map((g) => (
                <g key={g.t}>
                  <line
                    x1="34"
                    y1={g.y}
                    x2="330"
                    y2={g.y}
                    stroke="rgba(245,239,229,0.08)"
                    strokeWidth="1"
                  />
                  <text x="0" y={g.y + 3} fill="rgba(245,239,229,0.35)" style={{ fontSize: 8 }}>
                    {g.t}
                  </text>
                </g>
              ))}

              {/* elapsed-time axis */}
              <line x1="34" y1="146" x2="330" y2="146" stroke="rgba(245,239,229,0.15)" strokeWidth="1" />
              {[
                { x: 34, t: "0:00", a: "start" },
                { x: 133, t: "3:12", a: "middle" },
                { x: 232, t: "6:24", a: "middle" },
                { x: 330, t: "9:36", a: "end" },
              ].map((g) => (
                <text
                  key={g.t}
                  x={g.x}
                  y="160"
                  textAnchor={g.a as "start" | "middle" | "end"}
                  fill="rgba(245,239,229,0.3)"
                  style={{ fontSize: 8 }}
                >
                  {g.t}
                </text>
              ))}

              {/* area under the curve, revealed with the trace */}
              <path data-curve-area d={`${CURVE} L 326 146 L 34 146 Z`} fill="url(#roast-fill)" opacity="0" />

              {/* ghost of the full profile — the chart is never empty */}
              <path
                d={CURVE}
                stroke="rgba(245,239,229,0.13)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* the live trace */}
              <path
                data-curve
                d={CURVE}
                stroke="#e8a45c"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
              />

              {/* phase markers, lit as the trace passes them */}
              {[0, 1, 2].map((i) => (
                <circle
                  key={i}
                  data-curve-marker
                  data-marker-index={i}
                  cx="34"
                  cy="132"
                  r="3.5"
                  fill="#0a0605"
                  stroke="rgba(245,239,229,0.3)"
                  strokeWidth="2"
                />
              ))}

              {/* the probe riding the head of the trace */}
              <circle data-curve-dot cx="34" cy="132" r="9" fill="rgba(232,164,92,0.22)" opacity="0" />
              <circle data-curve-dot cx="34" cy="132" r="3.5" fill="#e8a45c" opacity="0" />
            </svg>

            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-cream/12 pt-5">
              {[
                { k: "Charge", v: "198°C" },
                { k: "Turn", v: "1:42" },
                { k: "Drop", v: "9:36" },
              ].map((m, i) => (
                <div key={m.k}>
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cream/40">
                    {m.k}
                  </span>
                  <b
                    className={`mt-1 block font-display text-xl font-bold transition-colors duration-500 ${
                      i === step ? "text-caramel" : "text-cream/70"
                    }`}
                  >
                    {m.v}
                  </b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
