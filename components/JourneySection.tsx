"use client";

import { useEffect, useRef } from "react";
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
        text: "IN 2019 I DISCOVERED MY PASSION FOR PROGRAMMING AND SOFTWARE ARCHITECTURE"
    },
    {
        position: "37.5%",
        text: "IN 2020 STARTED MY TECHNICAL HIGH SCHOOL DEGREE IN WEB DEVELOPMENT AT ETEC"
    },
    {
        position: "62.5%",
        text: "IN 2023 ENROLLED IN SYSTEMS ANALYSIS AND DEVELOPMENT AT FATEC COLLEGE"
    }
];

// Telegraph pole SVG — drawn inline so no extra asset needed
const TelegraphPole = () => (
    <svg
        viewBox="0 0 40 180"
        width="150"
        height="500"
        className="absolute bottom-0 pointer-events-none"
        style={{ filter: "brightness(0.3) contrast(1.4)" }}
    >
        {/* Main pole */}
        <rect x="18" y="10" width="4" height="170" fill="#1a1a1a" rx="1" />
        {/* Cross arm */}
        <rect x="4" y="20" width="32" height="3" fill="#1a1a1a" rx="1" />
        {/* Insulators */}
        <ellipse cx="8" cy="20" rx="3" ry="4" fill="#1a1a1a" />
        <ellipse cx="32" cy="20" rx="3" ry="4" fill="#1a1a1a" />
        {/* Ground hint */}
        <rect x="14" y="175" width="12" height="3" fill="#1a1a1a" rx="1" opacity="0.5" />
    </svg>
);

// Cactus SVG — drawn inline
const Cactus = ({ height = 120, className = "", style }: { height?: number; className?: string; style?: React.CSSProperties; }) => (
    <svg
        viewBox="0 0 60 140"
        width={height * 0.43}
        height={height}
        className={`absolute bottom-0 pointer-events-none ${className}`}
        style={{
            filter: "brightness(0.25) contrast(1.5)",
            ...style
        }}
    >
        <rect x="24" y="20" width="12" height="120" fill="#1a1a1a" rx="6" />
        <rect x="4" y="55" width="12" height="50" fill="#1a1a1a" rx="6" />
        <rect x="4" y="50" width="30" height="10" fill="#1a1a1a" rx="5" />
        <rect x="44" y="70" width="12" height="40" fill="#1a1a1a" rx="6" />
        <rect x="30" y="65" width="30" height="10" fill="#1a1a1a" rx="5" />
    </svg>
);

