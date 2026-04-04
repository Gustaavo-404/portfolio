"use client";

import { useEffect, useRef, useState } from "react";
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
    repoUrl: "https://github.com/",
    videoUrl: "https://youtube.com/",
  },
  {
    name: "AlphaWeb",
    tag: "WEB",
    logo: "/images/logos/alphaweb.png",
    screenshots: ["/images/screenshots/alphaweb1.png", "/images/screenshots/alphaweb2.png", "/images/screenshots/alphaweb3.png"],
    stack: ["MySQL", "Java", "PHP", "Python", "Transformers", "GPT-4o mini", "DeepSeek V3", "Llama 3.8B", "Three.js"],
    problem: "Deploying a custom AI chatbot requires deep ML knowledge, putting the technology out of reach for most teams.",
    result: "A chatbot library platform that reduces creation to a form — name, dataset, prompt, category — abstracting all model complexity behind a clean UI.",
    description: "Full-stack platform for building and managing AI chatbots via form-based configuration. Multi-model LLM support with a public chatbot library.",
    repoUrl: "https://github.com/",
    videoUrl: "https://youtube.com/",
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
    repoUrl: "https://github.com/",
    videoUrl: "https://youtube.com/",
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
    repoUrl: "https://github.com/",
    videoUrl: "https://youtube.com/",
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
    videoUrl: "https://youtube.com/",
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
    repoUrl: "https://github.com/",
    videoUrl: "https://youtube.com/",
  },
];

