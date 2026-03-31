"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BootIntroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export const BootIntroSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const noiseRef = useRef<HTMLDivElement>(null);
    const scanlinesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !textRef.current) return;

        // 🔥 IGUAL AO QUE JÁ FUNCIONAVA
        const heroNoise = document.querySelector('[class*="noise-overlay"]');

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",

            onEnter: () => gsap.to(heroNoise, { autoAlpha: 0, duration: 0.4 }),
            onEnterBack: () => gsap.to(heroNoise, { autoAlpha: 0, duration: 0.4 }),
            onLeaveBack: () => gsap.to(heroNoise, { autoAlpha: 1, duration: 0.4 }),
        });

        // estado inicial
        gsap.set(textRef.current, { opacity: 0 });

        // 🎬 TEXTO
        const text = "CONNECTION FOUND";

        textRef.current.innerHTML = text
            .split("")
            .map((char) =>
                char === " "
                    ? `<span class="${styles.space}">&nbsp;</span>`
                    : `<span class="${styles.char}">${char}</span>`
            )
            .join("");

        const chars = textRef.current.querySelectorAll(`.${styles.char}`);

        gsap.set(chars, {
            opacity: 0,
            y: 40,
            scale: 0.9,
            filter: "blur(8px)",
        });

        // 🎯 TIMELINE
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=1400",
                scrub: 0.4,
                pin: true,
            },
        });

        tl
            // noise entra
            .to(noiseRef.current, { autoAlpha: 1, duration: 0.2 }, 0)
            .to(scanlinesRef.current, { autoAlpha: 1, duration: 0.2 }, 0)

            // texto aparece
            .to(textRef.current, { opacity: 1, duration: 0.1 })
            .to(chars, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                stagger: { each: 0.05, from: "center" },
                duration: 0.8,
                ease: "power4.out",
            })

            // glitch
            .to(chars, {
                x: () => gsap.utils.random(-6, 6),
                skewX: () => gsap.utils.random(-10, 10),
                duration: 0.08,
                repeat: 2,
                yoyo: true,
                stagger: 0.02,
            })

            // estabiliza
            .to(chars, {
                x: 0,
                skewX: 0,
                duration: 0.2,
            })

            // tira noise
            .to(noiseRef.current, { autoAlpha: 0, duration: 0.4 })
            .to(scanlinesRef.current, { autoAlpha: 0, duration: 0.4 }, "<")

            // fade texto
            .to(textRef.current, {
                opacity: 0,
                scale: 0.9,
                filter: "blur(6px)",
                duration: 0.6,
                ease: "power3.out",
            })

            // fade section
            .to(sectionRef.current, {
                opacity: 0,
                duration: 0.6,
            });

    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden bg-black"
        >
            {/* NOISE (local continua existindo) */}
            <div
                ref={noiseRef}
                className="absolute inset-0 pointer-events-none opacity-0 z-20 mix-blend-overlay"
                style={{
                    backgroundImage: "url('/images/noise.png')",
                    backgroundSize: "200px",
                }}
            />

            {/* SCANLINES */}
            <div
                ref={scanlinesRef}
                className="absolute inset-0 pointer-events-none opacity-0 z-30"
                style={{
                    background:
                        "repeating-linear-gradient(to bottom, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 2px, transparent 4px)",
                }}
            />

            {/* TEXTO */}
            <div className="absolute inset-0 flex items-center justify-center z-40 title">
                <div ref={textRef} className={styles.terminal} />
            </div>
        </section>
    );
};