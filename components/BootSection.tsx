"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BootSection.module.css";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const SPRITE_COLS   = 6;
const SPRITE_ROWS   = 6;
const SPRITE_WIDTH  = 2028 / SPRITE_COLS;
const SPRITE_HEIGHT = 3240 / SPRITE_ROWS;
const START_FRAME   = 18;
const ACTIVE_FRAMES = 18;

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
  repoAvailable?: boolean;
  videoAvailable?: boolean;
};

const PROJECTS: Project[] = [
  {
    name: "GitGraph",
    tag: "DEV",
    logo: "/images/logos/gitgraph.png",
    screenshots: ["/images/screenshots/gitgraph1.png", "/images/screenshots/gitgraph2.png", "/images/screenshots/gitgraph3.png"],
    stack: ["PostgreSQL", "Prisma", "TypeScript", "React", "Next.js", "D3", "GSAP"],
    problem: "",
    result: "",
    description: "",
    repoUrl: "https://github.com/Gustaavo-404/gitgraph",
    videoUrl: "https://youtu.be/zlDLipwbL3g",
  },
  {
    name: "AlphaWeb",
    tag: "WEB",
    logo: "/images/logos/alphaweb.png",
    screenshots: ["/images/screenshots/alphaweb1.png", "/images/screenshots/alphaweb2.png", "/images/screenshots/alphaweb3.png"],
    stack: ["MySQL", "Java", "PHP", "Python", "Transformers", "GPT-4o mini", "DeepSeek V3", "Llama 3.8B", "Three.js"],
    problem: "",
    result: "",
    description: "",
    repoUrl: "https://github.com/",
    videoUrl: "https://youtu.be/tQpCruAGaR4",
    repoAvailable: false,
  },
  {
    name: "ExpertInvest",
    tag: "FIN",
    logo: "/images/logos/expertinvest.png",
    screenshots: ["/images/screenshots/expertinvest1.png", "/images/screenshots/expertinvest2.png", "/images/screenshots/expertinvest3.png"],
    stack: ["Node.js", "Express", "React", "Python", "PuLP", "SQLite"],
    problem: "",
    result: "",
    description: "",
    repoUrl: "https://github.com/Gustaavo-404/expertinvest",
    videoUrl: "https://youtu.be/89HojXqSapk",
  },
  {
    name: "HealthTrack",
    tag: "UX",
    logo: "/images/logos/healthtrack.png",
    screenshots: ["/images/screenshots/healthtrack1.png", "/images/screenshots/healthtrack2.png", "/images/screenshots/healthtrack3.png"],
    stack: ["Node.js", "Express", "React", "MySQL"],
    problem: "",
    result: "",
    description: "",
    repoUrl: "https://github.com/Gustaavo-404/healthtrack",
    videoUrl: "https://youtu.be/z2zL9pH_1cA",
  },
  {
    name: "Old Portfolio",
    tag: "ARC",
    logo: "/images/logos/old-portfolio.png",
    screenshots: ["/images/screenshots/old-portfolio1.png", "/images/screenshots/old-portfolio2.png", "/images/screenshots/old-portfolio3.png"],
    stack: ["React", "Three.js", "GSAP"],
    problem: "",
    result: "",
    description: "",
    repoUrl: "https://github.com/",
    videoUrl: "https://youtu.be/H4r3vkOyJ64",
    repoAvailable: false,
  },
  {
    name: "Retail Chatbot",
    tag: "AI",
    logo: "/images/logos/retail-chatbot.png",
    screenshots: ["/images/screenshots/retail-chatbot1.png", "/images/screenshots/retail-chatbot2.png", "/images/screenshots/retail-chatbot3.png"],
    stack: ["Node.js", "Express", "Transformers.js", "GPT-4o mini"],
    problem: "",
    result: "",
    description: "",
    repoUrl: "https://github.com/Gustaavo-404/blip-llm-webhook-bot",
    videoUrl: "https://youtu.be/65cU-onvC8w",
  },
];

