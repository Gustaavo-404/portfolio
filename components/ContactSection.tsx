"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ContactSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: "LINKEDIN",  sub: "open channel",  href: "https://www.linkedin.com/in/gustavo-medeiros-de-barros-092230279/" },
  { label: "GITHUB",    sub: "open source",    href: "https://github.com/Gustaavo-404" },
  { label: "EMAIL",     sub: "direct line",    href: "mailto:gustmb2005@gmail.com" },
  { label: "PHONE",     sub: "send message",href: "https://wa.me/5519994328547" },
];

const STATUS_LABELS = {
  idle:    "> TRANSMIT",
  loading: "> SENDING...",
  success: "> MESSAGE TRANSMITTED",
  error:   "> TRANSMISSION FAILED — RETRY?",
} as const;

type Status = keyof typeof STATUS_LABELS;

export const ContactSection = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const radarRef    = useRef<HTMLDivElement>(null);
  const formRef     = useRef<HTMLDivElement>(null);
  const linksRef    = useRef<HTMLDivElement>(null);

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<Status>("idle");
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  // ── Entrance ──
  useEffect(() => {
    const els = [headingRef.current, radarRef.current, formRef.current, linksRef.current];
    gsap.set(els, { opacity: 0, y: 28 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.12,
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === sectionRef.current) st.kill();
      });
    };
  }, []);

  // ── Validate ──
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())                                               e.name    = "REQUIRED";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "INVALID";
    if (message.trim().length < 10)                                 e.message = "MIN 10 CHARS";
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

      {/* Ambient scanlines over full section */}
      <div className={styles.scanlines} />
      <div className={styles.noise}
        style={{ backgroundImage: "url('/images/noise.png')", backgroundSize: "200px" }} />

      <div className={styles.inner}>

        {/* ── HEADING BLOCK ── */}
        <div ref={headingRef} className={styles.heading}>
          <span className={styles.headingPre}>◎ FINAL TRANSMISSION</span>
          <h2 className={`${styles.headingTitle} title`}>Get in touch.</h2>
          <p className={styles.headingDesc}>
            connection unstable — signal routed through relay node.<br />
            transmission will be delivered upon stabilization.
          </p>
        </div>

        {/* ── MAIN GRID: radar + form ── */}
        <div className={styles.grid}>

          {/* RADAR COLUMN */}
          <div ref={radarRef} className={styles.radarCol}>

            {/* Radio screen */}
            <div className={styles.radioScreen}>
              <div className={styles.radioSweep} />
              {[0,1,2,3,4].map(i => (
                <div key={i} className={styles.radioRing}
                  style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
              <div className={styles.radioDot} />
              <div className={styles.radioInterference} />
            </div>

            {/* Status readout */}
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

              {/* NAME + EMAIL row */}
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

              {/* MESSAGE */}
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

              {/* Submit */}
              <div className={styles.submitRow}>
                <button
                  type="submit"
                  disabled={isLocked}
                  className={`${styles.submitBtn}
                    ${status === "success" ? styles.btnSuccess : ""}
                    ${status === "error"   ? styles.btnError   : ""}
                    ${status === "loading" ? styles.btnLoading : ""}
                  `}
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

/* ── Sub-component: Field ── */
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