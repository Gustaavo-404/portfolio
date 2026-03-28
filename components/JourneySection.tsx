"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 28;
const COLS = 4;
const ROWS = 7;

const FRAME_WIDTH = 3072 / COLS;
const FRAME_HEIGHT = 3136 / ROWS;

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

                const isEnding = progress > 0.85;
                const intensity = isEnding ? (progress - 0.85) / 0.15 : 0;

                // 1. NOISE LAYERS
                if (isEnding) {
                    gsap.to(noiseBWRef.current, {
                        opacity: intensity * 0.9,
                        duration: 0.05,
                    });
                    gsap.to(noiseColorRef.current, {
                        opacity: intensity * 0.4,
                        duration: 0.05,
                    });
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
                    gsap.to(scanlinesRef.current, {
                        opacity: 0.2,
                        backgroundSize: "100% 4px",
                        duration: 0.2,
                    });
                }

                // 3. VIGNETTE
                if (isEnding) {
                    gsap.to(vignetteRef.current, {
                        opacity: intensity * 0.8,
                        duration: 0.1,
                    });
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
                        filter: `
                            brightness(${1.2 - intensity * 0.6})
                            contrast(${0.7 - intensity * 0.4})
                            grayscale(${intensity * 0.6})
                            blur(${intensity * 2}px)
                            hue-rotate(${intensity * 15}deg)
                        `,
                        duration: 0.1,
                    });
                } else {
                    gsap.to(trackRef.current, {
                        filter: "brightness(1.1) contrast(0.5)",
                        duration: 0.2,
                    });
                }

                // 6. CHARACTER DEGRADATION
                if (isEnding) {
                    gsap.to(charRef.current, {
                        opacity: 1 - intensity * 0.7,
                        filter: `contrast(${1 + intensity * 1.5}) brightness(${1 - intensity * 0.3})`,
                        duration: 0.1,
                    });
                } else {
                    gsap.to(charRef.current, {
                        opacity: 1,
                        filter: "none",
                        duration: 0.2,
                    });
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

                    gsap.to(blackoutRef.current, {
                        opacity: Math.min(1, blackoutIntensity * 1.2),
                        duration: 0.1,
                    });

                    gsap.to(trackRef.current, {
                        opacity: 1 - blackoutIntensity,
                        duration: 0.1,
                    });

                    gsap.to(charRef.current, {
                        opacity: 1 - blackoutIntensity,
                        duration: 0.1,
                    });

                } else {
                    gsap.to(blackoutRef.current, {
                        opacity: 0,
                        duration: 0.2,
                    });
                }
            },
        });

        const glitch = () => {
            if (!trackRef.current) return;
            const glitchTl = gsap.timeline();
            glitchTl.to(trackRef.current, { x: "+=4", duration: 0.04 })
                .to(trackRef.current, { x: "-=8", duration: 0.04 })
                .to(trackRef.current, { x: "+=4", duration: 0.04 })
                .to(trackRef.current, { filter: "brightness(1.3) contrast(0.6)", duration: 0.05 })
                .to(trackRef.current, { filter: "brightness(1.1) contrast(0.5)", duration: 0.1 });
        };

        const glitchInterval = setInterval(() => {
            if (Math.random() < 0.2) glitch();
        }, 2000);

        // TUMBLEWEED
        const spawnTumbleweed = () => {
            if (!tumbleweedRef.current) return;

            const el = tumbleweedRef.current;
            const startY = Math.random() * 40;
            const midY = startY - (30 + Math.random() * 40);
            const endY = startY + (10 + Math.random() * 20);
            const duration = 5 + Math.random() * 3;

            gsap.killTweensOf(el);

            gsap.set(el, {
                x: window.innerWidth + 200,
                y: startY,
                opacity: 1,
                rotation: 0,
                scale: 1.5,
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.set(el, { opacity: 0 });
                },
            });

            tl.to(el, {
                x: -200,
                duration,
                ease: "power2.in",
            }, 0);

            tl.to(el, {
                y: midY,
                duration: duration * 0.4,
                ease: "power1.out",
            }, 0);

            tl.to(el, {
                y: endY,
                duration: duration * 0.6,
                ease: "bounce.out",
            }, duration * 0.4);

            tl.to(el, {
                rotation: -1080,
                duration,
                ease: "none",
            }, 0);
        };

        const tumbleInterval = setInterval(() => {
            if (Math.random() < 0.3) {
                spawnTumbleweed();
            }
        }, 3000);

        return () => {
            clearInterval(glitchInterval);
            clearInterval(tumbleInterval);
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-[#dcd5c5]">

            {/* BLACKOUT */}
            <div
                ref={blackoutRef}
                className="absolute inset-0 pointer-events-none z-50 bg-black opacity-0"
            />

            {/* NOISE 1 */}
            <div
                ref={noiseBWRef}
                className="absolute inset-0 pointer-events-none opacity-0 z-30 mix-blend-overlay"
                style={{
                    backgroundImage: "url('/images/noise.png')",
                    backgroundSize: "200px",
                    backgroundRepeat: "repeat",
                }}
            />

            {/* NOISE 2 */}
            <div
                ref={noiseColorRef}
                className="absolute inset-0 pointer-events-none opacity-0 z-30 mix-blend-screen"
                style={{
                    backgroundImage: "url('/images/noise_color.png')",
                    backgroundSize: "150px",
                    backgroundRepeat: "repeat",
                }}
            />

            {/* SCANLINES */}
            <div
                ref={scanlinesRef}
                className="absolute inset-0 pointer-events-none z-40 opacity-20"
                style={{
                    background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 2px, transparent 4px)",
                    backgroundSize: "100% 4px",
                }}
            />

            {/* VIGNETTE */}
            <div
                ref={vignetteRef}
                className="absolute inset-0 pointer-events-none z-30 opacity-0"
                style={{
                    background: "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)",
                }}
            />

            {/* FLICKER CRT */}
            <div
                ref={flickerRef}
                className="absolute inset-0 pointer-events-none z-40 opacity-0 bg-black"
            />

            {/* BACKGROUND */}
            <div
                ref={trackRef}
                className="h-full relative"
                style={{
                    width: "400vw",
                    backgroundImage: "url('/images/background.png')",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(1.1) contrast(0.5)",
                    backgroundSize: "cover",
                    backgroundPosition: "left bottom",
                }}
            >
                {/* JOURNEY CHECKPOINTS */}
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
                                <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none scale-150">
                                    <p className="title text-[120px] font-black">VT</p>
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
                            </div>

                            <div className="w-[6px] h-32 bg-gradient-to-b from-black/30 to-transparent opacity-20 blur-[1px]"></div>
                        </div>
                        <div className="w-[2px] h-20 bg-black/20 border-l border-dashed border-black/40"></div>
                    </div>
                ))}
            </div>

            {/* TUMBLEWEED */}
            <div
                ref={tumbleweedRef}
                className="absolute bottom-10 left-0 z-10 pointer-events-none opacity-0"
            >
                <img
                    src="/images/tumbleweed.png"
                    alt="tumbleweed"
                    className="w-16 opacity-60"
                />
            </div>

            {/* CHARACTER */}
            <div
                className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                style={{ bottom: "-50px" }}
            >
                <div
                    ref={charRef}
                    className="mix-blend-multiply contrast-125 grayscale-[0.2]"
                    style={{
                        width: FRAME_WIDTH,
                        height: FRAME_HEIGHT,
                        backgroundImage: "url('/images/vaultboyspritesheet.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "3072px 3136px",
                        imageRendering: "pixelated",
                    }}
                />
            </div>

            {/* WATERMARK */}
            <div className="absolute bottom-10 right-10 rotate-12 opacity-10 select-none pointer-events-none">
                <p className="text-6xl font-black title">TOP SECRET</p>
            </div>
        </section>
    );
};