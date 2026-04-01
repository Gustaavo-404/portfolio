"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BootSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const SPRITE_TOTAL_FRAMES = 36;
const SPRITE_COLS = 6;
const SPRITE_ROWS = 6;

const SPRITE_WIDTH = 2028 / SPRITE_COLS;
const SPRITE_HEIGHT = 3240 / SPRITE_ROWS;

const START_FRAME = 18;
const ACTIVE_FRAMES = 18;

const DEFAULT_DESCRIPTION = "A curated selection of digital constructs built in the wasteland. Hover a project from the log to access schematics and mission data.";

const PROJECTS = [
  {
    name: "GitGraph",
    tag: "DEV",
    active: false,
    description: "Full-stack dashboard for GitHub repositories, built with Next.js, TypeScript, D3, and PostgreSQL. Visualizes commit history and branch structures through interactive graph rendering.",
  },
  {
    name: "AlphaWeb",
    tag: "WEB",
    active: false,
    description: "Full-stack platform for building and managing AI chatbots, using Spring Boot, Python, MySQL, and transformer-based LLMs. Focused on modular chatbot creation and integration.",
  },
  {
    name: "ExpertInvest",
    tag: "FIN",
    active: false,
    description: "Full-stack investment optimization platform using Node.js, React, Python, and SQLite. Implements portfolio allocation models with the Simplex method via PuLP.",
  },
  {
    name: "Retail Chatbot",
    tag: "AI",
    active: false,
    description: "Node.js webhook service powering an AI-driven retail support chatbot. Handles technical assistance flows using LLM integration, without a frontend layer.",
  },
  {
    name: "HealthTrack",
    tag: "UX",
    active: false,
    description: "Full-stack health monitoring platform built with Node.js, React, and MySQL. Tracks daily metrics such as BMI, BMR, and body composition, with reporting features.",
  },
  {
    name: "Old Portfolio",
    tag: "ARCHIVE",
    active: false,
    description: "First portfolio built with React, GSAP, and Three.js. Archived due to performance limitations, but kept as a reference point for earlier work.",
  },
];

