"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

// ── Sprite constants ──
const TOTAL_FRAMES = 36;
const COLS         = 6;
const ROWS         = 6;
const FRAME_WIDTH  = 2028 / COLS;  // 338px
const FRAME_HEIGHT = 3240 / ROWS;  // 540px
const CYCLES       = 4;
const TRACK_MULT   = 4; // track is 400vw

const YEAR_THRESHOLDS = [
    { from: 0,    to: 0.26, year: "2019" },
    { from: 0.26, to: 0.52, year: "2020" },
    { from: 0.52, to: 1.00, year: "2023" },
];

// ── Visual-only breakpoint hook ──
function useBreakpoint() {
    const [bp, setBp] = useState({
        w: 0,
        isMobile:  false,
        isTablet:  false,
        showHUD:   true,
        showRuler: true,
    });

    useEffect(() => {
        const measure = () => {
            const w = document.documentElement.clientWidth;
            setBp({
                w,
                isMobile:  w < 640,
                isTablet:  w >= 640 && w < 1024,
                showHUD:   w >= 480,
                showRuler: w >= 360,
            });
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(document.documentElement);
        return () => ro.disconnect();
    }, []);

    return bp;
}

// ── Sub-components ──

const Compass = ({
    needleRef,
    small = false,
}: {
    needleRef: React.RefObject<SVGGElement | null>;
    small?: boolean;
}) => {
    const size = small ? 64 : 88;
    return (
        <div
            className="absolute bottom-4 left-4 z-50 pointer-events-none select-none sm:bottom-8 sm:left-8"
            style={{ width: size, height: size + 12 }}
        >
            <svg viewBox="0 0 88 88" width={size} height={size}>
                <circle cx="44" cy="44" r="41" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" />
                <circle cx="44" cy="44" r="38" fill="rgba(220,213,197,0.06)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
                <circle cx="44" cy="44" r="32" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
                {Array.from({ length: 36 }).map((_, i) => {
                    const angle = (i * 10 * Math.PI) / 180;
                    const isMaj = i % 9 === 0;
                    const isMid = i % 3 === 0 && !isMaj;
                    const inner = isMaj ? 30 : isMid ? 33 : 35;
                    return (
                        <line key={i}
                            x1={44 + inner * Math.sin(angle)} y1={44 - inner * Math.cos(angle)}
                            x2={44 + 37   * Math.sin(angle)} y2={44 - 37   * Math.cos(angle)}
                            stroke="rgba(0,0,0,0.45)"
                            strokeWidth={isMaj ? 1.2 : isMid ? 0.7 : 0.4}
                        />
                    );
                })}
                <text x="44" y="17" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="700" fill="rgba(0,0,0,0.75)">N</text>
                <text x="44" y="77" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(0,0,0,0.4)">S</text>
                <text x="74" y="47" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(0,0,0,0.4)">E</text>
                <text x="14" y="47" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(0,0,0,0.4)">W</text>
                <text x="67" y="24" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="rgba(0,0,0,0.25)">NE</text>
                <text x="67" y="68" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="rgba(0,0,0,0.25)">SE</text>
                <text x="21" y="24" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="rgba(0,0,0,0.25)">NW</text>
                <text x="21" y="68" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="rgba(0,0,0,0.25)">SW</text>
                <g ref={needleRef} style={{ transformOrigin: "44px 44px" }}>
                    <polygon points="44,13 47.5,44 44,51 40.5,44" fill="rgba(0,0,0,0.78)" />
                    <polygon points="44,51 47.5,44 44,75 40.5,44" fill="rgba(0,0,0,0.2)" />
                    <line x1="44" y1="13" x2="44" y2="22" stroke="rgba(220,213,197,0.3)" strokeWidth="0.8" />
                </g>
                <circle cx="44" cy="44" r="4" fill="rgba(220,213,197,0.9)" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
                <circle cx="44" cy="44" r="1.5" fill="rgba(0,0,0,0.6)" />
                {([[44,27,44,31],[44,57,44,61],[27,44,31,44],[57,44,61,44]] as number[][]).map(([x1,y1,x2,y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                ))}
            </svg>
            {/* BEARING is a compass direction label — intentionally not translated */}
            <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 7, letterSpacing: "0.14em", color: "rgba(0,0,0,0.28)", marginTop: 2 }}>
                BEARING
            </div>
        </div>
    );
};

