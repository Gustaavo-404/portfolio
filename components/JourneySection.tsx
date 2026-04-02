"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 36;
const COLS = 6;
const ROWS = 6;

const FRAME_WIDTH = 2028 / COLS;
const FRAME_HEIGHT = 3240 / ROWS;

const CYCLES = 4;

const SIGNPOSTS = [
    {
        position: "12.5%",
        text: "IN 2019 I DISCOVERED MY PASSION FOR PROGRAMMING AND SOFTWARE ARCHITECTURE",
        year: "2019",
    },
    {
        position: "37.5%",
        text: "IN 2020 STARTED MY TECHNICAL HIGH SCHOOL DEGREE IN WEB DEVELOPMENT AT ETEC",
        year: "2020",
    },
    {
        position: "62.5%",
        text: "IN 2023 ENROLLED IN SYSTEMS ANALYSIS AND DEVELOPMENT AT FATEC COLLEGE",
        year: "2023",
    },
];

// ── YEAR THRESHOLDS — progress ranges mapped to each year ──
const YEAR_THRESHOLDS = [
    { from: 0, to: 0.26, year: "2019" },
    { from: 0.26, to: 0.52, year: "2020" },
    { from: 0.52, to: 1.00, year: "2023" },
];

// ── COMPASS ──
const Compass = ({ needleRef }: { needleRef: React.RefObject<SVGGElement | null> }) => (
    <div
        className="absolute bottom-8 left-8 z-50 pointer-events-none select-none"
        style={{ width: 88, height: 100 }}
    >
        <svg viewBox="0 0 88 88" width="88" height="88">
            {/* Outer rings */}
            <circle cx="44" cy="44" r="41" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" />
            <circle cx="44" cy="44" r="38" fill="rgba(220,213,197,0.06)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
            <circle cx="44" cy="44" r="32" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />

            {/* Tick marks */}
            {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 10 * Math.PI) / 180;
                const isMajor = i % 9 === 0;
                const isMid = i % 3 === 0 && !isMajor;
                const inner = isMajor ? 30 : isMid ? 33 : 35;
                const outer = 37;
                const x1 = 44 + inner * Math.sin(angle);
                const y1 = 44 - inner * Math.cos(angle);
                const x2 = 44 + outer * Math.sin(angle);
                const y2 = 44 - outer * Math.cos(angle);
                return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="rgba(0,0,0,0.45)"
                        strokeWidth={isMajor ? 1.2 : isMid ? 0.7 : 0.4} />
                );
            })}

            {/* Cardinal labels */}
            <text x="44" y="17" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="700" fill="rgba(0,0,0,0.75)">N</text>
            <text x="44" y="77" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(0,0,0,0.4)">S</text>
            <text x="74" y="47" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(0,0,0,0.4)">E</text>
            <text x="14" y="47" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(0,0,0,0.4)">W</text>

            {/* Intercardinal labels */}
            <text x="67" y="24" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="rgba(0,0,0,0.25)">NE</text>
            <text x="67" y="68" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="rgba(0,0,0,0.25)">SE</text>
            <text x="21" y="24" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="rgba(0,0,0,0.25)">NW</text>
            <text x="21" y="68" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="rgba(0,0,0,0.25)">SW</text>

            {/* Needle */}
            <g ref={needleRef} style={{ transformOrigin: "44px 44px" }}>
                {/* North — dark */}
                <polygon points="44,13 47.5,44 44,51 40.5,44" fill="rgba(0,0,0,0.78)" />
                {/* South — light */}
                <polygon points="44,51 47.5,44 44,75 40.5,44" fill="rgba(0,0,0,0.2)" />
                {/* North decorative line */}
                <line x1="44" y1="13" x2="44" y2="22" stroke="rgba(220,213,197,0.3)" strokeWidth="0.8" />
            </g>

            {/* Center pin */}
            <circle cx="44" cy="44" r="4" fill="rgba(220,213,197,0.9)" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
            <circle cx="44" cy="44" r="1.5" fill="rgba(0,0,0,0.6)" />

            {/* Crosshair */}
            <line x1="44" y1="27" x2="44" y2="31" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            <line x1="44" y1="57" x2="44" y2="61" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            <line x1="27" y1="44" x2="31" y2="44" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            <line x1="57" y1="44" x2="61" y2="44" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
        </svg>
        <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 7, letterSpacing: "0.14em", color: "rgba(0,0,0,0.28)", marginTop: 2 }}>
            BEARING
        </div>
    </div>
);

