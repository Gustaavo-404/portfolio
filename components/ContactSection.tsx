"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ContactSection.module.css";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

type Status = "idle" | "loading" | "success" | "error";

function SignalWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLOR  = "#8cffb0";
    const LINE_W = 1.2;
    const SPEED  = 0.018;
    const WAVES  = [
      { amp: 18, freq: 0.022, phase: 0,   alpha: 0.85 },
      { amp: 10, freq: 0.045, phase: 1.2, alpha: 0.45 },
      { amp:  6, freq: 0.08,  phase: 2.6, alpha: 0.25 },
      { amp:  3, freq: 0.15,  phase: 0.8, alpha: 0.15 },
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
      ctx.beginPath();
      ctx.strokeStyle = `rgba(140,255,176,0.08)`;
      ctx.lineWidth = 1;
      ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();

      WAVES.forEach(({ amp, freq, phase, alpha }) => {
        ctx.beginPath();
        ctx.strokeStyle = COLOR;
        ctx.globalAlpha = alpha;
        ctx.lineWidth   = LINE_W;
        ctx.lineJoin    = "round";
        for (let x = 0; x <= W; x++) {
          const y = cy + Math.sin(x * freq + tRef.current + phase) * amp + Math.sin(x * freq * 0.6 + tRef.current * 1.3 + phase * 0.7) * (amp * 0.4);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      ctx.strokeStyle = `rgba(140,255,176,0.06)`;
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 14) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      tRef.current += SPEED;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className={styles.waveCanvas} aria-hidden="true" />;
}

export const ContactSection = () => {
  const { t } = useLanguage();
  const ct = t.contact;

  const statusLabels: Record<Status, string> = {
    idle:    ct.statusIdle,
    loading: ct.statusLoading,
    success: ct.statusSuccess,
    error:   ct.statusError,
  };

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const radarRef   = useRef<HTMLDivElement>(null);
  const formRef    = useRef<HTMLDivElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);
  const waveRef    = useRef<HTMLDivElement>(null);
  const borderRef  = useRef<HTMLDivElement>(null);

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<Status>("idle");
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const corners  = section.querySelectorAll(`.${styles.corner}`);
    const headPre   = section.querySelector(`.${styles.headingPre}`);
    const headTitle = section.querySelector(`.${styles.headingTitle}`);
    const headDesc  = section.querySelector(`.${styles.headingDesc}`);
    const dividers  = section.querySelectorAll(`.${styles.divider}`);

    gsap.set(corners,           { opacity: 0, scale: 0.6 });
    gsap.set(borderRef.current, { scaleX: 0, transformOrigin: "left" });
    gsap.set(headPre,           { opacity: 0, x: -12 });
    gsap.set(headTitle,         { opacity: 0, y: 22, filter: "blur(6px)" });
    gsap.set(headDesc,          { opacity: 0, y: 8 });
    gsap.set(radarRef.current,  { opacity: 0, scale: 0.92, y: 16 });
    gsap.set(formRef.current,   { opacity: 0, y: 24 });
    gsap.set(linksRef.current,  { opacity: 0, x: -10 });
    gsap.set(waveRef.current,   { opacity: 0, y: 12, scaleY: 0.7 });
    gsap.set(dividers,          { scaleX: 0, transformOrigin: "left" });

    ScrollTrigger.create({
      trigger: section, start: "top 72%", once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(corners,          { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)", stagger: 0.06 })
          .to(borderRef.current,{ scaleX: 1, duration: 0.45, ease: "power2.inOut" }, "-=0.1")
          .to(headPre,          { opacity: 1, x: 0, duration: 0.35 }, "-=0.15")
          .to(dividers,         { scaleX: 1, duration: 0.4, stagger: 0.08, ease: "power2.inOut" }, "-=0.2")
          .to(headTitle,        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power4.out" }, "-=0.25")
          .to(headDesc,         { opacity: 0.35, y: 0, duration: 0.4 }, "-=0.2")
          .to(radarRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.5 }, "-=0.15")
          .to(linksRef.current, { opacity: 1, x: 0, duration: 0.4 }, "-=0.25")
          .to(formRef.current,  { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
          .to(waveRef.current,  { opacity: 1, y: 0, scaleY: 1, transformOrigin: "bottom", duration: 0.4, ease: "power2.out" }, "-=0.2");
      },
    });

    return () => { ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === section) st.kill(); }); };
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())                                                e.name    = ct.errorRequired;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email   = ct.errorInvalid;
    if (message.trim().length < 10)                                  e.message = ct.errorMinChars;
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === "loading" || status === "success") return;
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, message }) });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const isLocked = status === "loading" || status === "success";

  const socialLinks = [
    { label: ct.socialLinks.linkedin.label, sub: ct.socialLinks.linkedin.sub, href: "https://www.linkedin.com/in/gustavo-medeiros-de-barros-092230279/" },
    { label: ct.socialLinks.github.label,   sub: ct.socialLinks.github.sub,   href: "https://github.com/Gustaavo-404" },
    { label: ct.socialLinks.email.label,    sub: ct.socialLinks.email.sub,    href: "mailto:gustmb2005@gmail.com" },
    { label: ct.socialLinks.phone.label,    sub: ct.socialLinks.phone.sub,    href: "https://wa.me/5519994328547" },
  ];

  return (
    <section ref={sectionRef} className={styles.section} id="ContactSection">
      <div className={styles.scanlines} />
      <div className={styles.noise} style={{ backgroundImage: "url('/images/noise.png')", backgroundSize: "200px" }} />

      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerTR}`} />
      <div className={`${styles.corner} ${styles.cornerBL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      <div ref={borderRef} className={styles.topBorder} />

      <div className={styles.inner}>
        <div ref={headingRef} className={styles.heading}>
          <span className={styles.headingPre}>{ct.headingPre}</span>
          <div className={styles.divider} />
          <h2 className={`${styles.headingTitle} title`}>{ct.headingTitle}</h2>
          <p className={styles.headingDesc}>
            {ct.headingDesc.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </p>
        </div>

        <div className={styles.grid}>
          <div ref={radarRef} className={styles.radarCol}>
            <div className={styles.radioScreen}>
              <div className={styles.radioSweep} />
              {[0,1,2,3,4].map(i => (
                <div key={i} className={styles.radioRing} style={{ animationDelay: `${i * 0.36}s` }} />
              ))}
              <div className={styles.radioDot} />
              <div className={styles.radioInterference} />
            </div>

            <div className={styles.radarMeta}>
              <div className={styles.radarMetaRow}>
                <span className={styles.radarMetaKey}>{ct.radarFreqLabel}</span>
                <span className={styles.radarMetaVal}>{ct.radarFreqValue}</span>
              </div>
              <div className={styles.radarMetaRow}>
                <span className={styles.radarMetaKey}>{ct.radarModeLabel}</span>
                <span className={styles.radarMetaVal}>{ct.radarModeValue}</span>
              </div>
              <div className={styles.radarMetaRow}>
                <span className={styles.radarMetaKey}>{ct.radarSigLabel}</span>
                <div className={styles.sigBars}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`${styles.sigBar} ${i < 3 ? styles.sigBarOn : ""}`}
                      style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
              </div>
              <div className={`${styles.radarMetaRow} ${styles.radarStatusRow}`}>
                <span className={styles.radarStatus}>{ct.radarStatusText}</span>
                <span className={styles.radarStatusCursor}>█</span>
              </div>
            </div>

            <div className={styles.links} ref={linksRef}>
              <div className={styles.linksLabel}>{ct.socialLinksTitle}</div>
              {socialLinks.map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  <div className={styles.linkLeft}>
                    <span className={styles.linkArrow}>→</span>
                    <span className={styles.linkLabel}>{link.label}</span>
                  </div>
                  <span className={styles.linkSub}>{link.sub}</span>
                </a>
              ))}
            </div>
          </div>

          <div ref={formRef} className={styles.formCol}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.fieldRow}>
                <Field label={ct.fieldNameLabel} idx="01" error={errors.name}>
                  <input type="text" className={styles.inputEl} value={name}
                    onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                    disabled={isLocked} autoComplete="off" spellCheck={false} placeholder={ct.namePlaceholder} />
                </Field>
                <Field label={ct.fieldEmailLabel} idx="02" error={errors.email}>
                  <input type="email" className={styles.inputEl} value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                    disabled={isLocked} autoComplete="off" spellCheck={false} placeholder={ct.emailPlaceholder} />
                </Field>
              </div>

              <Field label={ct.fieldMessageLabel} idx="03" error={errors.message}>
                <textarea className={`${styles.inputEl} ${styles.textarea}`} value={message}
                  onChange={e => { setMessage(e.target.value); setErrors(p => ({ ...p, message: "" })); }}
                  disabled={isLocked} spellCheck={false} rows={5} placeholder={ct.messagePlaceholder} />
                <div className={styles.charRow}>
                  <span>{ct.charCount(message.length)}</span>
                  <span className={message.length >= 10 ? styles.charReady : styles.charWarn}>
                    {message.length >= 10 ? ct.charReady : ct.charWarn}
                  </span>
                </div>
              </Field>

              <div className={styles.submitRow}>
                <button type="submit" disabled={isLocked} className={[
                  styles.submitBtn,
                  status === "success" ? styles.btnSuccess : "",
                  status === "error"   ? styles.btnError   : "",
                  status === "loading" ? styles.btnLoading : "",
                ].join(" ")}>
                  {statusLabels[status]}
                  {status === "loading" && <span className={styles.btnCursor}>█</span>}
                </button>
                {status === "success" && <p className={styles.confirmNote}>{ct.confirmNote}</p>}
                {status === "error"   && (
                  <button type="button" className={styles.retryBtn} onClick={() => setStatus("idle")}>
                    {ct.retryBtn}
                  </button>
                )}
              </div>
            </form>

            <div ref={waveRef} className={styles.wavePanel}>
              <div className={styles.wavePanelHeader}>
                <span className={styles.wavePanelLabel}>{ct.wavePanelLabel}</span>
                <span className={styles.wavePanelMeta}>{ct.wavePanelMeta}</span>
                <span className={styles.wavePanelDot} />
              </div>
              <div className={styles.waveContainer}>
                <SignalWaveform />
                <div className={styles.waveYAxis}><span>+</span><span>0</span><span>−</span></div>
              </div>
              <div className={styles.wavePanelFooter}>
                <span>{ct.waveFooterRate}</span>
                <span>{ct.waveFooterDepth}</span>
                <span>{ct.waveFooterBuf}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span>{ct.bottomLeft}</span>
          <span className={styles.cursor} />
          <span>{ct.bottomRight}</span>
        </div>
      </div>
    </section>
  );
};

function Field({ label, idx, error, children }: { label: string; idx: string; error?: string; children: React.ReactNode }) {
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