export const BootSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const scanlinesRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const pipboyRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const currentDescription = hoveredProject
    ? PROJECTS.find((p) => p.name === hoveredProject)?.description ?? DEFAULT_DESCRIPTION
    : DEFAULT_DESCRIPTION;

  // Fade description on change
  useEffect(() => {
    if (!descRef.current) return;
    gsap.fromTo(
      descRef.current,
      { opacity: 0, y: 4 },
      { opacity: 0.6, y: 0, duration: 0.25, ease: "power2.out" }
    );
  }, [currentDescription]);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    gsap.set(textRef.current, { autoAlpha: 1, pointerEvents: "none", zIndex: 40 });

    const heroNoise = document.querySelector('[class*="noise-overlay"]');

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      onEnter: () => gsap.to(heroNoise, { autoAlpha: 0, duration: 0.4 }),
      onEnterBack: () => gsap.to(heroNoise, { autoAlpha: 0, duration: 0.4 }),
      onLeaveBack: () => gsap.to(heroNoise, { autoAlpha: 1, duration: 0.4 }),
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=2000",
      scrub: 0.3,
      pin: sectionRef.current,
      pinSpacing: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.2) {
          gsap.set(bgRef.current, { backgroundColor: "#000000" });
          gsap.to(noiseRef.current, { autoAlpha: 1, duration: 0.1 });
          gsap.to(scanlinesRef.current, { autoAlpha: 1, duration: 0.1 });
        } else if (p >= 0.2 && p < 0.4) {
          const t = (p - 0.2) / 0.2;
          gsap.to(bgRef.current, { backgroundColor: "#041f14", duration: 0.1 });
          gsap.to(noiseRef.current, { autoAlpha: 1 - t, duration: 0.1 });
          gsap.to(scanlinesRef.current, { autoAlpha: 1 - t, duration: 0.1 });
        } else if (p >= 0.4) {
          gsap.to(bgRef.current, { backgroundColor: "#020f08", duration: 0.2 });
          gsap.to(noiseRef.current, { autoAlpha: 0, duration: 0.2 });
          gsap.to(scanlinesRef.current, { autoAlpha: 0, duration: 0.2 });
        }
      },
    });

    // === TEXTO CINEMATOGRÁFICO ===
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
    gsap.set(chars, { opacity: 0, y: 40, scale: 0.9, filter: "blur(8px)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 55%",
        end: "top 40%",
        toggleActions: "play none none reset",
      },
    });

    tl.to({}, { duration: 0.4 })
      .to(textRef.current, { autoAlpha: 1, duration: 0.05 })
      .to(chars, {
        opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
        stagger: { each: 0.05, from: "center" },
        duration: 0.8, ease: "power4.out",
      })
      .to(chars, {
        x: () => gsap.utils.random(-6, 6),
        skewX: () => gsap.utils.random(-10, 10),
        duration: 0.08, repeat: 3, yoyo: true, stagger: 0.015,
      })
      .to(chars, {
        opacity: (i) => (i % 3 === 0 ? 0 : 1),
        duration: 0.06, repeat: 2, yoyo: true, stagger: 0.01,
      })
      .to(chars, { x: 0, skewX: 0, opacity: 1, duration: 0.3, ease: "power2.out" })
      .to(textRef.current, {
        scale: 0.5,
        y: -window.innerHeight / 2 + 100,
        duration: 0.6, ease: "expo.inOut",
      }, "+=0.2")
      .to(textRef.current, {
        autoAlpha: 0, duration: 0.4, ease: "power2.out",
        onComplete: () => {
          gsap.set(textRef.current, { pointerEvents: "none", visibility: "hidden" });
        },
      }, "<")
      .fromTo(
        pipboyRef.current,
        { clipPath: "inset(50% 0 50% 0)", opacity: 0 },
        {
          clipPath: "inset(0% 0 0% 0)", opacity: 1,
          duration: 0.5, ease: "power4.out",
          pointerEvents: "auto", userSelect: "text",
        }
      )
      .fromTo(
        `.${styles.fill}`,
        { width: "0%" },
        { width: "100%", duration: 1, stagger: 0.15, ease: "steps(10)" }
      )
      .fromTo(
        `.${styles.miniFill}`,
        { width: "0%" },
        { width: (i) => ["78%", "92%", "65%"][i] ?? "80%", duration: 0.8, stagger: 0.1, ease: "steps(8)" },
        "<0.2"
      );

    // === SPRITE ===
    if (spriteRef.current) {
      let frame = 0;
      let lastTime = 0;
      const fps = 25;
      const interval = 1000 / fps;

      const animateSprite = (time: number) => {
        if (!spriteRef.current) return;
        if (time - lastTime > interval) {
          const adjustedFrame = START_FRAME + frame;
          const col = adjustedFrame % SPRITE_COLS;
          const row = Math.floor(adjustedFrame / SPRITE_COLS);
          gsap.set(spriteRef.current, {
            backgroundPosition: `-${col * SPRITE_WIDTH}px -${row * SPRITE_HEIGHT}px`,
          });
          frame = (frame + 1) % ACTIVE_FRAMES;
          lastTime = time;
        }
        requestAnimationFrame(animateSprite);
      };

      requestAnimationFrame(animateSprite);
    }
  }, []);

  return (
    <section ref={sectionRef} className="boot-section relative w-full h-screen">

      <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div
        ref={noiseRef}
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
        style={{ backgroundImage: "url('/images/noise.png')", backgroundSize: "200px" }}
      />

      <div
        ref={scanlinesRef}
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 2px, transparent 4px)"
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center z-40 title">
        <div ref={textRef} className={styles.terminal} />
      </div>

      <div ref={pipboyRef} className={`${styles.pipBoyOverlay} pipboy-ui`}>

        <div className={styles.gridLines} />
        <div className={styles.vignette} />

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.tab}>STATS</span>
            <span className={styles.tabActive}>INV</span>
            <span className={styles.tab}>DATA</span>
            <span className={styles.tab}>MAP</span>
            <span className={styles.tab}>RADIO</span>
          </div>
          <div className={styles.headerRight}>
            <span>RDY</span>
            <span>LOC: SJRP-SP-111</span>
            <span>2026</span>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className={styles.mainContent}>
          <div className={styles.scanlineOverlay} />

          {/* LEFT — project list */}
          <div className={styles.leftPanel}>
            <div className={styles.panelTitle}>▸ PROJECTS LOG</div>

            <div className={styles.projectsList}>
              <ul>
                {PROJECTS.map((p) => (
                  <li
                    key={p.name}
                    className={`${styles.projectItem} ${p.active ? styles.projectItemActive : ""}`}
                    onMouseEnter={() => setHoveredProject(p.name)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div className={styles.projectName}>
                      <div className={styles.projectDot} />
                      {p.name}
                    </div>
                    <div className={styles.projectTag}>{p.tag}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.miniStats}>
              <div className={styles.miniStatRow}>
                <span>EXPERIENCE</span>
                <div className={styles.miniBarWrap}>
                  <div className={styles.miniFill} style={{ width: "0%" }} />
                </div>
              </div>
              <div className={styles.miniStatRow}>
                <span>COMPLETION</span>
                <div className={styles.miniBarWrap}>
                  <div className={styles.miniFill} style={{ width: "0%" }} />
                </div>
              </div>
              <div className={styles.miniStatRow}>
                <span>REPUTATION</span>
                <div className={styles.miniBarWrap}>
                  <div className={styles.miniFill} style={{ width: "0%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* CENTER — sprite + description */}
          <div className={styles.centerPanel}>

            <div className={styles.radarRing} />
            <div className={styles.radarRing} />
            <div className={styles.radarRing} />

            <div className={styles.spriteContainer}>
              <div className={styles.spriteWrapper}>
                <div className={styles.spriteFrame} />
                <div
                  ref={spriteRef}
                  style={{
                    width: SPRITE_WIDTH,
                    height: SPRITE_HEIGHT,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(0.38)",
                    transformOrigin: "center",
                    backgroundImage: "url('/images/boot-sprite-sheet.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${SPRITE_COLS * SPRITE_WIDTH}px ${SPRITE_ROWS * SPRITE_HEIGHT}px`,
                  }}
                />
              </div>

              <p className={styles.spriteLabel}>◆ PROJECTS INTERFACE ◆</p>
              <p className={styles.spriteTitle}>
                {hoveredProject ?? "DEVELOPER TERMINAL"}
              </p>
              <p ref={descRef} className={styles.spriteDescription}>
                {currentDescription}
              </p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <div className={styles.statBox}>
              <span>HP</span>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: "100%" }} />
              </div>
              <span>140/140</span>
            </div>
          </div>

          <div className={styles.footerCenter}>
            <span>◈ CORE-TEC ◈</span>
            <span className={styles.cursor} />
          </div>

          <div className={styles.footerRight}>
            <div className={styles.statBox}>
              <span>AP</span>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: "100%" }} />
              </div>
              <span>85/85</span>
            </div>
            <span className={styles.coords}>▸ LVL 24</span>
          </div>
        </div>

      </div>
    </section>
  );
};