// ── RULER ──
const Ruler = ({ progress }: { progress: number }) => {
    const TOTAL_TICKS = 60;
    const activeTick = Math.round(progress * TOTAL_TICKS);

    return (
        <div className="absolute z-50 pointer-events-none select-none"
            style={{ bottom: 52, left: 40, right: 40, height: 32 }}>

            {/* Ruler border — only bottom + sides */}
            <div style={{
                position: "absolute", inset: 0,
                borderLeft: "1px solid rgba(0,0,0,0.2)",
                borderRight: "1px solid rgba(0,0,0,0.2)",
                borderBottom: "1px solid rgba(0,0,0,0.2)",
            }} />

            {/* Ticks row */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", alignItems: "flex-end", height: "100%" }}>
                {Array.from({ length: TOTAL_TICKS + 1 }).map((_, i) => {
                    const isMajor = i % 10 === 0;
                    const isMid = i % 5 === 0 && !isMajor;
                    const tickH = isMajor ? 16 : isMid ? 10 : 5;
                    const isActive = i === activeTick;

                    return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                            {/* Number label above major ticks */}
                            {isMajor && (
                                <span style={{
                                    fontFamily: "monospace",
                                    fontSize: 6,
                                    lineHeight: 1,
                                    marginBottom: 2,
                                    color: isActive ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.22)",
                                    transition: "color 0.2s",
                                }}>
                                    {i}
                                </span>
                            )}
                            <div style={{
                                width: isActive ? 2 : 1,
                                height: isActive ? tickH + 5 : tickH,
                                background: isActive
                                    ? "rgba(0,0,0,0.7)"
                                    : isMajor
                                        ? "rgba(0,0,0,0.35)"
                                        : isMid
                                            ? "rgba(0,0,0,0.2)"
                                            : "rgba(0,0,0,0.12)",
                                transition: "height 0.12s, background 0.12s",
                            }} />
                        </div>
                    );
                })}
            </div>

            {/* Moving cursor triangle */}
            <div style={{
                position: "absolute",
                bottom: 20,
                left: `${progress * 100}%`,
                transform: "translateX(-50%)",
                fontFamily: "monospace",
                fontSize: 8,
                color: "rgba(0,0,0,0.45)",
                transition: "left 0.08s linear",
                lineHeight: 1,
            }}>
                ▲
            </div>

            {/* "KM" label on right edge */}
            <div style={{
                position: "absolute",
                top: 0, right: -22,
                fontFamily: "monospace",
                fontSize: 6,
                letterSpacing: "0.08em",
                color: "rgba(0,0,0,0.25)",
                lineHeight: 1,
            }}>
                KM
            </div>
        </div>
    );
};

// ── YEAR DISPLAY ──
const YearDisplay = ({ year }: { year: string }) => (
    <div className="absolute z-50 pointer-events-none select-none"
        style={{ top: 18, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>

        {/* Top bracket line */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.22)" }} />
            <span style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>YEAR</span>
            <div style={{ width: 24, height: 1, background: "rgba(0,0,0,0.22)" }} />
        </div>

        {/* Big year number — re-mounts on key change to trigger animation */}
        <div
            key={year}
            className="title"
            style={{
                fontSize: 86,
                fontWeight: 900,
                lineHeight: 1,
                color: "rgba(0, 0, 0, 0.51)",
                letterSpacing: "-0.04em",
                animation: "yearIn 0.3s ease-out forwards",
            }}
        >
            {year}
        </div>

        {/* Bottom decoration */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 1, background: "rgba(0,0,0,0.15)" }} />
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.2)" }} />
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.12)" }} />
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.07)" }} />
            <div style={{ width: 12, height: 1, background: "rgba(0,0,0,0.15)" }} />
        </div>
    </div>
);