export const BootSection = () => {
  const { t } = useLanguage();

  // Merge static project data with translated strings
  const projects = PROJECTS.map((p) => {
    const tx = t.boot.projects[p.name as keyof typeof t.boot.projects];
    return {
      ...p,
      description: tx?.description ?? p.description,
      problem:     tx?.problem     ?? p.problem,
      result:      tx?.result      ?? p.result,
    };
  });

  const sectionRef      = useRef<HTMLElement>(null);
  const textRef         = useRef<HTMLDivElement>(null);
  const noiseRef        = useRef<HTMLDivElement>(null);
  const scanlinesRef    = useRef<HTMLDivElement>(null);
  const bgRef           = useRef<HTMLDivElement>(null);
  const spriteRef       = useRef<HTMLDivElement>(null);
  const pipboyRef       = useRef<HTMLDivElement>(null);
  const logoRef         = useRef<HTMLImageElement>(null);
  const spriteWrapRef   = useRef<HTMLDivElement>(null);
  const centerInnerRef  = useRef<HTMLDivElement>(null);
  const expandedBodyRef = useRef<HTMLDivElement>(null);
  const prevProjectRef  = useRef<string | null>(null);

  const logoAnimRef     = useRef<gsap.core.Tween[]>([]);
  const currentHoverRef = useRef<string | null>(null);

  const [hoveredProject, setHoveredProject]   = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen]           = useState(false);

  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lightboxImgRef = useRef<HTMLImageElement>(null);

  const hoveredData    = hoveredProject  ? projects.find((p) => p.name === hoveredProject)  ?? null : null;
  const selectedData   = selectedProject ? projects.find((p) => p.name === selectedProject) ?? null : null;
  const displayProject = hoveredData ?? selectedData;

  const closeExpanded = () => {
    if (expandedBodyRef.current) {
      gsap.to(expandedBodyRef.current, {
        y: -16, opacity: 0, duration: 0.18, ease: "power2.in",
        onComplete: () => {
          setSelectedProject(null);
          gsap.set(expandedBodyRef.current, { y: 0, opacity: 1 });
        },
      });
    } else {
      setSelectedProject(null);
    }
  };

  const handleProjectClick = (name: string) => {
    setDrawerOpen(false);
    setSelectedProject((prev) => {
      if (prev === name) { prevProjectRef.current = null; return null; }
      if (prev !== null && expandedBodyRef.current) {
        const fromIdx = projects.findIndex((p) => p.name === prev);
        const toIdx   = projects.findIndex((p) => p.name === name);
        const dir     = toIdx > fromIdx ? 1 : -1;
        gsap.to(expandedBodyRef.current, {
          x: -dir * 48, opacity: 0, duration: 0.18, ease: "power2.in",
          onComplete: () => {
            prevProjectRef.current = name;
            setSelectedProject(name);
            gsap.fromTo(expandedBodyRef.current,
              { x: dir * 48, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.22, ease: "power3.out" }
            );
          },
        });
        return prev;
      }
      prevProjectRef.current = name;
      return name;
    });
  };

  const openLightbox     = useCallback((index: number) => { setLightboxIndex(index); setLightboxOpen(true); }, []);
  const closeLightbox    = useCallback(() => setLightboxOpen(false), []);
  const navigateLightbox = useCallback((dir: 1 | -1) => {
    if (!selectedData) return;
    const total = selectedData.screenshots.length;
    setLightboxIndex((prev) => {
      const next = (prev + dir + total) % total;
      if (lightboxImgRef.current)
        gsap.fromTo(lightboxImgRef.current, { opacity: 0, x: dir * 20 }, { opacity: 1, x: 0, duration: 0.22, ease: "power2.out" });
      return next;
    });
  }, [selectedData]);

  // Logo swap
  useEffect(() => {
    if (!logoRef.current || !spriteWrapRef.current) return;
    logoAnimRef.current.forEach((t) => t.kill());
    logoAnimRef.current = [];
    if (displayProject) {
      logoRef.current.src = displayProject.logo;
      logoAnimRef.current = [
        gsap.to(spriteWrapRef.current, { opacity: 0, duration: 0.15, ease: "power2.out" }),
        gsap.fromTo(logoRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.22, ease: "power3.out" }),
      ];
    } else {
      logoAnimRef.current = [
        gsap.to(logoRef.current, {
          opacity: 0, scale: 0.92, duration: 0.15, ease: "power2.in",
          onComplete: () => {
            if (!currentHoverRef.current) {
              const t = gsap.to(spriteWrapRef.current, { opacity: 1, duration: 0.2, ease: "power2.out" });
              logoAnimRef.current.push(t);
            }
          },
        }),
      ];
    }
  }, [displayProject]);

  useEffect(() => { currentHoverRef.current = hoveredProject; }, [hoveredProject]);

  useEffect(() => {
    if (!centerInnerRef.current) return;
    if (window.innerWidth >= 1024) {
      gsap.to(centerInnerRef.current, {
        maxWidth: selectedData ? "780px" : "480px",
        duration: 0.42, ease: "power3.inOut",
      });
    }
  }, [selectedData]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === "Escape")     closeLightbox();
        if (e.key === "ArrowRight") navigateLightbox(1);
        if (e.key === "ArrowLeft")  navigateLightbox(-1);
      } else {
        if (e.key === "Escape") drawerOpen ? setDrawerOpen(false) : closeExpanded();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lightboxOpen, closeLightbox, navigateLightbox, drawerOpen]);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    gsap.set(textRef.current,   { autoAlpha: 0, zIndex: 40, pointerEvents: "none" });
    gsap.set(pipboyRef.current, { clipPath: "inset(50% 0 50% 0)", opacity: 0, pointerEvents: "none" });

    const heroNoise = document.querySelector('[class*="noise-overlay"]');

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top", end: "bottom top",
      onEnter:     () => gsap.to(heroNoise, { autoAlpha: 0, duration: 0.4 }),
      onEnterBack: () => gsap.to(heroNoise, { autoAlpha: 0, duration: 0.4 }),
      onLeaveBack: () => gsap.to(heroNoise, { autoAlpha: 1, duration: 0.4 }),
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top", end: "+=3200",
      scrub: 0.3, pin: sectionRef.current, pinSpacing: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.15) {
          gsap.set(bgRef.current, { backgroundColor: "#000000" });
          gsap.to(noiseRef.current,     { autoAlpha: 1, duration: 0.1 });
          gsap.to(scanlinesRef.current, { autoAlpha: 1, duration: 0.1 });
        } else if (p < 0.38) {
          const t = (p - 0.15) / 0.23;
          gsap.to(bgRef.current,        { backgroundColor: "#041f14", duration: 0.1 });
          gsap.to(noiseRef.current,     { autoAlpha: 1 - t, duration: 0.1 });
          gsap.to(scanlinesRef.current, { autoAlpha: 1 - t, duration: 0.1 });
        } else {
          gsap.to(bgRef.current,        { backgroundColor: "#020f08", duration: 0.2 });
          gsap.to(noiseRef.current,     { autoAlpha: 0, duration: 0.2 });
          gsap.to(scanlinesRef.current, { autoAlpha: 0, duration: 0.2 });
        }
      },
    });

    const TARGET = t.bootIntro.connectionFound;
    let ci = 0;
    textRef.current.innerHTML = TARGET.split("")
      .map((ch) => {
        if (ch === " ") return `<span class="${styles.space}">&nbsp;</span>`;
        return `<span class="${styles.char}" data-idx="${ci++}">${ch}</span>`;
      })
      .join("");

    const chars = Array.from(textRef.current.querySelectorAll<HTMLElement>(`.${styles.char}`));
    gsap.set(chars, { opacity: 0, y: 18 });

    const P_REVEAL_START = 0.05;
    const P_REVEAL_END   = 0.40;
    const P_HOLD_END     = 0.52;
    const P_EXIT_END     = 0.63;
    const P_PIP_END      = 0.78;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top", end: "+=3200",
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;

        if (p >= P_REVEAL_START && p < P_HOLD_END) {
          gsap.set(textRef.current, { autoAlpha: 1, y: 0, scale: 1, opacity: 1 });
          const range = P_REVEAL_END - P_REVEAL_START;
          chars.forEach((ch, i) => {
            const threshold = P_REVEAL_START + (i / chars.length) * range;
            const localP    = Math.min(1, Math.max(0, (p - threshold) / 0.08));
            gsap.set(ch, { opacity: localP, y: (1 - localP) * 18 });
          });
        }

        if (p >= P_REVEAL_END && p < P_HOLD_END)
          chars.forEach((ch) => gsap.set(ch, { opacity: 1, y: 0 }));

        if (p >= P_HOLD_END && p < P_EXIT_END) {
          const exit      = (p - P_HOLD_END) / (P_EXIT_END - P_HOLD_END);
          const e         = exit * exit * (3 - 2 * exit);
          const intensity = exit * exit;
          chars.forEach((ch, i) => {
            const seed    = i * 1.7;
            const noiseX  = Math.sin(seed + p * 80) * 5 * intensity;
            const noiseY  = Math.cos(seed * 0.9 + p * 60) * 4 * intensity;
            const flicker = Math.sin(seed * 3.1 + p * 140) > (0.4 - intensity * 0.8)
              ? 1 : Math.max(0, 1 - intensity * 1.2);
            gsap.set(ch, { x: noiseX, y: noiseY, opacity: flicker });
          });
          gsap.set(textRef.current, {
            autoAlpha: 1 - e * 0.85,
            y: -e * (typeof window !== "undefined" ? window.innerHeight / 10 : 80),
            scale: 1 + e * 0.03,
          });
        }

        const P_CLOSE_START = 0.88;
        if (p >= P_EXIT_END && p < P_CLOSE_START) {
          gsap.set(textRef.current, { autoAlpha: 0, pointerEvents: "none" });
          const pipP = Math.min(1, (p - P_EXIT_END) / (P_PIP_END - P_EXIT_END));
          gsap.set(pipboyRef.current, {
            clipPath: `inset(${50 * (1 - pipP)}% 0 ${50 * (1 - pipP)}% 0)`,
            opacity: Math.min(1, pipP * 1.4),
            pointerEvents: pipP >= 1 ? "auto" : "none",
          });
        }

        if (p >= 0.78) {
          document.querySelectorAll(`.${styles.fill}`).forEach((el) => { (el as HTMLElement).style.width = "100%"; });
          const targets = ["78%", "92%", "65%"];
          document.querySelectorAll(`.${styles.miniFill}`).forEach((el, i) => {
            (el as HTMLElement).style.width = targets[i] ?? "80%";
          });
        }

        if (p < 0.03) {
          gsap.set(textRef.current, { autoAlpha: 0, y: 0, scale: 1, opacity: 1 });
          chars.forEach((ch) => gsap.set(ch, { opacity: 0, y: 18, x: 0 }));
        }
      },
    });

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
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === sectionRef.current) st.kill();
      });
    };
  }, []);

  const miniStats = [
    t.boot.miniStatExperience,
    t.boot.miniStatCompletion,
    t.boot.miniStatReputation,
  ];

  return (
    <section ref={sectionRef} className="boot-section relative w-full h-screen">
      <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none" />
      <div ref={noiseRef} className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
        style={{ backgroundImage: "url('/images/noise.png')", backgroundSize: "200px" }} />
      <div ref={scanlinesRef} className="absolute inset-0 pointer-events-none z-30"
        style={{ background: "repeating-linear-gradient(to bottom,rgba(0,0,0,0.2) 0px,rgba(0,0,0,0.2) 1px,transparent 2px,transparent 4px)" }} />

      {/* CONNECTION FOUND */}
      <div className="absolute inset-0 flex items-center justify-center z-40">
        <div ref={textRef} className={`${styles.terminal} title`} />
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && selectedData && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <button className={`${styles.lightboxArrow} ${styles.lightboxArrowLeft}`}
            onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }} aria-label={t.boot.lightboxPrev}>‹</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={lightboxImgRef} src={selectedData.screenshots[lightboxIndex]}
            alt={`Screenshot ${lightboxIndex + 1}`} className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()} />
          <button className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
            onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }} aria-label={t.boot.lightboxNext}>›</button>
          <div className={styles.lightboxMeta} onClick={(e) => e.stopPropagation()}>
            <span className={styles.lightboxCounter}>
              {String(lightboxIndex + 1).padStart(2, "0")} / {String(selectedData.screenshots.length).padStart(2, "0")}
            </span>
            <button className={styles.lightboxClose} onClick={closeLightbox} aria-label={t.boot.lightboxClose}>✕</button>
          </div>
          <div className={styles.lightboxDots} onClick={(e) => e.stopPropagation()}>
            {selectedData.screenshots.map((_, i) => (
              <button key={i}
                className={`${styles.lightboxDot} ${i === lightboxIndex ? styles.lightboxDotActive : ""}`}
                onClick={() => {
                  const dir = i > lightboxIndex ? 1 : -1;
                  setLightboxIndex(i);
                  if (lightboxImgRef.current)
                    gsap.fromTo(lightboxImgRef.current, { opacity: 0, x: dir * 20 }, { opacity: 1, x: 0, duration: 0.22, ease: "power2.out" });
                }}
                aria-label={`Screenshot ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* PIP-BOY */}
      <div ref={pipboyRef} className={`${styles.pipBoyOverlay} pipboy-ui`}>
        <div className={styles.gridLines} />
        <div className={styles.vignette} />

        <div className={styles.mainContent}>
          <div className={styles.scanlineOverlay} />

          {/* MOBILE LOGO BAR */}
          <div className={styles.mobileLogoBar}>
            <div className={styles.mobileLogoBarLabel}>{t.boot.mobileLogoBarLabel}</div>
            <div className={styles.mobileLogoScroll}>
              {projects.map((p) => (
                <button
                  key={p.name}
                  className={`${styles.mobileLogoBtn} ${selectedProject === p.name ? styles.mobileLogoBtnActive : ""}`}
                  onClick={() => handleProjectClick(p.name)}
                  aria-label={p.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logo} alt={p.name} className={styles.mobileLogoBtnImg} />
                  <span className={styles.mobileLogoBtnTag}>{p.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Drawer toggle */}
          <button
            className={`${styles.drawerToggle} ${drawerOpen ? styles.drawerToggleOpen : ""}`}
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label="Toggle project list"
          >
            {drawerOpen ? "◀" : "▶"}
            <span className={styles.drawerToggleLabel}>{t.boot.drawerToggleLabel}</span>
          </button>

          {drawerOpen && (
            <div className={styles.drawerBackdrop} onClick={() => setDrawerOpen(false)} />
          )}

          {/* LEFT PANEL */}
          <div className={`${styles.leftPanel} ${drawerOpen ? styles.leftPanelDrawerOpen : ""}`}>
            <div className={styles.panelTitle}>{t.boot.panelTitle}</div>
            <div className={styles.projectsList}>
              <ul>
                {projects.map((p) => (
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
              {miniStats.map((label) => (
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
              {/* Default view */}
              <div className={`${styles.defaultView} ${selectedData ? styles.defaultViewHidden : ""}`}>
                <div className={styles.spriteWrapper}>
                  <div className={styles.spriteFrame} />
                  <div ref={spriteWrapRef} className={styles.spriteAnimWrap}>
                    <div ref={spriteRef} className={styles.spriteEl}
                      style={{
                        width: SPRITE_WIDTH, height: SPRITE_HEIGHT,
                        backgroundImage: "url('/images/boot-sprite-sheet.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${SPRITE_COLS * SPRITE_WIDTH}px ${SPRITE_ROWS * SPRITE_HEIGHT}px`,
                      }}
                    />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={logoRef} src="" alt="" className={styles.projectLogo} style={{ opacity: 0 }} />
                </div>

                <p className={styles.spriteLabel}>{t.boot.spriteLabel}</p>
                <p className={styles.spriteTitle}>{displayProject?.name ?? t.boot.spriteTitle}</p>
                <p className={styles.spriteDescription}>{displayProject?.description ?? t.boot.spriteDefaultDesc}</p>
                {!selectedData && <p className={styles.spriteHint}>{t.boot.spriteHint}</p>}
              </div>

              {/* Expanded view */}
              <div className={`${styles.expandedView} ${selectedData ? styles.expandedViewVisible : ""}`}>
                {selectedData && (
                  <div ref={expandedBodyRef} className={styles.expandedBody}>
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
                      <button className={styles.closeBtn} onClick={closeExpanded} aria-label={t.boot.closeBtnLabel}>✕</button>
                    </div>

                    <div className={styles.screenshotsGrid}>
                      {selectedData.screenshots.map((src, i) => (
                        <div key={i} className={styles.screenshotWrap} onClick={() => openLightbox(i)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`screenshot ${i + 1}`} className={styles.screenshot} />
                          <span className={styles.screenshotLabel}>SCR-{String(i + 1).padStart(2, "0")}</span>
                          <span className={styles.screenshotZoom}>⊕</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.detailsRow}>
                      <div className={styles.detailBlock}>
                        <div className={styles.detailLabel}>{t.boot.missionObjectiveLabel}</div>
                        <p className={styles.problemText}>{selectedData.problem}</p>
                      </div>
                      <div className={styles.detailBlock}>
                        <div className={`${styles.detailLabel} ${styles.resultLabel}`}>{t.boot.outcomeLabel}</div>
                        <p className={styles.resultText}>{selectedData.result}</p>
                      </div>
                    </div>

                    <div className={styles.ctaRow}>
                      {selectedData.repoAvailable === false ? (
                        <span className={`${styles.ctaBtn} ${styles.ctaBtnUnavailable}`}>
                          <span className={styles.ctaBtnIcon}>⊘</span> {t.boot.unavailableBtn.replace("⊘ ", "")}
                        </span>
                      ) : (
                        <a href={selectedData.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
                          <span className={styles.ctaBtnIcon}>⌥</span> {t.boot.repoBtn.replace("⌥ ", "")}
                        </a>
                      )}
                      {selectedData.videoAvailable === false ? (
                        <span className={`${styles.ctaBtn} ${styles.ctaBtnAlt} ${styles.ctaBtnUnavailable}`}>
                          <span className={styles.ctaBtnIcon}>⊘</span> {t.boot.unavailableBtn.replace("⊘ ", "")}
                        </span>
                      ) : (
                        <a href={selectedData.videoUrl} target="_blank" rel="noopener noreferrer" className={`${styles.ctaBtn} ${styles.ctaBtnAlt}`}>
                          <span className={styles.ctaBtnIcon}>▶</span> {t.boot.videoBtn.replace("▶ ", "")}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <div className={styles.statBox}>
              <span>{t.boot.footerHp}</span>
              <div className={styles.bar}><div className={styles.fill} style={{ width: "0%", transition: "width 1s steps(10)" }} /></div>
              <span>{t.boot.footerHpVal}</span>
            </div>
          </div>
          <div className={styles.footerCenter}>
            <span>{t.boot.footerCenter}</span>
            <span className={styles.cursor} />
          </div>
          <div className={styles.footerRight}>
            <div className={styles.statBox}>
              <span>{t.boot.footerAp}</span>
              <div className={styles.bar}><div className={styles.fill} style={{ width: "0%", transition: "width 1s steps(10)" }} /></div>
              <span>{t.boot.footerApVal}</span>
            </div>
            <span className={styles.coords}>{t.boot.footerLvl}</span>
          </div>
        </div>
      </div>
    </section>
  );
};