const Ruler = ({ progress, isMobile, kmLabel }: { progress: number; isMobile: boolean; kmLabel: string }) => {
    const TICKS  = isMobile ? 30 : 60;
    const active = Math.round(progress * TICKS);
    const margin = isMobile ? 8 : 40;

    return (
        <div className="absolute z-50 pointer-events-none select-none"
            style={{ bottom: isMobile ? 36 : 52, left: margin, right: margin, height: 28 }}>
            <div style={{ position: "absolute", inset: 0, borderLeft: "1px solid rgba(0,0,0,0.2)", borderRight: "1px solid rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(0,0,0,0.2)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", alignItems: "flex-end", height: "100%" }}>
                {Array.from({ length: TICKS + 1 }).map((_, i) => {
                    const maj = i % (isMobile ? 5 : 10) === 0;
                    const mid = i % (isMobile ? 2 : 5) === 0 && !maj;
                    const h   = maj ? 14 : mid ? 9 : 4;
                    const act = i === active;
                    return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                            {maj && (
                                <span style={{ fontFamily: "monospace", fontSize: 5, lineHeight: 1, marginBottom: 2, color: act ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.22)", transition: "color 0.2s" }}>
                                    {i}
                                </span>
                            )}
                            <div style={{ width: act ? 2 : 1, height: act ? h + 4 : h, background: act ? "rgba(0,0,0,0.7)" : maj ? "rgba(0,0,0,0.35)" : mid ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.12)", transition: "height 0.12s, background 0.12s" }} />
                        </div>
                    );
                })}
            </div>
            <div style={{ position: "absolute", bottom: 18, left: `${progress * 100}%`, transform: "translateX(-50%)", fontFamily: "monospace", fontSize: 7, color: "rgba(0,0,0,0.45)", transition: "left 0.08s linear", lineHeight: 1 }}>
                ▲
            </div>
            {!isMobile && (
                <div style={{ position: "absolute", top: 0, right: -22, fontFamily: "monospace", fontSize: 6, letterSpacing: "0.08em", color: "rgba(0,0,0,0.25)", lineHeight: 1 }}>
                    {kmLabel}
                </div>
            )}
        </div>
    );
};

const YearDisplay = ({ year, isMobile, yearLabel }: { year: string; isMobile: boolean; yearLabel: string }) => (
    <div className="absolute z-50 pointer-events-none select-none"
        style={{ top: isMobile ? 10 : 18, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: isMobile ? 14 : 24, height: 1, background: "rgba(0,0,0,0.22)" }} />
            <span style={{ fontFamily: "monospace", fontSize: isMobile ? 6 : 7, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)" }}>{yearLabel}</span>
            <div style={{ width: isMobile ? 14 : 24, height: 1, background: "rgba(0,0,0,0.22)" }} />
        </div>
        <div
            key={year}
            className="title"
            style={{ fontSize: "clamp(36px, 8vw, 86px)", fontWeight: 900, lineHeight: 1, color: "rgba(0,0,0,0.51)", letterSpacing: "-0.04em", animation: "yearIn 0.3s ease-out forwards" }}
        >
            {year}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 1, background: "rgba(0,0,0,0.15)" }} />
            {[0.2, 0.12, 0.07].map((op, i) => (
                <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: `rgba(0,0,0,${op})` }} />
            ))}
            <div style={{ width: 12, height: 1, background: "rgba(0,0,0,0.15)" }} />
        </div>
    </div>
);

