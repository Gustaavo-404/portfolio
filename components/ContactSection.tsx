"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ContactSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: "LINKEDIN", sub: "open channel",  href: "https://www.linkedin.com/in/gustavo-medeiros-de-barros-092230279/" },
  { label: "GITHUB",   sub: "open source",   href: "https://github.com/Gustaavo-404" },
  { label: "EMAIL",    sub: "direct line",   href: "mailto:gustmb2005@gmail.com" },
  { label: "PHONE",    sub: "send message",  href: "https://wa.me/5519994328547" },
];

const STATUS_LABELS = {
  idle:    "> TRANSMIT",
  loading: "> SENDING...",
  success: "> MESSAGE TRANSMITTED",
  error:   "> TRANSMISSION FAILED — RETRY?",
} as const;

type Status = keyof typeof STATUS_LABELS;

// ── Waveform canvas component ──
function SignalWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLOR      = "#8cffb0";
    const LINE_W     = 1.2;
    const SPEED      = 0.018;
    // Multiple layered waves for richness
    const WAVES = [
      { amp: 18, freq: 0.022, phase: 0,    alpha: 0.85 },
      { amp: 10, freq: 0.045, phase: 1.2,  alpha: 0.45 },
      { amp:  6, freq: 0.08,  phase: 2.6,  alpha: 0.25 },
      { amp:  3, freq: 0.15,  phase: 0.8,  alpha: 0.15 },
    ];

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // Horizontal baseline
      ctx.beginPath();
      ctx.strokeStyle = `rgba(140,255,176,0.08)`;
      ctx.lineWidth = 1;
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();

      // Each wave layer
      WAVES.forEach(({ amp, freq, phase, alpha }) => {
        ctx.beginPath();
        ctx.strokeStyle = COLOR;
        ctx.globalAlpha = alpha;
        ctx.lineWidth   = LINE_W;
        ctx.lineJoin    = "round";

        for (let x = 0; x <= W; x += 1) {
          const y = cy
            + Math.sin(x * freq + tRef.current + phase) * amp
            + Math.sin(x * freq * 0.6 + tRef.current * 1.3 + phase * 0.7) * (amp * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else         ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Vertical tick marks (like an oscilloscope grid)
      ctx.strokeStyle = `rgba(140,255,176,0.06)`;
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 14) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      tRef.current += SPEED;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.waveCanvas}
      aria-hidden="true"
    />
  );
}

