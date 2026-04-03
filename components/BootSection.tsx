"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BootSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const SPRITE_COLS = 6;
const SPRITE_ROWS = 6;
const SPRITE_WIDTH = 2028 / SPRITE_COLS;
const SPRITE_HEIGHT = 3240 / SPRITE_ROWS;
const START_FRAME = 18;
const ACTIVE_FRAMES = 18;

const DEFAULT_DESCRIPTION =
  "A curated selection of digital constructs built in the wasteland. Hover a project from the log to access schematics and mission data.";

type Project = {
  name: string;
  tag: string;
  description: string;
  logo: string;
  screenshots: string[];
  stack: string[];
  problem: string;
  result: string;
  repoUrl: string;
  videoUrl: string;
};

const PROJECTS: Project[] = [
  {
    name: "GitGraph",
    tag: "DEV",
    logo: "/images/logos/gitgraph.png",
    screenshots: ["/images/screenshots/gitgraph1.png", "/images/screenshots/gitgraph2.png", "/images/screenshots/gitgraph3.png"],
    stack: ["PostgreSQL", "Prisma", "TypeScript", "React", "Next.js", "D3", "GSAP"],
    problem: "Raw GitHub data is fragmented across repos — devs lack a single surface to read signals and act on them.",
    result: "High-end SaaS analytics platform with GitHub OAuth, delivering a full dashboard for repo metrics, stars, forks, open issues, and commit history at a glance.",
    description: "Full-stack dashboard for GitHub repositories. Visualizes commit history and branch structures through interactive D3 graph rendering.",
    repoUrl: "https://github.com/Gustaavo-404/gitgraph",
    videoUrl: "https://youtu.be/zlDLipwbL3g",
  },
  {
    name: "AlphaWeb",
    tag: "WEB",
    logo: "/images/logos/alphaweb.png",
    screenshots: ["/images/screenshots/alphaweb1.png", "/images/screenshots/alphaweb2.png", "/images/screenshots/alphaweb3.png"],
    stack: ["MySQL", "Java", "Python", "Transformers", "GPT-4o mini", "DeepSeek V3", "Llama 3.8B", "Three.js"],
    problem: "Deploying a custom AI chatbot requires deep ML knowledge, putting the technology out of reach for most teams.",
    result: "A chatbot library platform that reduces creation to a form — name, dataset, prompt, category — abstracting all model complexity behind a clean UI.",
    description: "Full-stack platform for building and managing AI chatbots via form-based configuration. Multi-model LLM support with a public chatbot library.",
    repoUrl: "https://github.com/",
    videoUrl: "https://youtu.be/tQpCruAGaR4",
  },
  {
    name: "ExpertInvest",
    tag: "FIN",
    logo: "/images/logos/expertinvest.png",
    screenshots: ["/images/screenshots/expertinvest1.png", "/images/screenshots/expertinvest2.png", "/images/screenshots/expertinvest3.png"],
    stack: ["Node.js", "Express", "React", "Python", "PuLP", "SQLite"],
    problem: "Portfolio allocation is usually driven by intuition rather than mathematics, leading to suboptimal risk/return ratios.",
    result: "Optimization engine powered by the Simplex method — input assets and constraints, get the mathematically optimal allocation with interactive charts.",
    description: "Full-stack investment optimization platform implementing portfolio allocation via the Simplex method through PuLP.",
    repoUrl: "https://github.com/Gustaavo-404/expertinvest",
    videoUrl: "https://youtu.be/89HojXqSapk",
  },
  {
    name: "HealthTrack",
    tag: "UX",
    logo: "/images/logos/healthtrack.png",
    screenshots: ["/images/screenshots/healthtrack1.png", "/images/screenshots/healthtrack2.png", "/images/screenshots/healthtrack3.png"],
    stack: ["Node.js", "Express", "React", "MySQL"],
    problem: "Generic fitness apps ignore individual biometrics, delivering one-size-fits-all advice that fails most users.",
    result: "Health platform generating personalized daily targets — hydration, sleep, diet — based on user profile, with a Duolingo-style streak system to drive daily engagement.",
    description: "Full-stack health monitoring platform tracking BMI, BMR, and body composition with personalized goal setting and daily streak mechanics.",
    repoUrl: "https://github.com/Gustaavo-404/healthtrack",
    videoUrl: "https://youtu.be/z2zL9pH_1cA",
  },
  {
    name: "Old Portfolio",
    tag: "ARCHIVE",
    logo: "/images/logos/old-portfolio.png",
    screenshots: ["/images/screenshots/old-portfolio1.png", "/images/screenshots/old-portfolio2.png", "/images/screenshots/old-portfolio3.png"],
    stack: ["React", "Three.js", "GSAP"],
    problem: "Heavy GSAP and Three.js pipelines pushed frame times past 60ms on mid-range hardware, making the experience unusable.",
    result: "Archived as a reference point — performance lessons learned here drove the architecture decisions behind the current, more resilient build.",
    description: "First portfolio iteration with a cyberpunk theme. Archived after performance constraints required a ground-up rebuild.",
    repoUrl: "https://github.com/",
    videoUrl: "https://youtu.be/H4r3vkOyJ64",
  },
  {
    name: "Retail Chatbot",
    tag: "AI",
    logo: "/images/logos/retail-chatbot.png",
    screenshots: ["/images/screenshots/retail-chatbot1.png", "/images/screenshots/retail-chatbot2.png", "/images/screenshots/retail-chatbot3.png"],
    stack: ["Node.js", "Express", "Transformers.js", "GPT-4o mini"],
    problem: "Retail support bots rely on rigid keyword trees, failing when customers phrase queries naturally.",
    result: "RAG-powered conversational webhook on Blip — embedding-based product search lets the bot answer free-form queries like 'do you have a tank top?' with real catalogue data.",
    description: "Conversational RAG chatbot webhook integrated with the Blip platform, serving as AI assistant for a fictional retail store.",
    repoUrl: "https://github.com/Gustaavo-404/blip-llm-webhook-bot",
    videoUrl: "https://youtu.be/65cU-onvC8w",
  },
];