const Bird = ({ style }: { style: React.CSSProperties }) => (
    <svg viewBox="0 0 24 10" width="24" height="10" className="absolute pointer-events-none" style={{ opacity: 0.18, ...style }}>
        <path d="M0 5 Q4 0 8 5"  fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10 5 Q14 0 18 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

type SignpostData = {
    position: string;
    year: string;
    text: string;
};

const SignpostCard = ({
    sign,
    index,
    isMobile,
    isTablet,
    cardDeptLabel,
    cardSerial,
    cardTitle,
    cardAuthorized,
    cardConfidential,
}: {
    sign: SignpostData;
    index: number;
    isMobile: boolean;
    isTablet: boolean;
    cardDeptLabel: string;
    cardSerial: string;
    cardTitle: string;
    cardAuthorized: string;
    cardConfidential: string;
}) => {
    const cardW     = isMobile ? "min(82vw, 300px)" : isTablet ? "min(72vw, 370px)" : "450px";
    const pad       = isMobile ? "p-4" : "p-8";
    const titleSize = isMobile ? "text-xl" : "text-4xl";
    const textSize  = isMobile ? "text-[11px]" : "text-[14px]";
    const topOff    = isMobile ? "top-6" : "top-10";

    return (
        <div className={`absolute ${topOff} -translate-x-1/2 flex flex-col items-center group`} style={{ left: sign.position }}>
            <div className="w-4 h-4 bg-zinc-900 rounded-full shadow-lg mb-[-8px] z-30 border-2 border-zinc-700 flex items-center justify-center" style={{ flexShrink: 0 }}>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
            </div>
            <div
                className={`bg-[#e8e2d2] text-[#1a1a1a] ${pad} shadow-[8px_8px_0px_rgba(0,0,0,0.25)] border-2 border-[#8c826b] rotate-[-1deg] relative overflow-hidden transition-all duration-300 group-hover:rotate-0 group-hover:scale-105`}
                style={{ width: cardW }}
            >
                <div className="absolute inset-0 opacity-[0.08] z-[30] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none scale-150">
                    <p className="title text-[120px] font-black">VT</p>
                </div>
                <div className="absolute top-2 right-3 select-none pointer-events-none"
                    style={{ fontFamily: "monospace", fontSize: isMobile ? 32 : 64, fontWeight: 900, color: "rgba(0,0,0,0.1)", lineHeight: 1, letterSpacing: "-0.04em" }}>
                    {sign.year}
                </div>
                <div className="flex justify-between items-center border-b-4 border-black mb-4 pb-2">
                    <div className="flex flex-col">
                        <p className="font-mono text-[9px] font-black uppercase tracking-widest">{cardDeptLabel}</p>
                        <p className="font-mono text-[8px] opacity-60">{cardSerial}</p>
                    </div>
                    <p className="font-mono text-[12px] font-black tracking-tighter italic bg-black text-[#e8e2d2] px-2 uppercase">Ref_0{index + 1}</p>
                </div>
                <div className="text-center mb-4">
                    <h2 className={`title ${titleSize} font-black tracking-tighter leading-none uppercase border-y-2 border-black/10 py-2`}>
                        {cardTitle}
                    </h2>
                </div>
                <div className="relative z-10 px-2">
                    <p className={`subtitle ${textSize} font-black uppercase leading-tight text-center tracking-normal`}>
                        "{sign.text}"
                    </p>
                </div>
                <div className="mt-6 pt-3 border-t border-black/10 flex justify-between items-center italic">
                    <p className="font-mono text-[7px] opacity-50">{cardAuthorized}</p>
                    <div className="rotate-[-10deg] border-2 border-black text-black px-2 py-1 text-[9px] font-black rounded-sm uppercase tracking-tighter shadow-sm bg-[#e8e2d2]">
                        {cardConfidential}
                    </div>
                </div>
                <div className="absolute pointer-events-none"
                    style={{ top: -10, left: "50%", transform: "translateX(-50%)", width: 44, height: 18, background: "rgba(220,210,180,0.55)", border: "1px solid rgba(180,160,120,0.35)", zIndex: 40 }} />
            </div>
            <div className="w-[6px] h-20 bg-gradient-to-b from-black/30 to-transparent opacity-20 blur-[1px]" />
        </div>
    );
};

// ─── Main component ──
export const JourneySection = () => {
    const { t } = useLanguage();
    const jt = t.journey;

    // ── Build signposts from translations ──
    const SIGNPOSTS: SignpostData[] = jt.signposts.map((s, i) => ({
        position: ["12.5%", "37.5%", "62.5%"][i],
        year: s.year,
        text: s.text,
    }));

    // Visual breakpoints — purely for rendering, never touches GSAP
    const { isMobile, isTablet, showHUD, showRuler } = useBreakpoint();

    // Scroll state — driven by GSAP only
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeYear, setActiveYear]         = useState("----");

    const charScale = isMobile ? 0.52 : isTablet ? 0.40 : 0.55;

    // DOM refs
    const sectionRef       = useRef<HTMLElement>(null);
    const trackRef         = useRef<HTMLDivElement>(null);
    const charRef          = useRef<HTMLDivElement>(null);
    const tumbleweedRef    = useRef<HTMLDivElement>(null);
    const noiseBWRef       = useRef<HTMLDivElement>(null);
    const noiseColorRef    = useRef<HTMLDivElement>(null);
    const scanlinesRef     = useRef<HTMLDivElement>(null);
    const vignetteRef      = useRef<HTMLDivElement>(null);
    const flickerRef       = useRef<HTMLDivElement>(null);
    const blackoutRef      = useRef<HTMLDivElement>(null);
    const dustRef          = useRef<HTMLDivElement>(null);
    const bird1Ref         = useRef<SVGSVGElement>(null);
    const bird2Ref         = useRef<SVGSVGElement>(null);
    const shimmer1Ref      = useRef<HTMLDivElement>(null);
    const shimmer2Ref      = useRef<HTMLDivElement>(null);
    const filmBurnRef      = useRef<HTMLDivElement>(null);
    const scratchRef       = useRef<HTMLDivElement>(null);
    const compassNeedleRef = useRef<SVGGElement>(null);

    // ── GSAP — empty deps [] — runs ONCE, never restarts ──
    useEffect(() => {
        if (!sectionRef.current || !trackRef.current || !charRef.current) return;

        // Snapshot dimensions at mount time
        const vw         = document.documentElement.clientWidth;
        const vh         = window.innerHeight;
        const totalWidth = vw * TRACK_MULT;
        let   lastProgress = 0;

        // Main scroll timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: `+=${totalWidth}`,
                scrub: 0.2,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });

        tl.to(trackRef.current, { x: -(totalWidth - vw), ease: "none" }, 0);

        // Overlay / effect driver
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${totalWidth}`,
            scrub: 0.2,
            invalidateOnRefresh: true,
            onUpdate(self) {
                const progress = self.progress;
                const speed    = Math.abs(progress - lastProgress);
                lastProgress   = progress;

                setScrollProgress(progress);
                const thr = YEAR_THRESHOLDS.find(t => progress >= t.from && progress < t.to);
                if (thr) setActiveYear(thr.year);

                if (speed < 0.001) return;

                // Sprite frame
                const frame = Math.floor((progress * CYCLES * TOTAL_FRAMES) % TOTAL_FRAMES);
                gsap.set(charRef.current, {
                    backgroundPosition: `-${Math.round((frame % COLS) * FRAME_WIDTH)}px -${Math.round(Math.floor(frame / COLS) * FRAME_HEIGHT)}px`,
                });

                // Dust
                if (dustRef.current) gsap.to(dustRef.current, { opacity: Math.min(speed * 80, 0.55), duration: 0.15 });

                // Compass needle
                if (compassNeedleRef.current) {
                    gsap.to(compassNeedleRef.current, {
                        rotation: Math.sin(progress * Math.PI * 6) * 12 + (speed > 0.002 ? (Math.random() - 0.5) * 8 : 0),
                        duration: 0.4,
                        ease: "elastic.out(1,0.5)",
                    });
                }

                const isEnding  = progress > 0.85;
                const intensity = isEnding ? (progress - 0.85) / 0.15 : 0;

                // Noise
                if (isEnding) {
                    gsap.to(noiseBWRef.current,    { opacity: intensity * 0.9, duration: 0.05 });
                    gsap.to(noiseColorRef.current, { opacity: intensity * 0.4, duration: 0.05 });
                    gsap.to(noiseBWRef.current,    { backgroundPosition: `${Math.random() * 100}% ${Math.random() * 100}%`, duration: 0.1, overwrite: true });
                    gsap.to(noiseColorRef.current, { backgroundPosition: `${Math.random() * 100}% ${Math.random() * 100}%`, duration: 0.1, overwrite: true });
                } else {
                    gsap.to(noiseBWRef.current,    { opacity: 0, duration: 0.2 });
                    gsap.to(noiseColorRef.current, { opacity: 0, duration: 0.2 });
                }

                // Scanlines
                gsap.to(scanlinesRef.current, isEnding
                    ? { opacity: 0.4 + intensity * 0.6, backgroundSize: `100% ${4 + intensity * 8}px`, duration: 0.1 }
                    : { opacity: 0.2, backgroundSize: "100% 4px", duration: 0.2 });

                // Vignette
                gsap.to(vignetteRef.current, { opacity: isEnding ? intensity * 0.8 : 0, duration: isEnding ? 0.1 : 0.2 });

                // Flicker
                if (isEnding && Math.random() < 0.4) {
                    gsap.to(flickerRef.current, { opacity: 0.3 + Math.random() * 0.5, duration: 0.05, yoyo: true, repeat: 1 });
                } else {
                    gsap.to(flickerRef.current, { opacity: 0, duration: 0.1 });
                }

                // BG degradation
                gsap.to(trackRef.current, isEnding
                    ? { filter: `brightness(${1.2 - intensity * 0.6}) contrast(${0.7 - intensity * 0.4}) grayscale(${intensity * 0.6}) blur(${intensity * 2}px) hue-rotate(${intensity * 15}deg)`, duration: 0.1 }
                    : { filter: "brightness(1.1) contrast(0.5)", duration: 0.2 });

                // Char degradation
                gsap.to(charRef.current, isEnding
                    ? { opacity: 1 - intensity * 0.7, filter: `contrast(${1 + intensity * 1.5}) brightness(${1 - intensity * 0.3})`, duration: 0.1 }
                    : { opacity: 1, filter: "contrast(0.65) brightness(1.1)", duration: 0.2 });

                // Section flicker
                if (isEnding) {
                    gsap.to(sectionRef.current, { opacity: 0.85 + Math.random() * 0.2, duration: 0.05, overwrite: true });
                } else {
                    gsap.to(sectionRef.current, { opacity: 1, duration: 0.2 });
                }

                // Blackout
                if (progress > 0.92) {
                    const bi = (progress - 0.92) / 0.08;
                    gsap.to(blackoutRef.current, { opacity: Math.min(1, bi * 1.2), duration: 0.1 });
                    gsap.to(trackRef.current,    { opacity: 1 - bi, duration: 0.1 });
                    gsap.to(charRef.current,     { opacity: 1 - bi, duration: 0.1 });
                } else {
                    gsap.to(blackoutRef.current, { opacity: 0, duration: 0.2 });
                }

                // Film burn
                if (filmBurnRef.current) gsap.to(filmBurnRef.current, { opacity: isEnding ? intensity * 0.6 : 0, duration: isEnding ? 0.08 : 0.3 });

                // Film scratch
                if (scratchRef.current && Math.random() < 0.05) {
                    gsap.set(scratchRef.current, { left: `${20 + Math.random() * 60}%`, opacity: 0.3 + Math.random() * 0.4 });
                    gsap.to(scratchRef.current, { opacity: 0, duration: 0.12, delay: 0.05 });
                }
            },
        });

        // Glitch
        const glitch = () => {
            if (!trackRef.current) return;
            gsap.timeline()
                .to(trackRef.current, { x: "+=4",  duration: 0.04 })
                .to(trackRef.current, { x: "-=8",  duration: 0.04 })
                .to(trackRef.current, { x: "+=4",  duration: 0.04 })
                .to(trackRef.current, { filter: "brightness(1.3) contrast(0.6)", duration: 0.05 })
                .to(trackRef.current, { filter: "brightness(1.1) contrast(0.5)", duration: 0.1  });
        };
        const glitchInterval = setInterval(() => { if (Math.random() < 0.2) glitch(); }, 2000);

        // Tumbleweed
        const spawnTumbleweed = () => {
            const el = tumbleweedRef.current;
            if (!el) return;
            const startY   = Math.random() * 40;
            const duration = 5 + Math.random() * 3;
            gsap.killTweensOf(el);
            gsap.set(el, { x: vw + 200, y: startY, opacity: 1, rotation: 0, scale: 1.5 });
            const tw = gsap.timeline({
                onComplete: () => {
                    if (el && el.parentNode) {
                        gsap.set(el, { opacity: 0 });
                    }
                }
            });
            tw.to(el, { x: -200, duration, ease: "power2.in" }, 0);
            tw.to(el, { y: startY - (30 + Math.random() * 40), duration: duration * 0.4, ease: "power1.out"  }, 0);
            tw.to(el, { y: startY + (10 + Math.random() * 20), duration: duration * 0.6, ease: "bounce.out" }, duration * 0.4);
            tw.to(el, { rotation: -1080, duration, ease: "none" }, 0);
        };
        const tumbleInterval = setInterval(() => { if (Math.random() < 0.3) spawnTumbleweed(); }, 3000);

        // Birds
        const animateBird = (el: SVGSVGElement | null, delay: number, dur: number, y: number) => {
            if (!el) return;
            gsap.set(el, { x: vw + 60, y, opacity: 0.18 });
            const loop = () => gsap.fromTo(el, { x: vw + 60 }, { x: -60, duration: dur, ease: "none", delay, onComplete: loop });
            loop();
        };
        animateBird(bird1Ref.current, 2, 18, vh * 0.12);
        animateBird(bird2Ref.current, 8, 26, vh * 0.18);

        // Shimmer
        const shimmerLoop = (el: HTMLDivElement | null, phase: number) => {
            if (!el) return;
            gsap.to(el, { scaleX: 0.6 + Math.random() * 0.4, opacity: 0.04 + Math.random() * 0.06, duration: 1.4 + Math.random(), ease: "sine.inOut", yoyo: true, repeat: -1, delay: phase });
        };
        shimmerLoop(shimmer1Ref.current, 0);
        shimmerLoop(shimmer2Ref.current, 0.7);

        // Compass idle drift
        if (compassNeedleRef.current) {
            gsap.to(compassNeedleRef.current, { rotation: 5, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
        }

        // Resize — debounced, only refreshes layout math, never recreates triggers
        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
        };
        window.addEventListener("resize", onResize);

        return () => {
            clearInterval(glitchInterval);
            clearInterval(tumbleInterval);
            clearTimeout(resizeTimer);
            window.removeEventListener("resize", onResize);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []); // ← EMPTY — this is intentional and critical

    // ── Render ──
    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-[#afafaf]"
            style={{ height: "100dvh" }} 
        >
            <YearDisplay year={activeYear} isMobile={isMobile} yearLabel={jt.yearLabel} />

            {showHUD   && <Compass needleRef={compassNeedleRef} small={isMobile} />}
            {showRuler && <Ruler   progress={scrollProgress} isMobile={isMobile} kmLabel={jt.kmLabel} />}

            {/* Film strip — left */}
            {showHUD && (
                <div className="absolute left-0 top-0 bottom-0 w-4 md:w-5 z-50 pointer-events-none flex flex-col justify-around py-2"
                    style={{ background: "rgba(0,0,0,0.82)" }}>
                    {Array.from({ length: 22 }).map((_, i) => (
                        <div key={i} className="mx-auto rounded-sm" style={{ width: 8, height: 6, background: "rgba(220,213,197,0.1)", border: "1px solid rgba(220,213,197,0.06)" }} />
                    ))}
                </div>
            )}

            {/* Film strip — right */}
            {showHUD && (
                <div className="absolute right-0 top-0 bottom-0 w-4 md:w-5 z-50 pointer-events-none flex flex-col justify-around py-2"
                    style={{ background: "rgba(0,0,0,0.82)" }}>
                    {Array.from({ length: 22 }).map((_, i) => (
                        <div key={i} className="mx-auto rounded-sm" style={{ width: 8, height: 6, background: "rgba(220,213,197,0.1)", border: "1px solid rgba(220,213,197,0.06)" }} />
                    ))}
                </div>
            )}

            {/* Frame counter */}
            <div className="absolute top-2 z-50 pointer-events-none select-none"
                style={{ left: showHUD ? (isMobile ? "1.5rem" : "2rem") : "0.75rem", fontFamily: "monospace", fontSize: isMobile ? 7 : 9, letterSpacing: "0.12em", color: "rgba(220,213,197,0.25)" }}>
                {isMobile ? jt.frameCounterMob : jt.frameCounter}
            </div>

            {/* Film scratch */}
            <div ref={scratchRef} className="absolute top-0 bottom-0 pointer-events-none opacity-0"
                style={{ zIndex: 45, width: 1, background: "rgba(220,213,197,0.55)", mixBlendMode: "screen" }} />

            {/* Film burn */}
            <div ref={filmBurnRef} className="absolute pointer-events-none opacity-0"
                style={{ zIndex: 41, top: "30%", right: isMobile ? "4%" : "8%", width: isMobile ? 100 : 180, height: isMobile ? 100 : 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,240,0.65) 0%, rgba(200,190,150,0.3) 40%, transparent 70%)", mixBlendMode: "screen" }} />

            {/* Birds (viewport-fixed) */}
            <svg ref={bird1Ref} viewBox="0 0 44 12" width="44" height="12" className="absolute pointer-events-none" style={{ zIndex: 15, opacity: 0.18 }}>
                <path d="M0 6 Q5 0 10 6" fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M13 6 Q18 0 23 6" fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <svg ref={bird2Ref} viewBox="0 0 32 10" width="32" height="10" className="absolute pointer-events-none" style={{ zIndex: 15, opacity: 0.13 }}>
                <path d="M0 5 Q4 0 8 5"  fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M10 5 Q14 0 18 5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            {/* Heat shimmer */}
            <div ref={shimmer1Ref} className="absolute pointer-events-none"
                style={{ zIndex: 8, bottom: "28%", left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(220,213,197,0.18), transparent)", transformOrigin: "center" }} />
            <div ref={shimmer2Ref} className="absolute pointer-events-none"
                style={{ zIndex: 8, bottom: "26%", left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(220,213,197,0.12), transparent)", transformOrigin: "center" }} />

            {/* Dust cloud */}
            <div ref={dustRef} className="absolute pointer-events-none opacity-0"
                style={{ zIndex: 18, bottom: "0%", left: "50%", transform: "translateX(-50%)", width: isMobile ? 80 : 120, height: 28, background: "radial-gradient(ellipse, rgba(180,170,150,0.7) 0%, transparent 70%)", filter: "blur(6px)" }} />

            {/* Horizon line */}
            <div className="absolute pointer-events-none"
                style={{ zIndex: 6, bottom: "32%", left: 0, right: 0, height: 1, background: "rgba(0,0,0,0.08)" }} />

            {/* Overlays */}
            <div ref={blackoutRef}   className="absolute inset-0 pointer-events-none z-50 bg-black opacity-0" />
            <div ref={noiseBWRef}    className="absolute inset-0 pointer-events-none opacity-0 z-30 mix-blend-overlay"  style={{ backgroundImage: "url('/images/noise.png')",       backgroundSize: "200px", backgroundRepeat: "repeat" }} />
            <div ref={noiseColorRef} className="absolute inset-0 pointer-events-none opacity-0 z-30 mix-blend-screen"   style={{ backgroundImage: "url('/images/noise_color.png')", backgroundSize: "150px", backgroundRepeat: "repeat" }} />
            <div ref={scanlinesRef}  className="absolute inset-0 pointer-events-none z-40 opacity-20"
                style={{ background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 2px, transparent 4px)", backgroundSize: "100% 4px" }} />
            <div ref={vignetteRef}   className="absolute inset-0 pointer-events-none z-30 opacity-0"
                style={{ background: "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)" }} />
            <div ref={flickerRef}    className="absolute inset-0 pointer-events-none z-40 opacity-0 bg-black" />

            {/* ── Background track ── */}
            <div
                ref={trackRef}
                className="h-full relative"
                style={{
                    width: `${TRACK_MULT * 100}vw`,
                    backgroundImage: "url('/images/background-journey.png')",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(1.6) contrast(0.3)",
                    backgroundSize: isMobile || isTablet ? `${TRACK_MULT * 100}vw auto` : "cover",
                    backgroundPosition: isMobile || isTablet ? "left center" : "left 60%",
                }}
            >
                <Bird style={{ top: "14%", left: "8%" }} />
                <Bird style={{ top: "10%", left: "31%", width: 18, height: 8 }} />
                <Bird style={{ top: "16%", left: "58%" }} />
                <Bird style={{ top: "11%", left: "77%", width: 16, height: 7 }} />

                {[
                    { left: "5%",  bottom: "18%", w: 38, rot: -6  },
                    { left: "9%",  bottom: "12%", w: 22, rot: 14  },
                    { left: "19%", bottom: "22%", w: 50, rot: -3  },
                    { left: "33%", bottom: "14%", w: 28, rot: 9   },
                    { left: "44%", bottom: "20%", w: 42, rot: -11 },
                    { left: "57%", bottom: "10%", w: 18, rot: 7   },
                    { left: "66%", bottom: "17%", w: 34, rot: -5  },
                    { left: "76%", bottom: "24%", w: 26, rot: 12  },
                    { left: "85%", bottom: "15%", w: 48, rot: -8  },
                    { left: "92%", bottom: "20%", w: 20, rot: 4   },
                ].map((c, i) => (
                    <div key={i} className="absolute pointer-events-none"
                        style={{ left: c.left, bottom: c.bottom, width: c.w, height: 1, background: "rgba(0,0,0,0.14)", transform: `rotate(${c.rot}deg)`, zIndex: 5 }} />
                ))}

                {SIGNPOSTS.map((sign, i) => (
                    <div key={i} className="absolute top-20 -translate-x-1/2 flex flex-col items-center" style={{ left: sign.position }}>
                        <SignpostCard
                            sign={sign}
                            index={i}
                            isMobile={isMobile}
                            isTablet={isTablet}
                            cardDeptLabel={jt.cardDeptLabel}
                            cardSerial={jt.cardSerial}
                            cardTitle={jt.cardTitle}
                            cardAuthorized={jt.cardAuthorized}
                            cardConfidential={jt.cardConfidential}
                        />
                        <div className="w-[2px] h-20 bg-black/20 border-l border-dashed border-black/40" />
                    </div>
                ))}
            </div>

            {/* Tumbleweed */}
            <div ref={tumbleweedRef} className="absolute bottom-10 left-0 z-10 pointer-events-none opacity-0">
                <img src="/images/tumbleweed.png" alt="" className="opacity-60" style={{ width: isMobile ? 40 : 64 }} />
            </div>

            {/* Character sprite */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ bottom: 0 }}>
                <div
                    ref={charRef}
                    style={{
                        width: FRAME_WIDTH,
                        height: FRAME_HEIGHT,
                        backgroundImage: "url('/images/journey-sprite-sheet.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${COLS * FRAME_WIDTH}px ${ROWS * FRAME_HEIGHT}px`,
                        transform: `scale(${charScale})`,
                        transformOrigin: "bottom center",
                        filter: "contrast(0.7) brightness(1.1)",
                    }}
                />
            </div>

            {/* Scroll hint */}
            <div className="absolute z-50 pointer-events-none select-none"
                style={{ bottom: isMobile ? 8 : 6, right: showHUD ? (isMobile ? "1.5rem" : "2rem") : "0.75rem", fontFamily: "monospace", fontSize: isMobile ? 8 : 9, letterSpacing: "0.14em", color: "rgba(0,0,0,0.28)", animation: "pulse 2s ease-in-out infinite" }}>
                {isMobile ? jt.scrollHintMob : jt.scrollHint}
            </div>

            {/* Watermark */}
            {!isMobile && (
                <div className="absolute bottom-10 right-10 rotate-12 opacity-10 select-none pointer-events-none">
                    <p className="text-4xl md:text-6xl font-black title">{jt.watermark}</p>
                </div>
            )}

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.28; }
                    50%       { opacity: 0.65; }
                }
                @keyframes yearIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
            `}</style>
        </section>
    );
};