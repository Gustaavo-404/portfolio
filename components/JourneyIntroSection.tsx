"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export const JourneyIntroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // ─── Split text ──
    const titleEl = section.querySelector(".split-title");
    const subtitleEl = section.querySelector(".split-subtitle");
    if (!titleEl || !subtitleEl) return;

    const splitTitle = new SplitType(titleEl as HTMLElement, { types: "chars,words" });
    const splitSubtitle = new SplitType(subtitleEl as HTMLElement, { types: "chars" });

    // ─── Initial states ──
    gsap.set(".split-title .char", { opacity: 0, y: 20, rotateX: -90, filter: "blur(8px)", transformOrigin: "50% 50% -20px" });
    gsap.set(".split-subtitle .char", { opacity: 0, x: -8 });
    gsap.set(".year-counter", { opacity: 0, scale: 0.85 });
    gsap.set(".timeline-bar", { scaleX: 0, transformOrigin: "left" });
    gsap.set(".meta-ui", { opacity: 0 });
    gsap.set(".scratch-line", { scaleY: 0, transformOrigin: "top" });
    gsap.set(".frame-corner", { opacity: 0, scale: 0.7 });

    // ─── Master timeline ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=300%",
        scrub: 1.2,
        pin: true,
      },
    });

    // 1. Frame corners & Meta appear
    tl.to(".frame-corner, .meta-ui", {
      opacity: 1,
      scale: 1,
      stagger: 0.08,
      duration: 0.5,
      ease: "back.out(1.5)",
    })

    // 2. Title chars drop in
    .to(".split-title .char", {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      stagger: { each: 0.04, from: "random" },
      duration: 1.2,
      ease: "power3.out",
    }, "-=0.3")

    // 3. Subtitle chars drift in
    .to(".split-subtitle .char", {
      opacity: 1,
      x: 0,
      stagger: 0.025,
      duration: 0.8,
      ease: "power2.out",
    }, "-=0.5")

    // 4. Hold…
    .to({}, { duration: 2 })

    // 5. Vertical lines "glitch"
    .to(".scratch-line", {
      scaleY: 1,
      stagger: { each: 0.15, repeat: 1, yoyo: true },
      duration: 0.3,
      ease: "none",
    })

    // 6. Title flickers out
    .to(".split-title", {
      opacity: 0,
      skewX: 8,
      filter: "blur(12px)",
      duration: 0.6,
      ease: "power3.in",
    })
    .to(".split-subtitle, .meta-ui", {
      opacity: 0,
      duration: 0.4,
    }, "-=0.4")

    // 7. Year counter fades in
    .to(".year-counter", {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    })

    // 8. Timeline bar fills
    .to(".timeline-bar", {
      scaleX: 1,
      duration: 1,
      ease: "power2.inOut",
    }, "-=0.4")

    // 9. Rewind counter with minor glitch
    .to(yearRef.current, {
      innerText: 2019,
      duration: 4,
      snap: { innerText: 1 },
      ease: "power1.in",
      onUpdate() {
        const el = yearRef.current;
        if (!el) return;
        if (Math.random() > 0.88) {
          gsap.set(el, {
            x: gsap.utils.random(-6, 6),
            opacity: gsap.utils.random(0.4, 1),
            filter: `blur(${gsap.utils.random(0, 3)}px)`,
          });
        } else {
          gsap.set(el, { x: 0, opacity: 1, filter: "blur(0px)" });
        }
      },
    })

    // 10. Hold & Explode
    .to({}, { duration: 0.5 })
    .to(".year-counter", {
      scale: 18,
      opacity: 0,
      filter: "blur(60px)",
      duration: 2.5,
      ease: "power4.in",
    }, "-=0.1")
    .to(".frame-corner", { opacity: 0, duration: 0.5 }, "-=0.8");

    return () => {
      splitTitle.revert();
      splitSubtitle.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0c0c0c] text-white font-sans"
    >
      {/* ── BACKGROUND LINES (Vertical Decorative) ── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-40">
        {[20, 40, 60, 80].map((left, i) => (
          <div
            key={i}
            className="scratch-line absolute top-0 bottom-0 w-px bg-white/20"
            style={{ left: `${left}%` }}
          />
        ))}
      </div>

      {/* ── FRAME CORNERS ── */}
      <div className="frame-corner absolute top-8 left-8 w-16 h-16 border-l border-t border-white/20 z-20" />
      <div className="frame-corner absolute top-8 right-8 w-16 h-16 border-r border-t border-white/20 z-20" />
      <div className="frame-corner absolute bottom-8 left-8 w-16 h-16 border-l border-b border-white/20 z-20" />
      <div className="frame-corner absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/20 z-20" />

      {/* ── META UI ── */}
      <div className="meta-ui absolute bottom-12 left-12 z-20 font-mono space-y-1 hidden md:block">
        <div className="text-[9px] tracking-[0.3em] uppercase text-white/40">◎ SYSTEM_INIT</div>
        <div className="text-[9px] tracking-[0.2em] text-white/20 uppercase font-mono">TC 00:00:42:09</div>
      </div>

      <div className="meta-ui absolute bottom-12 right-12 z-20 font-mono text-right space-y-1 hidden md:block">
        <div className="text-[9px] tracking-[0.3em] uppercase text-white/40">REEL_001</div>
        <div className="text-[9px] tracking-[0.2em] text-white/20 uppercase font-mono">EST. 2026</div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-30 flex flex-col items-center text-center px-6">

        {/* TITLE */}
        <h2 className="split-title title uppercase italic leading-none"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            letterSpacing: "0.2em",
          }}>
          7 years ago…
        </h2>

        {/* SUBTITLE */}
        <p className="split-subtitle subtitle mt-6"
          style={{
            fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)",
            letterSpacing: "0.5em",
            opacity: 0.4,
            textTransform: "uppercase",
          }}>
          the journey begins here
        </p>

        {/* CENTRAL DECORATIVE LINE */}
        <div className="meta-ui mt-10 w-40 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* YEAR COUNTER */}
        <div className="year-counter absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-[9px] tracking-[0.8em] uppercase mb-4 text-white/20">
            Scanning History
          </span>

          <span
            ref={yearRef}
            className="title font-black leading-none"
            style={{
              fontSize: "clamp(7rem, 22vw, 18rem)",
              letterSpacing: "-0.04em",
              color: "white"
            }}
          >
            2026
          </span>

          {/* Progress bar */}
          <div className="mt-8 w-64 relative">
            <div className="timeline-bar absolute inset-0 h-px bg-white/50" />
            <div className="w-full h-px bg-white/10" />
            <div className="flex justify-between mt-2 font-mono text-[8px] text-white/30 tracking-widest uppercase">
              <span>2026</span>
              <span>2019</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};