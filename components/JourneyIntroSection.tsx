"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const FLASHBACK_IMAGES = [
  "/images/flashback/frameflashback1.png",
  "/images/flashback/frameflashback2.png",
  "/images/flashback/frameflashback3.png",
];

const YEAR_START = 2026;
const YEAR_END   = 2019;
const REWIND_DUR = 12;

const RISE_DUR = 0.6;
const HOLD_DUR = 0.5;
const EXIT_DUR = 0.5;

const PHOTO_INTERVAL =
  (REWIND_DUR - (RISE_DUR + HOLD_DUR + EXIT_DUR)) / (FLASHBACK_IMAGES.length - 1);
const START_TIMES = FLASHBACK_IMAGES.map((_, i) => i * PHOTO_INTERVAL);

const ROTATIONS   = [-2.2, 1.8, -3.0];
// Each photo drifts in from a different horizontal offset
const X_OFFSETS   = ["-10vw", "10vw", "-6vw"];

function getDigits(year: number): string[] {
  return String(year).split("");
}

export const JourneyIntroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // Hidden span that GSAP tweens for the innerText value
  const yearRef    = useRef<HTMLSpanElement>(null);
  const photoRefs  = useRef<(HTMLDivElement | null)[]>([]);

  // 4 refs, one per digit column
  const col0 = useRef<HTMLDivElement>(null);
  const col1 = useRef<HTMLDivElement>(null);
  const col2 = useRef<HTMLDivElement>(null);
  const col3 = useRef<HTMLDivElement>(null);
  const colRefs = [col0, col1, col2, col3];

  const lastYearRef = useRef(YEAR_START);

  // Set digit columns instantly (no animation) — used on init
  const setSlotInstant = (year: number) => {
    getDigits(year).forEach((d, i) => {
      const el = colRefs[i].current;
      if (el) gsap.set(el, { y: `-${parseInt(d) * 10}%` });
    });
  };

  // Animate only the digits that changed
  const rollToYear = (from: number, to: number) => {
    const fd = getDigits(from);
    const td = getDigits(to);
    td.forEach((d, i) => {
      if (d === fd[i]) return;
      const el = colRefs[i].current;
      if (!el) return;
      gsap.to(el, {
        y: `-${parseInt(d) * 10}%`,
        duration: 0.14,
        ease: "power3.inOut",
        overwrite: true,
      });
    });
  };

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const titleEl    = section.querySelector(".split-title");
    const subtitleEl = section.querySelector(".split-subtitle");
    if (!titleEl || !subtitleEl) return;

    const splitTitle    = new SplitType(titleEl    as HTMLElement, { types: "chars,words" });
    const splitSubtitle = new SplitType(subtitleEl as HTMLElement, { types: "chars" });

    // ── Initial states ────────────────────────────────────────────
    gsap.set(".split-title .char", {
      opacity: 0, y: 20, rotateX: -90,
      filter: "blur(8px)", transformOrigin: "50% 50% -20px",
    });
    gsap.set(".split-subtitle .char", { opacity: 0, x: -8 });
    gsap.set(".year-counter-wrap",    { opacity: 0, x: -30 });
    gsap.set(".timeline-bar",         { scaleY: 0, transformOrigin: "top" });
    gsap.set(".meta-ui",              { opacity: 0 });
    gsap.set(".scratch-line",         { scaleY: 0, transformOrigin: "top" });
    gsap.set(".frame-corner",         { opacity: 0, scale: 0.7 });
    gsap.set(".progress-dot",         { opacity: 0, scale: 0 });

    setSlotInstant(YEAR_START);

    photoRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        y: "115vh",
        x: X_OFFSETS[i],
        opacity: 0,
        scale: 0.88,
        rotation: ROTATIONS[i] * 2.5,
        filter: "blur(8px)",
      });
    });

    // ── Master timeline ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=500%",
        scrub: 1.2,
        pin: true,
      },
    });

    // FASE A — intro reveal
    tl
      .to(".frame-corner, .meta-ui", {
        opacity: 1, scale: 1,
        stagger: 0.07, duration: 0.45, ease: "back.out(1.4)",
      })
      .to(".split-title .char", {
        opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
        stagger: { each: 0.038, from: "random" },
        duration: 1.0, ease: "power3.out",
      }, "-=0.25")
      .to(".split-subtitle .char", {
        opacity: 1, x: 0,
        stagger: 0.022, duration: 0.65, ease: "power2.out",
      }, "-=0.4")
      .to({}, { duration: 0.5 })
      .to(".split-title", {
        opacity: 0, y: -10, filter: "blur(5px)",
        duration: 0.4, ease: "power2.in",
      })
      .to(".split-subtitle, .meta-ui", { opacity: 0, duration: 0.28 }, "<+=0.06");

    // FASE B — scratch
    tl.to(".scratch-line", {
      scaleY: 1,
      stagger: { each: 0.09, repeat: 1, yoyo: true },
      duration: 0.2, ease: "none",
    });

    // FASE C — counter slides in
    tl
      .to(".year-counter-wrap", {
        opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
      })
      .to(".timeline-bar", {
        scaleY: 1, duration: 0.8, ease: "power2.inOut",
      }, "-=0.5")
      .to(".progress-dot", {
        opacity: 1, scale: 1,
        stagger: 0.1, duration: 0.3, ease: "back.out(2)",
      }, "-=0.5");

    // FASE D — year rewind (hidden span drives value; onUpdate rolls slots)
    tl.to(yearRef.current, {
      innerText: YEAR_END,
      duration: REWIND_DUR,
      snap: { innerText: 1 },
      ease: "none",
      onUpdate() {
        const el = yearRef.current;
        if (!el) return;
        const yr = parseInt(el.innerText);
        if (yr !== lastYearRef.current) {
          rollToYear(lastYearRef.current, yr);
          lastYearRef.current = yr;
        }
      },
    });

    // FASE D (parallel) — photo animations
    const rl = "<"; // relative label: all photos anchored to start of year tween

    START_TIMES.forEach((startTime, i) => {
      const el  = photoRefs.current[i];
      if (!el) return;
      const rot = ROTATIONS[i];
      const xOff = X_OFFSETS[i];

      // Rise: blur clears, drifts to center, rotation settles
      tl.to(el, {
        y: "0vh",
        x: "0vw",
        opacity: 1,
        scale: 1,
        rotation: rot,
        filter: "blur(0px)",
        duration: RISE_DUR,
        ease: "power3.out",
      }, `${rl}+=${startTime}`);

      // Hold: very slight breathe
      tl.to(el, {
        scale: 1.025,
        duration: HOLD_DUR / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      }, `${rl}+=${startTime + RISE_DUR}`);

      // Exit: blurs out, drifts back to origin side, shoots upward
      tl.to(el, {
        y: "-115vh",
        x: xOff,
        opacity: 0,
        scale: 0.92,
        rotation: rot * 0.25,
        filter: "blur(7px)",
        duration: EXIT_DUR,
        ease: "power2.in",
      }, `${rl}+=${startTime + RISE_DUR + HOLD_DUR}`);
    });

    // FASE E — pause
    tl.to({}, { duration: 0.2 });

    // FASE F — explosion
    tl
      .to(".year-counter-wrap", {
        scale: 14,
        opacity: 0,
        filter: "blur(80px)",
        duration: 1.2,
        ease: "power4.in",
      })
      .to(".frame-corner, .progress-dot", { opacity: 0, duration: 0.3 }, "-=0.6");

    return () => {
      splitTitle.revert();
      splitSubtitle.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { scope: sectionRef });

  const yearStops  = [2025, 2023, 2022];
  const initDigits = getDigits(YEAR_START); // ["2","0","2","6"]

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0c0c0c] text-white"
    >
      {/* Hidden span that GSAP tweens for innerText value */}
      <span ref={yearRef} className="sr-only" aria-hidden="true">{YEAR_START}</span>

      {/* SCRATCH LINES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        {[18, 38, 62, 82].map((left, i) => (
          <div
            key={i}
            className="scratch-line absolute top-0 bottom-0 w-px bg-white/20"
            style={{ left: `${left}%` }}
          />
        ))}
      </div>

      {/* FRAME CORNERS */}
      <div className="frame-corner absolute top-8 left-8 w-16 h-16 border-l border-t border-white/20 z-20" />
      <div className="frame-corner absolute top-8 right-8 w-16 h-16 border-r border-t border-white/20 z-20" />
      <div className="frame-corner absolute bottom-8 left-8 w-16 h-16 border-l border-b border-white/20 z-20" />
      <div className="frame-corner absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/20 z-20" />

      {/* META UI */}
      <div className="meta-ui absolute bottom-12 left-12 z-20 font-mono space-y-1 hidden md:block">
        <div className="text-[9px] tracking-[0.3em] uppercase text-white/40">◎ SYSTEM_INIT</div>
        <div className="text-[9px] tracking-[0.2em] text-white/20 uppercase">TC 00:00:42:09</div>
      </div>
      <div className="meta-ui absolute bottom-12 right-12 z-20 font-mono text-right space-y-1 hidden md:block">
        <div className="text-[9px] tracking-[0.3em] uppercase text-white/40">REEL_001</div>
        <div className="text-[9px] tracking-[0.2em] text-white/20 uppercase">EST. 2026</div>
      </div>

      {/* INTRO TEXT */}
      <div className="relative z-30 flex flex-col items-center text-center px-6 pointer-events-none">
        <h2
          className="split-title title uppercase italic leading-none"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)", letterSpacing: "0.2em" }}
        >
          7 years ago…
        </h2>
        <p
          className="split-subtitle subtitle mt-6"
          style={{
            fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)",
            letterSpacing: "0.5em", opacity: 0.4,
            textTransform: "uppercase",
          }}
        >
          the journey begins here
        </p>
        <div className="meta-ui mt-10 w-40 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="year-counter-wrap absolute inset-0 z-40 pointer-events-none flex">

        {/* LEFT — slot machine + timeline */}
        <div className="flex items-center justify-center w-1/2 h-full relative">

          {/* Vertical timeline */}
          <div
            className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ height: "340px" }}
          >
            <div className="relative w-px flex-1 bg-white/10 overflow-hidden">
              <div
                className="timeline-bar absolute top-0 left-0 right-0 bg-white/50"
                style={{ height: "100%", transformOrigin: "top" }}
              />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col justify-between h-full">
              {[YEAR_START, ...yearStops, YEAR_END].map((yr) => (
                <div key={yr} className="flex items-center gap-3">
                  <span className="font-mono text-[9px] tracking-[0.25em] text-white/25 w-10 text-right">{yr}</span>
                  <div className="progress-dot w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Slot machine year display */}
          <div className="flex flex-col items-start pl-16 md:pl-24">
            <span className="font-mono text-[9px] tracking-[0.7em] uppercase mb-3 text-white/25 block">
              Scanning History
            </span>

            {/*
              Each digit is a window that shows exactly 1 digit height.
              The inner column (10 digits tall) slides up/down to show the correct digit.
            */}
            <div
              className="title font-black tabular-nums select-none"
              style={{
                fontSize: "clamp(5rem, 14vw, 11rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "white",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              {initDigits.map((d, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: "1em",
                    // Top & bottom fade so the rolling feels like a real slot drum
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, white 18%, white 82%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, white 18%, white 82%, transparent 100%)",
                  }}
                >
                  <div
                    ref={colRefs[i]}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // Position: digit N is at top = N * (1em / 10 * 10) = N * 10%
                      transform: `translateY(-${parseInt(d) * 10}%)`,
                      willChange: "transform",
                    }}
                  >
                    {["0","1","2","3","4","5","6","7","8","9"].map((n) => (
                      <span
                        key={n}
                        style={{
                          display: "block",
                          height: "1em",
                          lineHeight: "1em",
                          textAlign: "center",
                        }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="w-8 h-px bg-white/20" />
              <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-white/20">
                {YEAR_START} — {YEAR_END}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — photos */}
        <div className="relative w-1/2 h-full overflow-hidden">
          {FLASHBACK_IMAGES.map((src, i) => (
            <div
              key={i}
              ref={(el) => { photoRefs.current[i] = el; }}
              className="absolute pointer-events-none"
              style={{
                width: "clamp(240px, 28vw, 400px)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                willChange: "transform, opacity, filter",
                zIndex: 15,
              }}
            >
              <div
                style={{
                  background: "#0e0e0e",
                  border: "1px solid rgba(255,255,255,0.10)",
                  padding: "7px 7px 34px",
                  boxShadow:
                    "0 20px 80px rgba(0,0,0,0.95), " +
                    "0 1px 0 rgba(255,255,255,0.04) inset",
                  position: "relative",
                }}
              >
                {/* Perforations top */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div key={j} style={{
                      width: "11px", height: "6px", borderRadius: "1px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "#0c0c0c", flexShrink: 0,
                    }} />
                  ))}
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Memory ${i + 1}`}
                  style={{
                    width: "100%", display: "block",
                    aspectRatio: "4/3", objectFit: "cover",
                    filter: "grayscale(100%) contrast(1.08) brightness(0.88)",
                  }}
                />

                {/* Perforations bottom */}
                <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div key={j} style={{
                      width: "11px", height: "6px", borderRadius: "1px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "#0c0c0c", flexShrink: 0,
                    }} />
                  ))}
                </div>

                {/* Caption */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: "34px", display: "flex",
                  alignItems: "center", justifyContent: "space-between",
                  padding: "0 12px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <span style={{
                    fontFamily: "monospace", fontSize: "8px",
                    letterSpacing: "0.28em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.20)",
                  }}>
                    {`FRAME ${String(i + 1).padStart(2, "0")}`}
                  </span>
                  <span style={{
                    fontFamily: "monospace", fontSize: "8px",
                    letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.18)",
                  }}>
                    {[2025, 2023, 2022][i]}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Gradient mask */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(to bottom, #0c0c0c 0%, transparent 20%, transparent 80%, #0c0c0c 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
};