// Glitch chars pool — reduzido para animação mais sutil
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

  // FIX: ref para controlar o logo swap sem race condition
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

  // FIX: Logo swap com cancelamento correto de animações pendentes
  useEffect(() => {
    if (!logoRef.current || !spriteWrapRef.current) return;

    // Cancela tweens anteriores
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
      // Garante que a logo some ANTES de mostrar o sprite
      const t1 = gsap.to(logoRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          // Só mostra o sprite depois que a logo sumiu completamente
          if (!currentHoverRef.current) {
            const t2 = gsap.to(spriteWrapRef.current, { opacity: 1, duration: 0.2, ease: "power2.out" });
            logoAnimRef.current.push(t2);
          }
        },
      });
      logoAnimRef.current = [t1];
    }
  }, [displayProject]);

  // Atualiza ref de hover para uso no callback de onComplete
  useEffect(() => {
    currentHoverRef.current = hoveredProject;
  }, [hoveredProject]);

  // Expand center for selected
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

  // ── Main scroll / animation setup ──────────────────────────────
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

    // ── "CONNECTION FOUND" — modelo 100% determinístico ──
    //
    // Regra de ouro: o estado de cada char deve ser uma FUNÇÃO PURA de `p`.
    // Zero setInterval, zero one-shot flags — qualquer valor de p (scroll
    // lento, rápido, de volta) produz exatamente o mesmo visual.
    // O "glitch" é implementado como noise deterministico por índice: cada
    // char tem uma seed fixa e o conteúdo é calculado a partir do progresso
    // local do char, sem async.

    const TARGET = "CONNECTION FOUND";

    // Tabela de seeds por char (fixa, gerada uma vez)
    const CHAR_SEEDS = TARGET.split("").filter(c => c !== " ").map(() => Math.random());

    let ci = 0;
    textRef.current.innerHTML = TARGET.split("")
      .map((ch) => {
        if (ch === " ") return `<span class="${styles.space}">&nbsp;</span>`;
        const idx = ci++;
        return `<span class="${styles.char}" data-final="${ch}" data-idx="${idx}">${ch}</span>`;
      })
      .join("");

    const chars = Array.from(textRef.current.querySelectorAll<HTMLElement>(`.${styles.char}`));
    gsap.set(chars, { opacity: 0, y: 0 });

    // Scanline element
    const scanEl = document.createElement("div");
    scanEl.className = styles.termScanline;
    textRef.current.appendChild(scanEl);
    scanLineRef.current = scanEl;
    gsap.set(scanEl, { scaleX: 0, opacity: 0 });

    // Faixas de progresso (todas baseadas em p, sem estado externo)
    const P_SCAN_START  = 0.04;
    const P_REVEAL_START = 0.06;
    const P_REVEAL_END   = 0.42;  // todos os chars garantidamente visíveis aqui
    const P_EXIT_START   = 0.52;
    const P_EXIT_END     = 0.64;
    const P_PIP_END      = 0.78;

    // Glitch lookup deterministico: dado um progresso local (0→1) e uma seed,
    // retorna o char final OU um símbolo de glitch. Acima de glitchThreshold
    // (0.55) sempre retorna o char final — garantindo que chars estabilizem.
    const getCharAt = (final: string, localP: number, seed: number): string => {
      if (localP >= 0.55) return final;
      // Janela de glitch: 0→0.55. Usa noise periódico para parecer aleatório
      // mas ser determinístico: sin(seed*100 + localP*30)
      const noise = (Math.sin(seed * 100 + localP * 30) + 1) / 2;
      if (noise > 0.45) return final;
      return GLITCH_CHARS[Math.floor(noise * GLITCH_CHARS.length)];
    };

    // Scanline: animada uma só vez via GSAP (não depende de scroll depois)
    let scanFired = false;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=3200",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;

        // ── Scanline (dispara uma vez ao entrar, reseta ao sair) ──
        if (p >= P_SCAN_START && !scanFired) {
          scanFired = true;
          gsap.to(textRef.current, { autoAlpha: 1, duration: 0.01 });
          gsap.fromTo(scanEl,
            { scaleX: 0, opacity: 0.6 },
            { scaleX: 1, opacity: 0.6, duration: 0.45, ease: "power2.inOut",
              onComplete: () => { gsap.to(scanEl, { opacity: 0, duration: 0.35 }); } }
          );
        }
        if (p < P_SCAN_START && scanFired) {
          scanFired = false;
          gsap.set(scanEl, { scaleX: 0, opacity: 0 });
        }

        // ── Phase 1 + 2: reveal + hold ──
        // Abaixo de EXIT_START: calculamos o estado de cada char
        // puramente a partir de p. Não há setInterval nem flags.
        if (p >= P_REVEAL_START && p < P_EXIT_START) {
          gsap.set(textRef.current, { autoAlpha: 1, opacity: 1, scale: 1, y: 0, letterSpacing: "0.18em" });

          const revealRange = P_REVEAL_END - P_REVEAL_START;

          chars.forEach((char, i) => {
            const final = char.dataset.final ?? "";
            const seed  = CHAR_SEEDS[i] ?? 0.5;

            // Threshold: quando este char começa a aparecer
            const charStart = P_REVEAL_START + (i / chars.length) * revealRange;
            // Janela de transição de cada char (0.06 de p = ~6% do scroll total)
            const charWindow = 0.06;
            const charEnd    = charStart + charWindow;

            if (p < charStart) {
              // Ainda não chegou
              gsap.set(char, { opacity: 0, y: 5 });
              char.textContent = final;
              return;
            }

            // Progresso local deste char: 0 → 1
            const localP = Math.min(1, (p - charStart) / charWindow);

            // Conteúdo: glitch deterministico → final
            char.textContent = getCharAt(final, localP, seed);

            // Opacidade e y: fade in suave
            gsap.set(char, {
              opacity: Math.min(1, localP * 2),   // sobe rápido até 1
              y: (1 - localP) * 5,
            });
          });
        }

        // ── Força o estado final de todos os chars quando p >= REVEAL_END ──
        // Isso garante que mesmo com scroll ultra-rápido, nenhum char fica
        // preso em símbolo ao entrar na fase de saída ou pip-boy.
        if (p >= P_REVEAL_END && p < P_EXIT_START) {
          chars.forEach((char) => {
            char.textContent = char.dataset.final ?? "";
            gsap.set(char, { opacity: 1, y: 0 });
          });
          gsap.set(textRef.current, { autoAlpha: 1, opacity: 1, scale: 1, y: 0, letterSpacing: "0.18em" });
        }

        // ── Phase 3: saída — fade + scale suave ──
        if (p >= P_EXIT_START && p < P_EXIT_END) {
          // Garante chars corretos antes de sair
          chars.forEach((char) => { char.textContent = char.dataset.final ?? ""; });

          const exit = (p - P_EXIT_START) / (P_EXIT_END - P_EXIT_START);
          gsap.set(textRef.current, {
            autoAlpha: 1 - exit,
            opacity: 1 - exit,
            scale: 1 + exit * 0.04,
            y: -exit * (window.innerHeight / 14),
            letterSpacing: `${0.18 + exit * 0.06}em`,
          });
        }

        // ── Phase 4: pip-boy reveal ──
        if (p >= P_EXIT_END) {
          gsap.set(textRef.current, { autoAlpha: 0, pointerEvents: "none" });

          const pipP = Math.min(1, (p - P_EXIT_END) / (P_PIP_END - P_EXIT_END));
          gsap.set(pipboyRef.current, {
            clipPath: `inset(${50 * (1 - pipP)}% 0 ${50 * (1 - pipP)}% 0)`,
            opacity: Math.min(1, pipP * 1.5),
            pointerEvents: pipP >= 1 ? "auto" : "none",
          });
          if (pipP >= 1 && !pipVisible) setPipVisible(true);
        } else {
          gsap.set(pipboyRef.current, { clipPath: "inset(50% 0 50% 0)", opacity: 0, pointerEvents: "none" });
        }

        // ── Bars fill in ──
        if (p >= 0.78) {
          document.querySelectorAll(`.${styles.fill}`).forEach((el) => { (el as HTMLElement).style.width = "100%"; });
          const targets = ["78%", "92%", "65%"];
          document.querySelectorAll(`.${styles.miniFill}`).forEach((el, i) => {
            (el as HTMLElement).style.width = targets[i] ?? "80%";
          });
        }

        // ── Reset completo ao voltar ao início ──
        if (p < 0.03) {
          scanFired = false;
          gsap.set(textRef.current, { autoAlpha: 0, opacity: 1, scale: 1, y: 0, letterSpacing: "0.18em" });
          gsap.set(scanEl, { scaleX: 0, opacity: 0 });
          chars.forEach((ch) => {
            ch.textContent = ch.dataset.final ?? "";
            gsap.set(ch, { opacity: 0, y: 0 });
          });
        }
      },
    });

    // ── Sprite animation ────────────────────────────────────────
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

      {/* CONNECTION FOUND text — usa classe .title do CSS global */}
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