const GLITCH_CHARS = "▓░▒█▄▀■□◆◇○●";

export const BootSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const scanlinesRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const pipboyRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const spriteWrapRef = useRef<HTMLDivElement>(null);
  const centerInnerRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement | null>(null);

  const logoAnimRef = useRef<gsap.core.Tween[]>([]);
  const currentHoverRef = useRef<string | null>(null);

  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [pipVisible, setPipVisible] = useState(false);

  // Lightbox state
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const hoveredData = hoveredProject ? PROJECTS.find((p) => p.name === hoveredProject) ?? null : null;
  const selectedData = selectedProject ? PROJECTS.find((p) => p.name === selectedProject) ?? null : null;
  const displayProject = hoveredData ?? selectedData;

  const handleProjectClick = (name: string) => {
    setSelectedProject((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    if (!logoRef.current || !spriteWrapRef.current) return;

    logoAnimRef.current.forEach((t) => t.kill());
    logoAnimRef.current = [];

    if (displayProject) {
      logoRef.current.src = displayProject.logo;
      const t1 = gsap.to(spriteWrapRef.current, { opacity: 0, duration: 0.15, ease: "power2.out" });
      const t2 = gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.9, y: 4 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power3.out" }
      );
      logoAnimRef.current = [t1, t2];
    } else {
      const t1 = gsap.to(logoRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          if (!currentHoverRef.current) {
            const t2 = gsap.to(spriteWrapRef.current, { opacity: 1, duration: 0.2, ease: "power2.out" });
            logoAnimRef.current.push(t2);
          }
        },
      });
      logoAnimRef.current = [t1];
    }
  }, [displayProject]);

  useEffect(() => {
    currentHoverRef.current = hoveredProject;
  }, [hoveredProject]);

  useEffect(() => {
    if (!centerInnerRef.current) return;
    if (selectedData) {
      gsap.to(centerInnerRef.current, { maxWidth: "780px", duration: 0.45, ease: "power3.inOut" });
    } else {
      gsap.to(centerInnerRef.current, { maxWidth: "480px", duration: 0.35, ease: "power3.inOut" });
    }
  }, [selectedData]);

  // Escape to deselect / close lightbox
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxSrc) {
          setLightboxSrc(null);
        } else {
          setSelectedProject(null);
        }
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lightboxSrc]);

  // ── Main scroll / animation setup ──
  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    gsap.set(textRef.current, { autoAlpha: 0, zIndex: 40, pointerEvents: "none" });
    gsap.set(pipboyRef.current, { clipPath: "inset(50% 0 50% 0)", opacity: 0, pointerEvents: "none" });

    const heroNoise = document.querySelector('[class*="noise-overlay"]');

    // Hero noise toggle
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      onEnter: () => gsap.to(heroNoise, { autoAlpha: 0, duration: 0.4 }),
      onEnterBack: () => gsap.to(heroNoise, { autoAlpha: 0, duration: 0.4 }),
      onLeaveBack: () => gsap.to(heroNoise, { autoAlpha: 1, duration: 0.4 }),
    });

    // Pin + background transition
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=3200",
      scrub: 0.3,
      pin: sectionRef.current,
      pinSpacing: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.15) {
          gsap.set(bgRef.current, { backgroundColor: "#000000" });
          gsap.to(noiseRef.current, { autoAlpha: 1, duration: 0.1 });
          gsap.to(scanlinesRef.current, { autoAlpha: 1, duration: 0.1 });
        } else if (p >= 0.15 && p < 0.38) {
          const t = (p - 0.15) / 0.23;
          gsap.to(bgRef.current, { backgroundColor: "#041f14", duration: 0.1 });
          gsap.to(noiseRef.current, { autoAlpha: 1 - t, duration: 0.1 });
          gsap.to(scanlinesRef.current, { autoAlpha: 1 - t, duration: 0.1 });
        } else if (p >= 0.38) {
          gsap.to(bgRef.current, { backgroundColor: "#020f08", duration: 0.2 });
          gsap.to(noiseRef.current, { autoAlpha: 0, duration: 0.2 });
          gsap.to(scanlinesRef.current, { autoAlpha: 0, duration: 0.2 });
        }
      },
    });

    // ── "CONNECTION FOUND" ——
    const TARGET = "CONNECTION FOUND";

    // Build spans
    let ci = 0;
    textRef.current.innerHTML = TARGET.split("")
      .map((ch) => {
        if (ch === " ") return `<span class="${styles.space}">&nbsp;</span>`;
        const idx = ci++;
        return `<span class="${styles.char}" data-final="${ch}" data-idx="${idx}">${ch}</span>`;
      })
      .join("");

    const chars = Array.from(textRef.current.querySelectorAll<HTMLElement>(`.${styles.char}`));
    const glitchIntervals: ReturnType<typeof setInterval>[] = [];

    // Reset chars hidden
    gsap.set(chars, { opacity: 0 });

    const scanEl = document.createElement("div");
    scanEl.className = styles.termScanline;
    textRef.current.appendChild(scanEl);
    scanLineRef.current = scanEl;
    gsap.set(scanEl, { scaleX: 0, opacity: 0 });

    let lastPhase = -1;

    const startGlitchOnChar = (el: HTMLElement) => {
      const final = el.dataset.final ?? "";
      let count = 0;
      const max = 3 + Math.floor(Math.random() * 4);
      const iv = setInterval(() => {
        if (count >= max) {
          el.textContent = final;
          clearInterval(iv);
          return;
        }
        el.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        count++;
      }, 40 + Math.random() * 20);
      glitchIntervals.push(iv);
    };

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=3200",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;

        // ── Phase 0: scan line ──
        if (p >= 0.04 && lastPhase < 0) {
          lastPhase = 0;
          gsap.to(textRef.current, { autoAlpha: 1, duration: 0.01 });
          gsap.fromTo(
            scanEl,
            { scaleX: 0, opacity: 0.7, left: "0%" },
            {
              scaleX: 1,
              opacity: 0.7,
              duration: 0.5,
              ease: "power2.inOut",
              onComplete: () => {
                if (scanLineRef.current && scanLineRef.current.parentNode) {
                  gsap.to(scanLineRef.current, { opacity: 0, duration: 0.4 });
                }
              },
            }
          );
        }

        // ── Phase 1: chars fade ──
        if (p >= 0.05 && p < 0.42) {
          const phase = (p - 0.05) / 0.37;
          chars.forEach((char, i) => {
            const threshold = i / chars.length;
            if (phase >= threshold && char.dataset.revealed !== "1") {
              char.dataset.revealed = "1";
              gsap.fromTo(
                char,
                { opacity: 0, y: 6 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
              );
              startGlitchOnChar(char);
            }
          });
          gsap.set(textRef.current, { autoAlpha: 1, x: 0, y: 0, scale: 1, skewX: 0 });
        }

        // ── Phase 2: flickering  ──
        if (p >= 0.42 && p < 0.52 && lastPhase < 2) {
          lastPhase = 2;
          glitchIntervals.forEach(clearInterval);
          let flickers = 0;
          const flickerIv = setInterval(() => {
            gsap.to(textRef.current, { opacity: 0.6, duration: 0.04, yoyo: true, repeat: 1 });
            flickers++;
            if (flickers >= 3) clearInterval(flickerIv);
          }, 120);
        }

        // ── Phase 3: fade + scale ──
        if (p >= 0.52 && p < 0.64) {
          const exit = (p - 0.52) / 0.12;
          gsap.set(textRef.current, {
            autoAlpha: 1 - exit,
            scale: 1 + exit * 0.04,
            y: -exit * (window.innerHeight / 14),
            letterSpacing: `${0.18 + exit * 0.06}em`,
          });
        }

        // ── Phase 4: pip-boy reveal ──
        if (p >= 0.64) {
          if (lastPhase < 4) {
            lastPhase = 4;
            gsap.set(textRef.current, { autoAlpha: 0, pointerEvents: "none" });
          }
          const pipP = Math.min(1, (p - 0.64) / 0.14);
          gsap.set(pipboyRef.current, {
            clipPath: `inset(${50 * (1 - pipP)}% 0 ${50 * (1 - pipP)}% 0)`,
            opacity: Math.min(1, pipP * 1.5),
            pointerEvents: pipP >= 1 ? "auto" : "none",
          });
          if (pipP >= 1 && !pipVisible) setPipVisible(true);
        } else {
          gsap.set(pipboyRef.current, { clipPath: "inset(50% 0 50% 0)", opacity: 0, pointerEvents: "none" });
          if (lastPhase === 4) { lastPhase = 2; setPipVisible(false); }
        }

        // ── Bars fill in ──
        if (p >= 0.78) {
          document.querySelectorAll(`.${styles.fill}`).forEach((el) => { (el as HTMLElement).style.width = "100%"; });
          const targets = ["78%", "92%", "65%"];
          document.querySelectorAll(`.${styles.miniFill}`).forEach((el, i) => {
            (el as HTMLElement).style.width = targets[i] ?? "80%";
          });
        }

        // ── Reset ──
        if (p < 0.03 && lastPhase !== -1) {
          lastPhase = -1;
          gsap.set(textRef.current, { autoAlpha: 0, scale: 1, y: 0, letterSpacing: "0.18em" });
          chars.forEach((ch) => {
            delete ch.dataset.revealed;
            ch.textContent = ch.dataset.final ?? "";
            gsap.set(ch, { opacity: 0, y: 0 });
          });
          glitchIntervals.forEach(clearInterval);
          glitchIntervals.length = 0;
        }
      },
    });

    // ── Sprite animation ──
    if (spriteRef.current) {
      let frame = 0, lastTime = 0;
      const interval = 1000 / 25;
      const tick = (time: number) => {
        if (!spriteRef.current) return;
        if (time - lastTime > interval) {
          const f = START_FRAME + frame;
          gsap.set(spriteRef.current, {
            backgroundPosition: `-${(f % SPRITE_COLS) * SPRITE_WIDTH}px -${Math.floor(f / SPRITE_COLS) * SPRITE_HEIGHT}px`,
          });
          frame = (frame + 1) % ACTIVE_FRAMES;
          lastTime = time;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    return () => {
      glitchIntervals.forEach(clearInterval);
      if (scanLineRef.current) {
        gsap.killTweensOf(scanLineRef.current);
        scanLineRef.current.remove();
        scanLineRef.current = null;
      }
      if (textRef.current) gsap.killTweensOf(textRef.current);
      if (pipboyRef.current) gsap.killTweensOf(pipboyRef.current);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === sectionRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="boot-section relative w-full h-screen">
      <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none" />
      <div ref={noiseRef} className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
        style={{ backgroundImage: "url('/images/noise.png')", backgroundSize: "200px" }} />
      <div ref={scanlinesRef} className="absolute inset-0 pointer-events-none z-30"
        style={{ background: "repeating-linear-gradient(to bottom,rgba(0,0,0,0.2) 0px,rgba(0,0,0,0.2) 1px,transparent 2px,transparent 4px)" }} />

      {/* CONNECTION FOUND text */}
      <div className="absolute inset-0 flex items-center justify-center z-40">
        <div ref={textRef} className={`${styles.terminal} title`} />
      </div>

      {/* LIGHTBOX */}
      {lightboxSrc && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightboxSrc(null)}
        >
          <button className={styles.lightboxClose} onClick={() => setLightboxSrc(null)} aria-label="Fechar">✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt="Screenshot expandido"
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* PIP-BOY */}
      <div ref={pipboyRef} className={`${styles.pipBoyOverlay} pipboy-ui`}>
        <div className={styles.gridLines} />
        <div className={styles.vignette} />

        {/* HEADER */}
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

        {/* MAIN */}
        <div className={styles.mainContent}>
          <div className={styles.scanlineOverlay} />

          {/* LEFT PANEL */}
          <div className={styles.leftPanel}>
            <div className={styles.panelTitle}>▸ PROJECTS LOG</div>
            <div className={styles.projectsList}>
              <ul>
                {PROJECTS.map((p) => (
                  <li
                    key={p.name}
                    className={`${styles.projectItem} ${selectedProject === p.name ? styles.projectItemSelected : ""}`}
                    onMouseEnter={() => setHoveredProject(p.name)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onClick={() => handleProjectClick(p.name)}
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
              {["EXPERIENCE", "COMPLETION", "REPUTATION"].map((label) => (
                <div key={label} className={styles.miniStatRow}>
                  <span>{label}</span>
                  <div className={styles.miniBarWrap}>
                    <div className={styles.miniFill} style={{ width: "0%", transition: "width 0.8s steps(8)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER */}
          <div className={styles.centerArea}>
            <div className={styles.radarRing} />
            <div className={styles.radarRing} />
            <div className={styles.radarRing} />

            <div ref={centerInnerRef} className={styles.centerInner}>

              {/* Default / hover view */}
              <div className={`${styles.defaultView} ${selectedData ? styles.defaultViewHidden : ""}`}>
                <div className={styles.spriteWrapper}>
                  <div className={styles.spriteFrame} />

                  <div ref={spriteWrapRef} className={styles.spriteAnimWrap}>
                    <div ref={spriteRef} className={styles.spriteEl}
                      style={{
                        width: SPRITE_WIDTH,
                        height: SPRITE_HEIGHT,
                        backgroundImage: "url('/images/boot-sprite-sheet.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${SPRITE_COLS * SPRITE_WIDTH}px ${SPRITE_ROWS * SPRITE_HEIGHT}px`,
                      }}
                    />
                  </div>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={logoRef} src="" alt="" className={styles.projectLogo} style={{ opacity: 0 }} />
                </div>

                <p className={styles.spriteLabel}>◆ PROJECTS INTERFACE ◆</p>
                <p className={styles.spriteTitle}>{displayProject?.name ?? "DEVELOPER TERMINAL"}</p>
                <p className={styles.spriteDescription}>{displayProject?.description ?? DEFAULT_DESCRIPTION}</p>
                {!selectedData && <p className={styles.spriteHint}>[ CLICK TO ACCESS SCHEMATICS ]</p>}
              </div>

              {/* Expanded / selected view */}
              <div className={`${styles.expandedView} ${selectedData ? styles.expandedViewVisible : ""}`}>
                {selectedData && (
                  <>
                    <div className={styles.expandedHeader}>
                      <div className={styles.expandedLogoWrap}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedData.logo} alt={selectedData.name} className={styles.expandedLogo} />
                      </div>
                      <div className={styles.expandedMeta}>
                        <div className={styles.expandedTitle}>{selectedData.name}</div>
                        <div className={styles.expandedTag}>{selectedData.tag}</div>
                        <div className={styles.stackTags}>
                          {selectedData.stack.map((tech) => (
                            <span key={tech} className={styles.stackTag}>{tech}</span>
                          ))}
                        </div>
                      </div>
                      <button className={styles.closeBtn} onClick={() => setSelectedProject(null)} aria-label="Close">✕</button>
                    </div>

                    <div className={styles.screenshotsGrid}>
                      {selectedData.screenshots.map((src, i) => (
                        <div
                          key={i}
                          className={styles.screenshotWrap}
                          onClick={() => setLightboxSrc(src)}
                          title="Clique para expandir"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`screenshot ${i + 1}`} className={styles.screenshot} />
                          <span className={styles.screenshotLabel}>SCR-{String(i + 1).padStart(2, "0")}</span>
                          <span className={styles.screenshotZoom}>⊕</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.detailsRow}>
                      <div className={styles.detailBlock}>
                        <div className={styles.detailLabel}>▸ MISSION OBJECTIVE</div>
                        <p className={styles.problemText}>{selectedData.problem}</p>
                      </div>
                      <div className={styles.detailBlock}>
                        <div className={`${styles.detailLabel} ${styles.resultLabel}`}>▸ OUTCOME</div>
                        <p className={styles.resultText}>{selectedData.result}</p>
                      </div>
                    </div>

                    <div className={styles.ctaRow}>
                      <a href={selectedData.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
                        <span className={styles.ctaBtnIcon}>⌥</span> REPOSITORY
                      </a>
                      <a href={selectedData.videoUrl} target="_blank" rel="noopener noreferrer" className={`${styles.ctaBtn} ${styles.ctaBtnAlt}`}>
                        <span className={styles.ctaBtnIcon}>▶</span> DEMO VIDEO
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <div className={styles.statBox}>
              <span>HP</span>
              <div className={styles.bar}><div className={styles.fill} style={{ width: "0%", transition: "width 1s steps(10)" }} /></div>
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
              <div className={styles.bar}><div className={styles.fill} style={{ width: "0%", transition: "width 1s steps(10)" }} /></div>
              <span>85/85</span>
            </div>
            <span className={styles.coords}>▸ LVL 24</span>
          </div>
        </div>
      </div>
    </section>
  );
};