// Small distant bird — pure SVG path
const Bird = ({ style }: { style: React.CSSProperties }) => (
    <svg
        viewBox="0 0 24 10"
        width="24"
        height="10"
        className="absolute pointer-events-none"
        style={{ opacity: 0.18, ...style }}
    >
        <path d="M0 5 Q4 0 8 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10 5 Q14 0 18 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

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

    // New refs for additional animated elements
    const dustRef = useRef<HTMLDivElement>(null);
    const bird1Ref = useRef<SVGSVGElement>(null);
    const bird2Ref = useRef<SVGSVGElement>(null);
    const shimmer1Ref = useRef<HTMLDivElement>(null);
    const shimmer2Ref = useRef<HTMLDivElement>(null);
    const filmBurnRef = useRef<HTMLDivElement>(null);
    const scratchRef = useRef<HTMLDivElement>(null);

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

        tl.to(trackRef.current, {
            x: -(totalWidth - window.innerWidth),
            ease: "none",
        }, 0);

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${totalWidth}`,
            scrub: 0.2,
            onUpdate: (self) => {
                const progress = self.progress;
                const speed = Math.abs(progress - lastProgress);
                lastProgress = progress;

                if (speed < 0.001) return;

                const rawFrame = progress * CYCLES * TOTAL_FRAMES;
                const frame = Math.floor(rawFrame % TOTAL_FRAMES);
                const col = frame % COLS;
                const row = Math.floor(frame / COLS);
                const x = col * FRAME_WIDTH;
                const y = row * FRAME_HEIGHT;
                gsap.set(charRef.current, {
                    backgroundPosition: `-${Math.round(x)}px -${Math.round(y)}px`,
                });

                // Dust intensity tied to speed
                if (dustRef.current) {
                    gsap.to(dustRef.current, {
                        opacity: Math.min(speed * 80, 0.55),
                        duration: 0.15,
                    });
                }

                const isEnding = progress > 0.85;
                const intensity = isEnding ? (progress - 0.85) / 0.15 : 0;

                // 1. NOISE LAYERS
                if (isEnding) {
                    gsap.to(noiseBWRef.current, { opacity: intensity * 0.9, duration: 0.05 });
                    gsap.to(noiseColorRef.current, { opacity: intensity * 0.4, duration: 0.05 });
                    gsap.to(noiseBWRef.current, {
                        backgroundPosition: `${Math.random() * 100}% ${Math.random() * 100}%`,
                        duration: 0.1,
                        overwrite: true,
                    });
                    gsap.to(noiseColorRef.current, {
                        backgroundPosition: `${Math.random() * 100}% ${Math.random() * 100}%`,
                        duration: 0.1,
                        overwrite: true,
                    });
                } else {
                    gsap.to(noiseBWRef.current, { opacity: 0, duration: 0.2 });
                    gsap.to(noiseColorRef.current, { opacity: 0, duration: 0.2 });
                }

                // 2. SCANLINES
                if (isEnding) {
                    gsap.to(scanlinesRef.current, {
                        opacity: 0.4 + intensity * 0.6,
                        backgroundSize: `100% ${4 + intensity * 8}px`,
                        duration: 0.1,
                    });
                } else {
                    gsap.to(scanlinesRef.current, { opacity: 0.2, backgroundSize: "100% 4px", duration: 0.2 });
                }

                // 3. VIGNETTE
                if (isEnding) {
                    gsap.to(vignetteRef.current, { opacity: intensity * 0.8, duration: 0.1 });
                } else {
                    gsap.to(vignetteRef.current, { opacity: 0, duration: 0.2 });
                }

                // 4. FLICKER CRT
                if (isEnding && Math.random() < 0.4) {
                    gsap.to(flickerRef.current, {
                        opacity: 0.3 + Math.random() * 0.5,
                        duration: 0.05,
                        yoyo: true,
                        repeat: 1,
                    });
                } else {
                    gsap.to(flickerRef.current, { opacity: 0, duration: 0.1 });
                }

                // 5. BACKGROUND DEGRADATION
                if (isEnding) {
                    gsap.to(trackRef.current, {
                        filter: `brightness(${1.2 - intensity * 0.6}) contrast(${0.7 - intensity * 0.4}) grayscale(${intensity * 0.6}) blur(${intensity * 2}px) hue-rotate(${intensity * 15}deg)`,
                        duration: 0.1,
                    });
                } else {
                    gsap.to(trackRef.current, { filter: "brightness(1.1) contrast(0.5)", duration: 0.2 });
                }

                // 6. CHARACTER DEGRADATION
                if (isEnding) {
                    gsap.to(charRef.current, {
                        opacity: 1 - intensity * 0.7,
                        filter: `contrast(${1 + intensity * 1.5}) brightness(${1 - intensity * 0.3})`,
                        duration: 0.1,
                    });
                } else {
                    gsap.to(charRef.current, { opacity: 1, filter: "contrast(0.65) brightness(1.1)", duration: 0.2 });
                }

                // 7. FLICKERING
                if (isEnding) {
                    gsap.to(sectionRef.current, {
                        opacity: 0.85 + Math.random() * 0.2,
                        duration: 0.05,
                        overwrite: true,
                    });
                } else {
                    gsap.to(sectionRef.current, { opacity: 1, duration: 0.2 });
                }

                // 8. BLACKOUT
                if (progress > 0.92) {
                    const blackoutIntensity = (progress - 0.92) / 0.08;
                    gsap.to(blackoutRef.current, { opacity: Math.min(1, blackoutIntensity * 1.2), duration: 0.1 });
                    gsap.to(trackRef.current, { opacity: 1 - blackoutIntensity, duration: 0.1 });
                    gsap.to(charRef.current, { opacity: 1 - blackoutIntensity, duration: 0.1 });
                } else {
                    gsap.to(blackoutRef.current, { opacity: 0, duration: 0.2 });
                }

                // 9. FILM BURN (new) — appears as ending approaches
                if (filmBurnRef.current) {
                    if (isEnding) {
                        gsap.to(filmBurnRef.current, { opacity: intensity * 0.6, duration: 0.08 });
                    } else {
                        gsap.to(filmBurnRef.current, { opacity: 0, duration: 0.3 });
                    }
                }

                // 10. FILM SCRATCH (new) — random vertical line that flickers
                if (scratchRef.current && Math.random() < 0.05) {
                    const x = 20 + Math.random() * 60;
                    gsap.set(scratchRef.current, { left: `${x}%`, opacity: 0.3 + Math.random() * 0.4 });
                    gsap.to(scratchRef.current, { opacity: 0, duration: 0.12, delay: 0.05 });
                }
            },
        });

        // ORIGINAL GLITCH
        const glitch = () => {
            if (!trackRef.current) return;
            const glitchTl = gsap.timeline();
            glitchTl
                .to(trackRef.current, { x: "+=4", duration: 0.04 })
                .to(trackRef.current, { x: "-=8", duration: 0.04 })
                .to(trackRef.current, { x: "+=4", duration: 0.04 })
                .to(trackRef.current, { filter: "brightness(1.3) contrast(0.6)", duration: 0.05 })
                .to(trackRef.current, { filter: "brightness(1.1) contrast(0.5)", duration: 0.1 });
        };
        const glitchInterval = setInterval(() => {
            if (Math.random() < 0.2) glitch();
        }, 2000);

        // ORIGINAL TUMBLEWEED
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
                onComplete: () => {
                    gsap.set(el, { opacity: 0 });
                }
            });
            tw.to(el, { x: -200, duration, ease: "power2.in" }, 0);
            tw.to(el, { y: midY, duration: duration * 0.4, ease: "power1.out" }, 0);
            tw.to(el, { y: endY, duration: duration * 0.6, ease: "bounce.out" }, duration * 0.4);
            tw.to(el, { rotation: -1080, duration, ease: "none" }, 0);
        };
        const tumbleInterval = setInterval(() => {
            if (Math.random() < 0.3) spawnTumbleweed();
        }, 3000);

        // NEW: BIRDS — loop across screen slowly
        const animateBird = (el: SVGSVGElement | null, delay: number, duration: number, yPos: number) => {
            if (!el) return;
            gsap.set(el, { x: window.innerWidth + 60, y: yPos, opacity: 0.18 });
            const loop = () => {
                gsap.fromTo(
                    el,
                    { x: window.innerWidth + 60 },
                    {
                        x: -60,
                        duration,
                        ease: "none",
                        delay,
                        onComplete: loop,
                    }
                );
            };
            loop();
        };
        animateBird(bird1Ref.current, 2, 18, window.innerHeight * 0.12);
        animateBird(bird2Ref.current, 8, 26, window.innerHeight * 0.18);

        // NEW: HEAT SHIMMER — oscillating horizontal lines near horizon
        const shimmerLoop = (el: HTMLDivElement | null, phaseOffset: number) => {
            if (!el) return;
            gsap.to(el, {
                scaleX: 0.6 + Math.random() * 0.4,
                opacity: 0.04 + Math.random() * 0.06,
                duration: 1.4 + Math.random(),
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: phaseOffset,
            });
        };
        shimmerLoop(shimmer1Ref.current, 0);
        shimmerLoop(shimmer2Ref.current, 0.7);

        return () => {
            clearInterval(glitchInterval);
            clearInterval(tumbleInterval);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-[#dcd5c5]">

            {/* ── FILM STRIP PERFORATIONS (left & right edges, fixed to viewport) ── */}
            <div className="absolute left-0 top-0 bottom-0 w-5 z-50 pointer-events-none flex flex-col justify-around py-2"
                style={{ background: "rgba(0,0,0,0.82)" }}>
                {Array.from({ length: 22 }).map((_, i) => (
                    <div key={i} className="mx-auto rounded-sm"
                        style={{ width: 10, height: 8, background: "rgba(220,213,197,0.1)", border: "1px solid rgba(220,213,197,0.06)" }} />
                ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-5 z-50 pointer-events-none flex flex-col justify-around py-2"
                style={{ background: "rgba(0,0,0,0.82)" }}>
                {Array.from({ length: 22 }).map((_, i) => (
                    <div key={i} className="mx-auto rounded-sm"
                        style={{ width: 10, height: 8, background: "rgba(220,213,197,0.1)", border: "1px solid rgba(220,213,197,0.06)" }} />
                ))}
            </div>

            {/* ── FILM FRAME COUNTER (top-left corner, fixed) ── */}
            <div className="absolute top-3 left-8 z-50 pointer-events-none select-none"
                style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", color: "rgba(220,213,197,0.25)" }}>
                JOURNEY // GH-2026 // FR 00
            </div>

            {/* ── FILM SCRATCH — single vertical line that flickers ── */}
            <div
                ref={scratchRef}
                className="absolute top-0 bottom-0 z-45 pointer-events-none opacity-0"
                style={{ width: 1, background: "rgba(220,213,197,0.55)", mixBlendMode: "screen" }}
            />

            {/* ── FILM BURN — radial hotspot that appears near the end ── */}
            <div
                ref={filmBurnRef}
                className="absolute pointer-events-none opacity-0"
                style={{
                    zIndex: 41,
                    top: "30%", right: "8%",
                    width: 180, height: 180,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,255,240,0.65) 0%, rgba(200,190,150,0.3) 40%, transparent 70%)",
                    mixBlendMode: "screen",
                }}
            />

            {/* ── BIRDS (fixed to viewport, fly across slowly) ── */}
            <svg ref={bird1Ref} viewBox="0 0 44 12" width="44" height="12"
                className="absolute z-15 pointer-events-none" style={{ opacity: 0.18 }}>
                <path d="M0 6 Q5 0 10 6" fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M13 6 Q18 0 23 6" fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <svg ref={bird2Ref} viewBox="0 0 32 10" width="32" height="10"
                className="absolute z-15 pointer-events-none" style={{ opacity: 0.13 }}>
                <path d="M0 5 Q4 0 8 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M10 5 Q14 0 18 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            {/* ── HEAT SHIMMER LINES near the horizon ── */}
            <div ref={shimmer1Ref} className="absolute pointer-events-none z-8"
                style={{
                    bottom: "28%", left: 0, right: 0, height: 1,
                    background: "linear-gradient(to right, transparent, rgba(220,213,197,0.18), transparent)",
                    transformOrigin: "center",
                }} />
            <div ref={shimmer2Ref} className="absolute pointer-events-none z-8"
                style={{
                    bottom: "26%", left: 0, right: 0, height: 1,
                    background: "linear-gradient(to right, transparent, rgba(220,213,197,0.12), transparent)",
                    transformOrigin: "center",
                }} />

            {/* ── DUST CLOUD near character feet ── */}
            <div
                ref={dustRef}
                className="absolute z-18 pointer-events-none opacity-0"
                style={{
                    bottom: "0%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 120,
                    height: 28,
                    background: "radial-gradient(ellipse, rgba(180,170,150,0.7) 0%, transparent 70%)",
                    filter: "blur(6px)",
                }}
            />

            {/* ── HORIZON LINE ── */}
            <div className="absolute pointer-events-none z-6"
                style={{
                    bottom: "32%", left: 0, right: 0,
                    height: 1,
                    background: "rgba(0,0,0,0.08)",
                }} />

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
                style={{
                    background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 2px, transparent 4px)",
                    backgroundSize: "100% 4px",
                }} />

            {/* VIGNETTE */}
            <div ref={vignetteRef} className="absolute inset-0 pointer-events-none z-30 opacity-0"
                style={{ background: "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)" }} />

            {/* FLICKER CRT */}
            <div ref={flickerRef} className="absolute inset-0 pointer-events-none z-40 opacity-0 bg-black" />

            {/* ── BACKGROUND TRACK ── */}
            <div
                ref={trackRef}
                className="h-full relative"
                style={{
                    width: "400vw",
                    backgroundImage: "url('/images/background-journey.png')",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(1.6) contrast(0.3)",
                    backgroundSize: "cover",
                    backgroundPosition: "left 60%",
                }}
            >

                {/* ── DISTANT BIRDS inside the track (parallax with bg) ── */}
                <Bird style={{ top: "14%", left: "8%" }} />
                <Bird style={{ top: "10%", left: "31%", width: 18, height: 8 }} />
                <Bird style={{ top: "16%", left: "58%" }} />
                <Bird style={{ top: "11%", left: "77%", width: 16, height: 7 }} />

                {/* ── GROUND CRACKS — purely CSS divs ── */}
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
                    <div
                        key={i}
                        className="absolute pointer-events-none"
                        style={{
                            left: crack.left,
                            bottom: crack.bottom,
                            width: crack.w,
                            height: 1,
                            background: "rgba(0,0,0,0.14)",
                            transform: `rotate(${crack.rot}deg)`,
                            zIndex: 5,
                        }}
                    />
                ))}

                {/* ── JOURNEY CHECKPOINTS (original, unchanged) ── */}
                {SIGNPOSTS.map((sign, index) => (
                    <div
                        key={index}
                        className="absolute top-20 -translate-x-1/2 flex flex-col items-center"
                        style={{ left: sign.position }}
                    >
                        <div className="absolute top-10 -translate-x-1/2 flex flex-col items-center group" style={{ left: sign.position }}>
                            <div className="w-4 h-4 bg-zinc-900 rounded-full shadow-lg mb-[-8px] z-30 border-2 border-zinc-700 flex items-center justify-center">
                                <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                            </div>

                            <div className="bg-[#e8e2d2] text-[#1a1a1a] p-8 shadow-[12px_12px_0px_rgba(0,0,0,0.25)] border-2 border-[#8c826b] w-[450px] rotate-[-1deg] relative overflow-hidden transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
                                <div className="absolute inset-0 opacity-[0.08] z-[30] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none scale-150">
                                    <p className="title text-[120px] font-black">VT</p>
                                </div>

                                {/* ── YEAR STAMP (new) — large numeral watermark behind content ── */}
                                <div
                                    className="absolute top-2 right-3 select-none pointer-events-none"
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: 64,
                                        fontWeight: 900,
                                        color: "rgba(0,0,0,0.04)",
                                        lineHeight: 1,
                                        letterSpacing: "-0.04em",
                                    }}
                                >
                                    {index === 0 ? "2019" : index === 1 ? "2020" : "2023"}
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
                                    <p className="font-mono text-[8px] opacity-50">Authorized: Overseer Barros</p>

                                    <div className="rotate-[-10deg] border-2 border-black text-black px-3 py-1 text-[10px] font-black rounded-sm uppercase tracking-tighter shadow-sm bg-[#e8e2d2]">
                                        Confidential
                                    </div>
                                </div>

                                {/* ── TAPE STRIP on top of card ── */}
                                <div
                                    className="absolute pointer-events-none"
                                    style={{
                                        top: -10,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: 44,
                                        height: 18,
                                        background: "rgba(220,210,180,0.55)",
                                        border: "1px solid rgba(180,160,120,0.35)",
                                        zIndex: 40,
                                    }}
                                />
                            </div>

                            <div className="w-[6px] h-32 bg-gradient-to-b from-black/30 to-transparent opacity-20 blur-[1px]"></div>
                        </div>
                        <div className="w-[2px] h-20 bg-black/20 border-l border-dashed border-black/40"></div>
                    </div>
                ))}
            </div>

            {/* TUMBLEWEED */}
            <div ref={tumbleweedRef} className="absolute bottom-10 left-0 z-10 pointer-events-none opacity-0">
                <img src="/images/tumbleweed.png" alt="tumbleweed" className="w-16 opacity-60" />
            </div>

            {/* CHARACTER */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ bottom: "0px" }}>
                <div
                    ref={charRef}
                    style={{
                        width: FRAME_WIDTH,
                        height: FRAME_HEIGHT,
                        backgroundImage: "url('/images/journey-sprite-sheet.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "2028px 3240px",
                        transform: "scale(0.55)",
                        transformOrigin: "bottom",
                        filter: "contrast(0.7) brightness(1.1)"
                    }}
                />
            </div>

            {/* ── SCROLL HINT — blinks and fades after first scroll ── */}
            <div
                className="absolute bottom-6 right-8 z-50 pointer-events-none select-none"
                style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    color: "rgba(0,0,0,0.28)",
                    animation: "pulse 2s ease-in-out infinite",
                }}
            >
                SCROLL ▶▶
            </div>

            {/* ── TIMELINE BAR — bottom, fixed, shows 3 year markers ── */}
            <div className="absolute bottom-4 left-10 right-10 z-50 pointer-events-none" style={{ height: 1, background: "rgba(0,0,0,0.1)" }}>
                {[
                    { left: "12.5%", year: "2019" },
                    { left: "37.5%", year: "2020" },
                    { left: "62.5%", year: "2023" },
                ].map(({ left, year }) => (
                    <div key={year} className="absolute" style={{ left, transform: "translateX(-50%)" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(0,0,0,0.3)", marginTop: -2 }} />
                        <p style={{ fontFamily: "monospace", fontSize: 7, color: "rgba(0,0,0,0.3)", marginTop: 4, letterSpacing: "0.1em" }}>{year}</p>
                    </div>
                ))}
            </div>

            {/* WATERMARK */}
            <div className="absolute bottom-10 right-10 rotate-12 opacity-10 select-none pointer-events-none">
                <p className="text-6xl font-black title">TOP SECRET</p>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.28; }
                    50% { opacity: 0.65; }
                }
            `}</style>
        </section>
    );
};