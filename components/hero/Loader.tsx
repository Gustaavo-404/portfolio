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

    // ── COUNTDOWN ──
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

    // ── INTERTITLE ──
    useEffect(() => {
        if (!countdownFinished) return;
        const el = containerRef.current;
        if (!el) return;

        el.innerHTML = `
            <div class="it-ornament subtitle">✦ ✦ ✦</div>

            <div class="it-name cursive-el">
                ${Array.from("Gustavo Barros").map(c =>
            `<span class="it-char-name">${c === " " ? "&nbsp;" : c}</span>`
        ).join("")}
            </div>

            <div class="it-divider-wrap">
                <div class="it-divider-line it-divider-left"></div>
                <span class="it-presents subtitle">presents</span>
                <div class="it-divider-line it-divider-right"></div>
            </div>

            <div class="it-title-wrap title">
                ${Array.from("FULL STACK").map(c =>
            `<span class="it-char-title">${c === " " ? "&nbsp;" : c}</span>`
        ).join("")}
                <br/>
                ${Array.from("D.E.V.E.L.O.P.E.R.").map(c =>
            `<span class="it-char-title">${c}</span>`
        ).join("")}
            </div>

            <div class="it-portfolio-wrap subtitle">
                ${Array.from("— Portfolio —").map(c =>
            `<span class="it-char-portfolio">${c === " " ? "&nbsp;" : c}</span>`
        ).join("")}
            </div>

            <div class="it-rule-wrap">
                <div class="it-rule"></div>
            </div>

            <div class="it-copyright subtitle">
                ${Array.from("Copyright © 2026").map(c =>
            `<span class="it-char-copy">${c === " " ? "&nbsp;" : c}</span>`
        ).join("")}
            </div>
        `;

        const mainTl = gsap.timeline({
            onComplete: () => {
                gsap.to(".iris-circle", {
                    attr: { r: "0%" },
                    duration: 1.1,
                    delay: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.to(".loader", {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: onFinish,
                        });
                    },
                });
            },
        });

        gsap.set(".it-ornament", { opacity: 0 });
        gsap.set(".it-char-name", { opacity: 0, y: 18, filter: "blur(6px)" });
        gsap.set(".it-presents", { opacity: 0 });
        gsap.set(".it-divider-left", { opacity: 1, scaleX: 0, transformOrigin: "right center" });
        gsap.set(".it-divider-right", { opacity: 1, scaleX: 0, transformOrigin: "left center" });
        gsap.set(".it-char-title", { opacity: 0, y: 24, filter: "blur(8px)", scale: 1.15 });
        gsap.set(".it-char-portfolio", { opacity: 0, y: 10, filter: "blur(4px)" });
        gsap.set(".it-rule", { scaleX: 0, transformOrigin: "center center" });
        gsap.set(".it-char-copy", { opacity: 0 });

        // 1. Ornament
        mainTl.to(".it-ornament", {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
        })

            // 2. Name
            .to(".it-char-name", {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.4,
                ease: "power3.out",
                stagger: 0.02,
            }, "-=0.2")

            // 3. Divider
            .to(".it-divider-left, .it-divider-right", {
                scaleX: 1,
                duration: 0.4,
                ease: "power2.inOut",
                stagger: 0.1
            }, "-=0.1")
            .to(".it-presents", {
                opacity: 1,
                duration: 0.2,
                ease: "power2.out",
            }, "-=0.3")

            // 4. Full Stack Developer
            .to(".it-char-title", {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.5,
                ease: "expo.out",
                stagger: 0.02,
            }, "-=0.2")

            // 5. Tremor
            .to(".it-char-title", {
                x: "random(-1.5, 1.5)",
                y: "random(-1, 1)",
                duration: 0.08,
                repeat: 5,
                yoyo: true,
                ease: "none",
            }, "-=0.1")

            // 6. — Portfolio —
            .to(".it-char-portfolio", {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.4,
                ease: "power2.out",
                stagger: 0.02,
            }, "-=0.4")

            // 7. Line
            .to(".it-rule", {
                scaleX: 1,
                duration: 0.7,
                ease: "power3.inOut",
            }, "-=0.2")

            // 8. Copyright
            .to(".it-char-copy", {
                opacity: 1,
                duration: 0.04,
                stagger: 0.04,
                ease: "none",
            }, "+=0.1");

        return () => { mainTl.kill(); };
    }, [countdownFinished, onFinish]);

    return (
        <div className="loader fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">

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
                            className="count relative z-30 text-[#f0eada] text-[35vh] leading-none tabular-nums font-normal"
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

            {/* INTERTITLE */}
            <div
                ref={containerRef}
                className={`intertitle relative z-10 flex flex-col items-center text-center transition-opacity duration-300 ${!countdownFinished ? "opacity-0" : "opacity-100"
                    }`}
                style={{ width: "62%", maxWidth: "640px" }}
            />

            {/* TEXTURE */}
            <div className={styles.grainOverlay} />
            <div className={styles.vignette} />
            {enableFlicker && <div className={styles.flickerOverlay} />}
            {enableFilmDirt && <div className={styles.filmDirt} />}
            {enableScanlines && <div className={styles.scanlines} />}
            {enableBurnEdge && <div className={styles.burnEdge} />}

            {/* IRIS CLOSE */}
            <svg
                className="iris-overlay"
                style={{
                    position: "fixed",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 99999,
                    pointerEvents: "none",
                }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <mask id="iris-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <circle
                            className="iris-circle"
                            cx="50%"
                            cy="50%"
                            r="150%"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="black"
                    mask="url(#iris-mask)"
                />
            </svg>

        </div>
    );
}