// ── TELEGRAPH POLE ──
const TelegraphPole = () => (
    <svg viewBox="0 0 40 180" width="150" height="500"
        className="absolute bottom-0 pointer-events-none"
        style={{ filter: "brightness(0.3) contrast(1.4)" }}>
        <rect x="18" y="10" width="4" height="170" fill="#1a1a1a" rx="1" />
        <rect x="4" y="20" width="32" height="3" fill="#1a1a1a" rx="1" />
        <ellipse cx="8" cy="20" rx="3" ry="4" fill="#1a1a1a" />
        <ellipse cx="32" cy="20" rx="3" ry="4" fill="#1a1a1a" />
        <rect x="14" y="175" width="12" height="3" fill="#1a1a1a" rx="1" opacity="0.5" />
    </svg>
);

// ── CACTUS ──
const Cactus = ({ height = 120, className = "", style }: { height?: number; className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 60 140" width={height * 0.43} height={height}
        className={`absolute bottom-0 pointer-events-none ${className}`}
        style={{ filter: "brightness(0.25) contrast(1.5)", ...style }}>
        <rect x="24" y="20" width="12" height="120" fill="#1a1a1a" rx="6" />
        <rect x="4" y="55" width="12" height="50" fill="#1a1a1a" rx="6" />
        <rect x="4" y="50" width="30" height="10" fill="#1a1a1a" rx="5" />
        <rect x="44" y="70" width="12" height="40" fill="#1a1a1a" rx="6" />
        <rect x="30" y="65" width="30" height="10" fill="#1a1a1a" rx="5" />
    </svg>
);

// ── BIRD ──
const Bird = ({ style }: { style: React.CSSProperties }) => (
    <svg viewBox="0 0 24 10" width="24" height="10"
        className="absolute pointer-events-none" style={{ opacity: 0.18, ...style }}>
        <path d="M0 5 Q4 0 8 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10 5 Q14 0 18 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

// ── MAIN COMPONENT ──
export const JourneySection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const charRef = useRef<HTMLDivElement>(null);
    const tumbleweedRef = useRef<HTMLDivElement>(null);
    const noiseBWRef = useRef<HTMLDivElement>(null);
    const noiseColorRef = useRef<HTMLDivElement>(null);
    const scanlinesRef = useRef<HTMLDivElement>(null);
    const vignetteRef = useRef<HTMLDivElement>(null);
    const flickerRef = useRef<HTMLDivElement>(null);
    const blackoutRef = useRef<HTMLDivElement>(null);
    const dustRef = useRef<HTMLDivElement>(null);
    const bird1Ref = useRef<SVGSVGElement>(null);
    const bird2Ref = useRef<SVGSVGElement>(null);
    const shimmer1Ref = useRef<HTMLDivElement>(null);
    const shimmer2Ref = useRef<HTMLDivElement>(null);
    const filmBurnRef = useRef<HTMLDivElement>(null);
    const scratchRef = useRef<HTMLDivElement>(null);
    const compassNeedleRef = useRef<SVGGElement>(null);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeYear, setActiveYear] = useState("----");

    useEffect(() => {
        if (!sectionRef.current || !trackRef.current || !charRef.current) return;

        const totalWidth = window.innerWidth * 4;
        let lastProgress = 0;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: `+=${totalWidth}`,
                scrub: 0.2,
                pin: true,
                invalidateOnRefresh: true,
            },
        });

        tl.to(trackRef.current, { x: -(totalWidth - window.innerWidth), ease: "none" }, 0);

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${totalWidth}`,
            scrub: 0.2,
            onUpdate: (self) => {
                const progress = self.progress;
                const speed = Math.abs(progress - lastProgress);
                lastProgress = progress;

                // Update reactive UI overlays
                setScrollProgress(progress);
                const threshold = YEAR_THRESHOLDS.find(t => progress >= t.from && progress < t.to);
                if (threshold) setActiveYear(threshold.year);

                if (speed < 0.001) return;

                // Sprite frame
                const rawFrame = progress * CYCLES * TOTAL_FRAMES;
                const frame = Math.floor(rawFrame % TOTAL_FRAMES);
                const col = frame % COLS;
                const row = Math.floor(frame / COLS);
                gsap.set(charRef.current, {
                    backgroundPosition: `-${Math.round(col * FRAME_WIDTH)}px -${Math.round(row * FRAME_HEIGHT)}px`,
                });

                // Dust
                if (dustRef.current) {
                    gsap.to(dustRef.current, { opacity: Math.min(speed * 80, 0.55), duration: 0.15 });
                }

                // Compass needle — drifts + shakes on speed
                if (compassNeedleRef.current) {
                    const drift = Math.sin(progress * Math.PI * 6) * 12;
                    const shake = speed > 0.002 ? (Math.random() - 0.5) * 8 : 0;
                    gsap.to(compassNeedleRef.current, {
                        rotation: drift + shake,
                        duration: 0.4,
                        ease: "elastic.out(1,0.5)",
                    });
                }

                const isEnding = progress > 0.85;
                const intensity = isEnding ? (progress - 0.85) / 0.15 : 0;

                // 1. NOISE
                if (isEnding) {
                    gsap.to(noiseBWRef.current, { opacity: intensity * 0.9, duration: 0.05 });
                    gsap.to(noiseColorRef.current, { opacity: intensity * 0.4, duration: 0.05 });
                    gsap.to(noiseBWRef.current, { backgroundPosition: `${Math.random() * 100}% ${Math.random() * 100}%`, duration: 0.1, overwrite: true });
                    gsap.to(noiseColorRef.current, { backgroundPosition: `${Math.random() * 100}% ${Math.random() * 100}%`, duration: 0.1, overwrite: true });
                } else {
                    gsap.to(noiseBWRef.current, { opacity: 0, duration: 0.2 });
                    gsap.to(noiseColorRef.current, { opacity: 0, duration: 0.2 });
                }

                // 2. SCANLINES
                if (isEnding) {
                    gsap.to(scanlinesRef.current, { opacity: 0.4 + intensity * 0.6, backgroundSize: `100% ${4 + intensity * 8}px`, duration: 0.1 });
                } else {
                    gsap.to(scanlinesRef.current, { opacity: 0.2, backgroundSize: "100% 4px", duration: 0.2 });
                }

                // 3. VIGNETTE
                if (isEnding) {
                    gsap.to(vignetteRef.current, { opacity: intensity * 0.8, duration: 0.1 });
                } else {
                    gsap.to(vignetteRef.current, { opacity: 0, duration: 0.2 });
                }

                // 4. FLICKER
                if (isEnding && Math.random() < 0.4) {
                    gsap.to(flickerRef.current, { opacity: 0.3 + Math.random() * 0.5, duration: 0.05, yoyo: true, repeat: 1 });
                } else {
                    gsap.to(flickerRef.current, { opacity: 0, duration: 0.1 });
                }

                // 5. BG DEGRADATION
                if (isEnding) {
                    gsap.to(trackRef.current, {
                        filter: `brightness(${1.2 - intensity * 0.6}) contrast(${0.7 - intensity * 0.4}) grayscale(${intensity * 0.6}) blur(${intensity * 2}px) hue-rotate(${intensity * 15}deg)`,
                        duration: 0.1,
                    });
                } else {
                    gsap.to(trackRef.current, { filter: "brightness(1.1) contrast(0.5)", duration: 0.2 });
                }

                // 6. CHAR DEGRADATION
                if (isEnding) {
                    gsap.to(charRef.current, { opacity: 1 - intensity * 0.7, filter: `contrast(${1 + intensity * 1.5}) brightness(${1 - intensity * 0.3})`, duration: 0.1 });
                } else {
                    gsap.to(charRef.current, { opacity: 1, filter: "contrast(0.65) brightness(1.1)", duration: 0.2 });
                }

                // 7. SECTION FLICKER
                if (isEnding) {
                    gsap.to(sectionRef.current, { opacity: 0.85 + Math.random() * 0.2, duration: 0.05, overwrite: true });
                } else {
                    gsap.to(sectionRef.current, { opacity: 1, duration: 0.2 });
                }

                // 8. BLACKOUT
                if (progress > 0.92) {
                    const bi = (progress - 0.92) / 0.08;
                    gsap.to(blackoutRef.current, { opacity: Math.min(1, bi * 1.2), duration: 0.1 });
                    gsap.to(trackRef.current, { opacity: 1 - bi, duration: 0.1 });
                    gsap.to(charRef.current, { opacity: 1 - bi, duration: 0.1 });
                } else {
                    gsap.to(blackoutRef.current, { opacity: 0, duration: 0.2 });
                }

                // 9. FILM BURN
                if (filmBurnRef.current) {
                    gsap.to(filmBurnRef.current, { opacity: isEnding ? intensity * 0.6 : 0, duration: isEnding ? 0.08 : 0.3 });
                }

                // 10. FILM SCRATCH
                if (scratchRef.current && Math.random() < 0.05) {
                    const x = 20 + Math.random() * 60;
                    gsap.set(scratchRef.current, { left: `${x}%`, opacity: 0.3 + Math.random() * 0.4 });
                    gsap.to(scratchRef.current, { opacity: 0, duration: 0.12, delay: 0.05 });
                }
            },
        });

        // GLITCH
        const glitch = () => {
            if (!trackRef.current) return;
            gsap.timeline()
                .to(trackRef.current, { x: "+=4", duration: 0.04 })
                .to(trackRef.current, { x: "-=8", duration: 0.04 })
                .to(trackRef.current, { x: "+=4", duration: 0.04 })
                .to(trackRef.current, { filter: "brightness(1.3) contrast(0.6)", duration: 0.05 })
                .to(trackRef.current, { filter: "brightness(1.1) contrast(0.5)", duration: 0.1 });
        };
        const glitchInterval = setInterval(() => { if (Math.random() < 0.2) glitch(); }, 2000);

        // TUMBLEWEED
        const spawnTumbleweed = () => {
            if (!tumbleweedRef.current) return;
            const el = tumbleweedRef.current;
            const startY = Math.random() * 40;
            const midY = startY - (30 + Math.random() * 40);
            const endY = startY + (10 + Math.random() * 20);
            const duration = 5 + Math.random() * 3;
            gsap.killTweensOf(el);
            gsap.set(el, { x: window.innerWidth + 200, y: startY, opacity: 1, rotation: 0, scale: 1.5 });
            const tw = gsap.timeline({
                onComplete: () => { gsap.set(el, { opacity: 0 }); }
            });
            tw.to(el, { x: -200, duration, ease: "power2.in" }, 0);
            tw.to(el, { y: midY, duration: duration * 0.4, ease: "power1.out" }, 0);
            tw.to(el, { y: endY, duration: duration * 0.6, ease: "bounce.out" }, duration * 0.4);
            tw.to(el, { rotation: -1080, duration, ease: "none" }, 0);
        };
        const tumbleInterval = setInterval(() => { if (Math.random() < 0.3) spawnTumbleweed(); }, 3000);

        // BIRDS
        const animateBird = (el: SVGSVGElement | null, delay: number, duration: number, yPos: number) => {
            if (!el) return;
            gsap.set(el, { x: window.innerWidth + 60, y: yPos, opacity: 0.18 });
            const loop = () => gsap.fromTo(el, { x: window.innerWidth + 60 }, { x: -60, duration, ease: "none", delay, onComplete: loop });
            loop();
        };
        animateBird(bird1Ref.current, 2, 18, window.innerHeight * 0.12);
        animateBird(bird2Ref.current, 8, 26, window.innerHeight * 0.18);

        // SHIMMER
        const shimmerLoop = (el: HTMLDivElement | null, phase: number) => {
            if (!el) return;
            gsap.to(el, { scaleX: 0.6 + Math.random() * 0.4, opacity: 0.04 + Math.random() * 0.06, duration: 1.4 + Math.random(), ease: "sine.inOut", yoyo: true, repeat: -1, delay: phase });
        };
        shimmerLoop(shimmer1Ref.current, 0);
        shimmerLoop(shimmer2Ref.current, 0.7);

        // COMPASS idle drift
        if (compassNeedleRef.current) {
            gsap.to(compassNeedleRef.current, { rotation: 5, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
        }

        return () => {
            clearInterval(glitchInterval);
            clearInterval(tumbleInterval);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-[#dcd5c5]">

            {/* ── YEAR DISPLAY — fixed centre-top ── */}
            <YearDisplay year={activeYear} />

            {/* ── COMPASS — bottom-left game HUD ── */}
            <Compass needleRef={compassNeedleRef} />

            {/* ── RULER — bottom progress bar ── */}
            <Ruler progress={scrollProgress} />

            {/* ── FILM STRIP LEFT ── */}
            <div className="absolute left-0 top-0 bottom-0 w-5 z-50 pointer-events-none flex flex-col justify-around py-2"
                style={{ background: "rgba(0,0,0,0.82)" }}>
                {Array.from({ length: 22 }).map((_, i) => (
                    <div key={i} className="mx-auto rounded-sm"
                        style={{ width: 10, height: 8, background: "rgba(220,213,197,0.1)", border: "1px solid rgba(220,213,197,0.06)" }} />
                ))}
            </div>

            {/* ── FILM STRIP RIGHT ── */}
            <div className="absolute right-0 top-0 bottom-0 w-5 z-50 pointer-events-none flex flex-col justify-around py-2"
                style={{ background: "rgba(0,0,0,0.82)" }}>
                {Array.from({ length: 22 }).map((_, i) => (
                    <div key={i} className="mx-auto rounded-sm"
                        style={{ width: 10, height: 8, background: "rgba(220,213,197,0.1)", border: "1px solid rgba(220,213,197,0.06)" }} />
                ))}
            </div>

            {/* ── FILM FRAME COUNTER ── */}
            <div className="absolute top-3 left-8 z-50 pointer-events-none select-none"
                style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", color: "rgba(220,213,197,0.25)" }}>
                JOURNEY // GH-2026 // FR 00
            </div>

            {/* ── FILM SCRATCH ── */}
            <div ref={scratchRef} className="absolute top-0 bottom-0 pointer-events-none opacity-0"
                style={{ zIndex: 45, width: 1, background: "rgba(220,213,197,0.55)", mixBlendMode: "screen" }} />

            {/* ── FILM BURN ── */}
            <div ref={filmBurnRef} className="absolute pointer-events-none opacity-0"
                style={{
                    zIndex: 41, top: "30%", right: "8%", width: 180, height: 180,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,255,240,0.65) 0%, rgba(200,190,150,0.3) 40%, transparent 70%)",
                    mixBlendMode: "screen",
                }} />

            {/* ── BIRDS viewport-fixed ── */}
            <svg ref={bird1Ref} viewBox="0 0 44 12" width="44" height="12"
                className="absolute pointer-events-none" style={{ zIndex: 15, opacity: 0.18 }}>
                <path d="M0 6 Q5 0 10 6" fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M13 6 Q18 0 23 6" fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <svg ref={bird2Ref} viewBox="0 0 32 10" width="32" height="10"
                className="absolute pointer-events-none" style={{ zIndex: 15, opacity: 0.13 }}>
                <path d="M0 5 Q4 0 8 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M10 5 Q14 0 18 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            {/* ── HEAT SHIMMER ── */}
            <div ref={shimmer1Ref} className="absolute pointer-events-none"
                style={{ zIndex: 8, bottom: "28%", left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(220,213,197,0.18), transparent)", transformOrigin: "center" }} />
            <div ref={shimmer2Ref} className="absolute pointer-events-none"
                style={{ zIndex: 8, bottom: "26%", left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(220,213,197,0.12), transparent)", transformOrigin: "center" }} />

            {/* ── DUST CLOUD ── */}
            <div ref={dustRef} className="absolute pointer-events-none opacity-0"
                style={{ zIndex: 18, bottom: "0%", left: "50%", transform: "translateX(-50%)", width: 120, height: 28, background: "radial-gradient(ellipse, rgba(180,170,150,0.7) 0%, transparent 70%)", filter: "blur(6px)" }} />

            {/* ── HORIZON LINE ── */}
            <div className="absolute pointer-events-none"
                style={{ zIndex: 6, bottom: "32%", left: 0, right: 0, height: 1, background: "rgba(0,0,0,0.08)" }} />

            {/* BLACKOUT */}
            <div ref={blackoutRef} className="absolute inset-0 pointer-events-none z-50 bg-black opacity-0" />

            {/* NOISE 1 */}
            <div ref={noiseBWRef} className="absolute inset-0 pointer-events-none opacity-0 z-30 mix-blend-overlay"
                style={{ backgroundImage: "url('/images/noise.png')", backgroundSize: "200px", backgroundRepeat: "repeat" }} />

            {/* NOISE 2 */}
            <div ref={noiseColorRef} className="absolute inset-0 pointer-events-none opacity-0 z-30 mix-blend-screen"
                style={{ backgroundImage: "url('/images/noise_color.png')", backgroundSize: "150px", backgroundRepeat: "repeat" }} />

            {/* SCANLINES */}
            <div ref={scanlinesRef} className="absolute inset-0 pointer-events-none z-40 opacity-20"
                style={{ background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 2px, transparent 4px)", backgroundSize: "100% 4px" }} />

            {/* VIGNETTE */}
            <div ref={vignetteRef} className="absolute inset-0 pointer-events-none z-30 opacity-0"
                style={{ background: "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)" }} />

            {/* FLICKER */}
            <div ref={flickerRef} className="absolute inset-0 pointer-events-none z-40 opacity-0 bg-black" />

            {/* ── BACKGROUND TRACK ── */}
            <div ref={trackRef} className="h-full relative"
                style={{
                    width: "400vw",
                    backgroundImage: "url('/images/background-journey.png')",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(1.6) contrast(0.3)",
                    backgroundSize: "cover",
                    backgroundPosition: "left 60%",
                }}>

                {/* BIRDS parallax */}
                <Bird style={{ top: "14%", left: "8%" }} />
                <Bird style={{ top: "10%", left: "31%", width: 18, height: 8 }} />
                <Bird style={{ top: "16%", left: "58%" }} />
                <Bird style={{ top: "11%", left: "77%", width: 16, height: 7 }} />

                {/* GROUND CRACKS */}
                {[
                    { left: "5%", bottom: "18%", w: 38, rot: -6 },
                    { left: "9%", bottom: "12%", w: 22, rot: 14 },
                    { left: "19%", bottom: "22%", w: 50, rot: -3 },
                    { left: "33%", bottom: "14%", w: 28, rot: 9 },
                    { left: "44%", bottom: "20%", w: 42, rot: -11 },
                    { left: "57%", bottom: "10%", w: 18, rot: 7 },
                    { left: "66%", bottom: "17%", w: 34, rot: -5 },
                    { left: "76%", bottom: "24%", w: 26, rot: 12 },
                    { left: "85%", bottom: "15%", w: 48, rot: -8 },
                    { left: "92%", bottom: "20%", w: 20, rot: 4 },
                ].map((crack, i) => (
                    <div key={i} className="absolute pointer-events-none"
                        style={{ left: crack.left, bottom: crack.bottom, width: crack.w, height: 1, background: "rgba(0,0,0,0.14)", transform: `rotate(${crack.rot}deg)`, zIndex: 5 }} />
                ))}

                {/* ── JOURNEY CHECKPOINTS ── */}
                {SIGNPOSTS.map((sign, index) => (
                    <div key={index} className="absolute top-20 -translate-x-1/2 flex flex-col items-center" style={{ left: sign.position }}>
                        <div className="absolute top-10 -translate-x-1/2 flex flex-col items-center group" style={{ left: sign.position }}>
                            <div className="w-4 h-4 bg-zinc-900 rounded-full shadow-lg mb-[-8px] z-30 border-2 border-zinc-700 flex items-center justify-center">
                                <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                            </div>

                            <div className="bg-[#e8e2d2] text-[#1a1a1a] p-8 shadow-[12px_12px_0px_rgba(0,0,0,0.25)] border-2 border-[#8c826b] w-[450px] rotate-[-1deg] relative overflow-hidden transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
                                <div className="absolute inset-0 opacity-[0.08] z-[30] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none scale-150">
                                    <p className="title text-[120px] font-black">VT</p>
                                </div>

                                {/* Year watermark inside card */}
                                <div className="absolute top-2 right-3 select-none pointer-events-none"
                                    style={{ fontFamily: "monospace", fontSize: 64, fontWeight: 900, color: "rgba(0, 0, 0, 0.1)", lineHeight: 1, letterSpacing: "-0.04em" }}>
                                    {sign.year}
                                </div>

                                <div className="flex justify-between items-center border-b-4 border-black mb-6 pb-2">
                                    <div className="flex flex-col">
                                        <p className="font-mono text-[10px] font-black uppercase tracking-widest">Department of Logic</p>
                                        <p className="font-mono text-[9px] opacity-60">Serial: GH-2026-AR</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-[14px] font-black tracking-tighter italic bg-black text-[#e8e2d2] px-2 uppercase">
                                            Ref_0{index + 1}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h2 className="title text-4xl font-black tracking-tighter leading-none uppercase border-y-2 border-black/10 py-2">
                                        Official Notice
                                    </h2>
                                </div>

                                <div className="relative z-10 px-4">
                                    <p className="subtitle text-[14px] font-black uppercase leading-tight text-center tracking-normal">
                                        "{sign.text}"
                                    </p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-black/10 flex justify-between items-center italic">
                                    <p className="font-mono text-[8px] opacity-50">Authorized: Overseer Gustavo</p>
                                    <div className="rotate-[-10deg] border-2 border-black text-black px-3 py-1 text-[10px] font-black rounded-sm uppercase tracking-tighter shadow-sm bg-[#e8e2d2]">
                                        Confidential
                                    </div>
                                </div>

                                {/* Tape strip */}
                                <div className="absolute pointer-events-none"
                                    style={{ top: -10, left: "50%", transform: "translateX(-50%)", width: 44, height: 18, background: "rgba(220,210,180,0.55)", border: "1px solid rgba(180,160,120,0.35)", zIndex: 40 }} />
                            </div>

                            <div className="w-[6px] h-32 bg-gradient-to-b from-black/30 to-transparent opacity-20 blur-[1px]" />
                        </div>
                        <div className="w-[2px] h-20 bg-black/20 border-l border-dashed border-black/40" />
                    </div>
                ))}
            </div>

            {/* TUMBLEWEED */}
            <div ref={tumbleweedRef} className="absolute bottom-10 left-0 z-10 pointer-events-none opacity-0">
                <img src="/images/tumbleweed.png" alt="tumbleweed" className="w-16 opacity-60" />
            </div>

            {/* CHARACTER */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ bottom: "0px" }}>
                <div ref={charRef}
                    style={{
                        width: FRAME_WIDTH,
                        height: FRAME_HEIGHT,
                        backgroundImage: "url('/images/journey-sprite-sheet.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "2028px 3240px",
                        transform: "scale(0.55)",
                        transformOrigin: "bottom",
                        filter: "contrast(0.7) brightness(1.1)",
                    }} />
            </div>

            {/* SCROLL HINT */}
            <div className="absolute bottom-6 right-8 z-50 pointer-events-none select-none"
                style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", color: "rgba(0,0,0,0.28)", animation: "pulse 2s ease-in-out infinite" }}>
                SCROLL ▶▶
            </div>

            {/* WATERMARK */}
            <div className="absolute bottom-10 right-10 rotate-12 opacity-10 select-none pointer-events-none">
                <p className="text-6xl font-black title">TOP SECRET</p>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.28; }
                    50%       { opacity: 0.65; }
                }
                @keyframes yearIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)  scale(1);    }
                }
            `}</style>
        </section>
    );
};