// ── Main component ──
export const ContactSection = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const radarRef    = useRef<HTMLDivElement>(null);
  const formRef     = useRef<HTMLDivElement>(null);
  const linksRef    = useRef<HTMLDivElement>(null);
  const waveRef     = useRef<HTMLDivElement>(null);
  const borderRef   = useRef<HTMLDivElement>(null);

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<Status>("idle");
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  // ── Elaborate entrance animation ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Border corners animate in
    const corners = section.querySelectorAll(`.${styles.corner}`);
    // Individual lines of the heading chars — we'll split them manually
    const headPre   = section.querySelector(`.${styles.headingPre}`);
    const headTitle = section.querySelector(`.${styles.headingTitle}`);
    const headDesc  = section.querySelector(`.${styles.headingDesc}`);
    const dividers  = section.querySelectorAll(`.${styles.divider}`);

    // Set initial states
    gsap.set(corners,                    { opacity: 0, scale: 0.6 });
    gsap.set(borderRef.current,          { scaleX: 0, transformOrigin: "left" });
    gsap.set(headPre,                    { opacity: 0, x: -12 });
    gsap.set(headTitle,                  { opacity: 0, y: 22, filter: "blur(6px)" });
    gsap.set(headDesc,                   { opacity: 0, y: 8 });
    gsap.set(radarRef.current,           { opacity: 0, scale: 0.92, y: 16 });
    gsap.set(formRef.current,            { opacity: 0, y: 24 });
    gsap.set(linksRef.current,           { opacity: 0, x: -10 });
    gsap.set(waveRef.current,            { opacity: 0, y: 12, scaleY: 0.7 });
    gsap.set(dividers,                   { scaleX: 0, transformOrigin: "left" });

    ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1. Frame corners snap in
        tl.to(corners, {
          opacity: 1, scale: 1,
          duration: 0.3, ease: "back.out(2)",
          stagger: 0.06,
        })

        // 2. Top border line sweeps right
        .to(borderRef.current, {
          scaleX: 1, duration: 0.45, ease: "power2.inOut",
        }, "-=0.1")

        // 3. PRE label slides in
        .to(headPre, { opacity: 1, x: 0, duration: 0.35 }, "-=0.15")

        // 4. Dividers sweep
        .to(dividers, {
          scaleX: 1, duration: 0.4, stagger: 0.08, ease: "power2.inOut",
        }, "-=0.2")

        // 5. Title reveals with blur clear
        .to(headTitle, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.55, ease: "power4.out",
        }, "-=0.25")

        // 6. Desc fades in
        .to(headDesc, { opacity: 0.35, y: 0, duration: 0.4 }, "-=0.2")

        // 7. Radar + form stagger
        .to(radarRef.current, {
          opacity: 1, scale: 1, y: 0, duration: 0.5,
        }, "-=0.15")
        .to(linksRef.current, { opacity: 1, x: 0, duration: 0.4 }, "-=0.25")
        .to(formRef.current,  { opacity: 1, y: 0,  duration: 0.5 }, "-=0.35")

        // 8. Waveform panel rises
        .to(waveRef.current, {
          opacity: 1, y: 0, scaleY: 1,
          transformOrigin: "bottom",
          duration: 0.4, ease: "power2.out",
        }, "-=0.2");
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  // ── Validation ──
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())                                                e.name    = "REQUIRED";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email   = "INVALID";
    if (message.trim().length < 10)                                  e.message = "MIN 10 CHARS";
    setErrors(e);
    return !Object.keys(e).length;
  };

  // ── Submit ──
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === "loading" || status === "success") return;
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const isLocked = status === "loading" || status === "success";

  return (
    <section ref={sectionRef} className={styles.section}>

      {/* Ambient scanlines + noise */}
      <div className={styles.scanlines} />
      <div className={styles.noise}
        style={{ backgroundImage: "url('/images/noise.png')", backgroundSize: "200px" }} />

      {/* Frame corners */}
      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerTR}`} />
      <div className={`${styles.corner} ${styles.cornerBL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      {/* Top border sweep line */}
      <div ref={borderRef} className={styles.topBorder} />

      <div className={styles.inner}>

        {/* ── HEADING ── */}
        <div ref={headingRef} className={styles.heading}>
          <span className={styles.headingPre}>◎ FINAL TRANSMISSION</span>
          <div className={styles.divider} />
          <h2 className={`${styles.headingTitle} title`}>Get in touch.</h2>
          <p className={styles.headingDesc}>
            connection unstable — signal routed through relay node.<br />
            transmission will be delivered upon stabilization.
          </p>
        </div>

        {/* ── MAIN GRID ── */}
        <div className={styles.grid}>

          {/* RADAR COLUMN */}
          <div ref={radarRef} className={styles.radarCol}>

            <div className={styles.radioScreen}>
              <div className={styles.radioSweep} />
              {[0,1,2,3,4].map(i => (
                <div key={i} className={styles.radioRing}
                  style={{ animationDelay: `${i * 0.36}s` }} />
              ))}
              <div className={styles.radioDot} />
              <div className={styles.radioInterference} />
            </div>

            <div className={styles.radarMeta}>
              <div className={styles.radarMetaRow}>
                <span className={styles.radarMetaKey}>FREQ</span>
                <span className={styles.radarMetaVal}>118.3 MHz</span>
              </div>
              <div className={styles.radarMetaRow}>
                <span className={styles.radarMetaKey}>MODE</span>
                <span className={styles.radarMetaVal}>TX</span>
              </div>
              <div className={styles.radarMetaRow}>
                <span className={styles.radarMetaKey}>SIG</span>
                <div className={styles.sigBars}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i}
                      className={`${styles.sigBar} ${i < 3 ? styles.sigBarOn : ""}`}
                      style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                </div>
              </div>
              <div className={`${styles.radarMetaRow} ${styles.radarStatusRow}`}>
                <span className={styles.radarStatus}>TRANSMITTING</span>
                <span className={styles.radarStatusCursor}>█</span>
              </div>
            </div>

            {/* Social links */}
            <div className={styles.links} ref={linksRef}>
              <div className={styles.linksLabel}>▸ OPEN CHANNELS</div>
              {SOCIAL_LINKS.map(link => (
                <a key={link.label} href={link.href}
                  target="_blank" rel="noopener noreferrer"
                  className={styles.link}
                >
                  <div className={styles.linkLeft}>
                    <span className={styles.linkArrow}>→</span>
                    <span className={styles.linkLabel}>{link.label}</span>
                  </div>
                  <span className={styles.linkSub}>{link.sub}</span>
                </a>
              ))}
            </div>

          </div>

          {/* FORM COLUMN */}
          <div ref={formRef} className={styles.formCol}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>

              <div className={styles.fieldRow}>
                <Field label="NAME" idx="01" error={errors.name}>
                  <input
                    type="text"
                    className={styles.inputEl}
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                    disabled={isLocked}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="YOUR DESIGNATION"
                  />
                </Field>
                <Field label="EMAIL" idx="02" error={errors.email}>
                  <input
                    type="email"
                    className={styles.inputEl}
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                    disabled={isLocked}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="RETURN ADDRESS"
                  />
                </Field>
              </div>

              <Field label="MESSAGE PAYLOAD" idx="03" error={errors.message}>
                <textarea
                  className={`${styles.inputEl} ${styles.textarea}`}
                  value={message}
                  onChange={e => { setMessage(e.target.value); setErrors(p => ({ ...p, message: "" })); }}
                  disabled={isLocked}
                  spellCheck={false}
                  rows={5}
                  placeholder="ENCODE YOUR MESSAGE HERE..."
                />
                <div className={styles.charRow}>
                  <span>{message.length} chars</span>
                  <span className={message.length >= 10 ? styles.charReady : styles.charWarn}>
                    {message.length >= 10 ? "◆ ready" : "◇ min 10"}
                  </span>
                </div>
              </Field>

              <div className={styles.submitRow}>
                <button
                  type="submit"
                  disabled={isLocked}
                  className={[
                    styles.submitBtn,
                    status === "success" ? styles.btnSuccess : "",
                    status === "error"   ? styles.btnError   : "",
                    status === "loading" ? styles.btnLoading : "",
                  ].join(" ")}
                >
                  {STATUS_LABELS[status]}
                  {status === "loading" && <span className={styles.btnCursor}>█</span>}
                </button>
                {status === "success" && (
                  <p className={styles.confirmNote}>// signal confirmed. standby for response.</p>
                )}
                {status === "error" && (
                  <button type="button" className={styles.retryBtn} onClick={() => setStatus("idle")}>
                    RETRY
                  </button>
                )}
              </div>

            </form>

            {/* ── SIGNAL WAVEFORM PANEL ── */}
            <div ref={waveRef} className={styles.wavePanel}>
              <div className={styles.wavePanelHeader}>
                <span className={styles.wavePanelLabel}>◈ SIGNAL WAVEFORM</span>
                <span className={styles.wavePanelMeta}>CH-01 · 118.3 MHz · LIVE</span>
                <span className={styles.wavePanelDot} />
              </div>
              <div className={styles.waveContainer}>
                <SignalWaveform />
                {/* Y-axis labels */}
                <div className={styles.waveYAxis}>
                  <span>+</span>
                  <span>0</span>
                  <span>−</span>
                </div>
              </div>
              <div className={styles.wavePanelFooter}>
                <span>SAMPLE RATE: 44.1 kHz</span>
                <span>BIT DEPTH: 24</span>
                <span>BUFFER: OK</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className={styles.bottomBar}>
          <span>◈ CORE-TEC // LOC: SJRP-SP-111</span>
          <span className={styles.cursor} />
          <span>END OF LINE</span>
        </div>

      </div>
    </section>
  );
};

// ── Field sub-component ──
function Field({
  label, idx, error, children,
}: {
  label: string; idx: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className={styles.fieldWrap}>
      <div className={styles.fieldLabel}>
        <span className={styles.fieldIdx}>{idx}</span>
        <span>{label}</span>
        {error && <span className={styles.fieldError}> // {error}</span>}
      </div>
      <div className={`${styles.inputBox} ${error ? styles.inputBoxError : ""}`}>
        <span className={styles.inputPrompt}>›</span>
        <div className={styles.inputInner}>{children}</div>
      </div>
    </div>
  );
}