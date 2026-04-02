"use client";

import styles from "./Loader.module.css";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loader({ onFinish }: { onFinish: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [countdownFinished, setCountdownFinished] = useState(false);
    const [showCountdown, setShowCountdown] = useState(true);
    const [currentNum, setCurrentNum] = useState(3);

    const enableFlicker = true;
    const enableFilmDirt = true;
    const enableScanlines = true;
    const enableBurnEdge = true;

    // COUNTDOWN
    useEffect(() => {
        if (!showCountdown) return;

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(".countdown-wrapper", {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        setShowCountdown(false);
                        setCountdownFinished(true);
                    },
                });
            },
        });

        [3, 2, 1].forEach((num) => {
            tl.add(() => setCurrentNum(num))
                .fromTo(
                    ".global-sweeper-overlay",
                    { "--fill": "0%" },
                    { "--fill": "100%", duration: 1, ease: "none" },
                    "<"
                )
                .fromTo(
                    ".flash",
                    { opacity: 0.2 },
                    { opacity: 0, duration: 0.15 },
                    "<"
                );
        });

        return () => { tl.kill(); };
    }, [showCountdown]);

    // TEXT
    useEffect(() => {
        if (!countdownFinished) return;
        const el = containerRef.current;
        if (!el) return;

        const lines = ["WELCOME!", "I'M GUSTAVO,", "FULL STACK DEVELOPER."];

        el.innerHTML = lines.map(line =>
            `<div class="line">${line.split("").map(char =>
                `<span class="char">${char === " " ? "&nbsp;" : char}</span>`
            ).join("")}</div>`
        ).join("");

        const mainTl = gsap.timeline({
            onComplete: () => {
                gsap.to(".loader", {
                    opacity: 0,
                    duration: 1,
                    onComplete: onFinish
                });
            },
        });

        gsap.set(".char", {
            opacity: 0,
            scale: 1.2,
            filter: "blur(10px)",
            y: 20
        });

        mainTl.to(".char", {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.7,
            ease: "power4.out",
            stagger: 0.04
        })
        .to(".char", {
            x: "random(-1,1)",
            y: "random(-1,1)",
            duration: 0.1,
            repeat: 12,
            yoyo: true,
            ease: "none"
        }, "-=0.5");

    }, [countdownFinished, onFinish]);

    return (
        <div className="loader fixed inset-0 z-[9999] bg-[#0d0d0d] flex items-center justify-center overflow-hidden">

            {/* COUNTDOWN */}
            {showCountdown && (
                <div className="countdown-wrapper fixed inset-0 flex items-center justify-center z-50 bg-[#303030]">

                    <div className={`global-sweeper-overlay absolute inset-[-150%] z-0 pointer-events-none opacity-50 ${styles.globalSweeperOverlay}`} />

                    <div className="absolute inset-0 pointer-events-none z-10">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#e8e1cf] opacity-20 -translate-y-1/2" />
                        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[#e8e1cf] opacity-20 -translate-x-1/2" />
                    </div>

                    <div className="relative w-[50vh] h-[50vh] max-w-[600px] max-h-[600px] rounded-full border-[3px] border-[#e8e1cf] flex items-center justify-center bg-transparent z-20">
                        <div className="absolute w-[96%] h-[96%] border border-[#e8e1cf] opacity-20 rounded-full" />
                        <div className="absolute w-[88%] h-[88%] border border-[#e8e1cf] opacity-10 rounded-full" />

                        <span
                            className="relative z-30 text-[#f0eada] text-[35vh] leading-none tabular-nums font-normal"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                            {currentNum}
                        </span>
                    </div>

                    <div className="sweeper-line absolute top-1/2 left-1/2 w-[150vw] h-[2px] bg-[#e8e1cf] origin-left z-[60] opacity-30 -translate-y-1/2 pointer-events-none" />
                    <div className="flash absolute inset-0 bg-white pointer-events-none z-[70] opacity-0" />
                </div>
            )}

            {/* FRAME */}
            <div className={styles.frameWrapper}>
                <div className={styles.intertitleFrameImg} />
            </div>

            {/* TEXTO */}
            <div
                ref={containerRef}
                className={`title relative z-10 text-[#f0eada] text-[clamp(32px,8vw,100px)] text-left leading-[1.05] tracking-[0.02em] w-[90%] max-w-[900px] uppercase transition-opacity duration-300 ${
                    !countdownFinished ? "opacity-0" : "opacity-100"
                }`}
                style={{
                    fontFamily: "var(--font-chinese-rocks)",
                    textShadow: "4px 4px 0px rgba(0,0,0,0.8)"
                }}
            />

            {/* TEXTURAS */}
            <div className={styles.grainOverlay} />
            <div className={styles.vignette} />

            {enableFlicker && <div className={styles.flickerOverlay} />}
            {enableFilmDirt && <div className={styles.filmDirt} />}
            {enableScanlines && <div className={styles.scanlines} />}
            {enableBurnEdge && <div className={styles.burnEdge} />}
        </div>
    );
}