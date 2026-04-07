"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ConnectionLostSection.module.css";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const GLITCH = "▓░▒█▄▀■□◆◇○●◈∅⊗⌀⌘⌬⍟╬╪═║▐▌▀▄";
const gc = (p: number, seed: number) =>
  GLITCH[Math.floor(((Math.sin(seed * 13.7 + p * 90) + 1) / 2) * GLITCH.length)];

export const ConnectionLostSection = () => {
  const { t } = useLanguage();

  const sectionRef   = useRef<HTMLElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const textWrapRef  = useRef<HTMLDivElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const noiseRef     = useRef<HTMLDivElement>(null);
  const scanlinesRef = useRef<HTMLDivElement>(null);
  const staticRef    = useRef<HTMLDivElement>(null);
  const coordsRef    = useRef<HTMLDivElement>(null);
  const barRef       = useRef<HTMLDivElement>(null);
  const barFillRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !textWrapRef.current) return;

    const TEXT = t.connectionLost.headline;
    let ci = 0;
    textWrapRef.current.innerHTML = TEXT.split("").map(ch => {
      if (ch === " ") return `<span class="${styles.space}">&nbsp;</span>`;
      return `<span class="${styles.char}" data-final="${ch}" data-idx="${ci++}">${ch}</span>`;
    }).join("");

    const chars = Array.from(
      textWrapRef.current.querySelectorAll<HTMLSpanElement>(`.${styles.char}`)
    );

    gsap.set(textWrapRef.current, { autoAlpha: 0 });
    gsap.set(chars,               { opacity: 0, y: 0, x: 0, skewX: 0, filter: "blur(0px)" });
    gsap.set(subRef.current,      { autoAlpha: 0, y: 6 });
    gsap.set(noiseRef.current,    { autoAlpha: 0 });
    gsap.set(scanlinesRef.current,{ autoAlpha: 1 });
    gsap.set(staticRef.current,   { autoAlpha: 0 });
    gsap.set(coordsRef.current,   { autoAlpha: 0, x: -8 });
    gsap.set(barRef.current,      { autoAlpha: 0 });
    gsap.set(barFillRef.current,  { width: "100%" });
    gsap.set(overlayRef.current,  { autoAlpha: 0 });

    const P = { revealEnd: 0.10, holdEnd: 0.28, degradeEnd: 0.50, stormEnd: 0.70, fallEnd: 0.85, whiteEnd: 0.95 };
    let lastPhase = -1;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=400%",
      scrub: 0.8,
      pin: true,
      pinSpacing: true,
      onUpdate(self) {
        const p = self.progress;

        if (p < P.revealEnd) {
          if (lastPhase !== 1) { lastPhase = 1; gsap.set(textWrapRef.current, { autoAlpha: 1 }); }
          const frac = p / P.revealEnd;
          chars.forEach((ch, i) => {
            const thresh = i / chars.length;
            const local  = Math.max(0, Math.min(1, (frac - thresh) / 0.25));
            const drift  = (1 - local) * (i % 2 === 0 ? -8 : 8);
            gsap.set(ch, { opacity: local, x: drift, filter: local < 0.8 ? `blur(${(1 - local) * 4}px)` : "blur(0px)" });
            if (local < 0.6 && local > 0) ch.textContent = gc(p, i);
            else ch.textContent = ch.dataset.final ?? "";
          });
          if (frac > 0.7) gsap.set(subRef.current, { autoAlpha: Math.min(1, (frac - 0.7) / 0.3) * 0.45, y: 0 });
        }

        if (p >= P.revealEnd && p < P.holdEnd) {
          if (lastPhase !== 2) {
            lastPhase = 2;
            chars.forEach(ch => { ch.textContent = ch.dataset.final ?? ""; });
            gsap.set(chars, { opacity: 1, x: 0, filter: "blur(0px)", skewX: 0, y: 0 });
            gsap.set(subRef.current, { autoAlpha: 0.45, y: 0 });
            gsap.set(noiseRef.current, { autoAlpha: 0 });
            gsap.to(coordsRef.current, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out" });
            gsap.to(barRef.current,    { autoAlpha: 1,         duration: 0.35 });
          }
        }

        if (p >= P.holdEnd && p < P.degradeEnd) {
          if (lastPhase !== 3) { lastPhase = 3; }
          const frac = (p - P.holdEnd) / (P.degradeEnd - P.holdEnd);
          const intensity = frac * frac;
          gsap.set(barFillRef.current, { width: `${Math.max(0, 100 - frac * 72)}%` });
          gsap.set(noiseRef.current, { autoAlpha: frac * 0.35 });
          chars.forEach((ch, i) => {
            const seed = i * 1.9;
            const noise = (Math.sin(seed + p * 70) + 1) / 2;
            if (noise < intensity * 0.7) { ch.textContent = gc(p, i); gsap.set(ch, { skewX: Math.sin(seed * 2 + p * 50) * 8 * intensity, opacity: 0.5 + noise * 0.5 }); }
            else { ch.textContent = ch.dataset.final ?? ""; gsap.set(ch, { skewX: 0, opacity: 1 }); }
          });
          gsap.set(textWrapRef.current, { x: Math.sin(p * 200) * intensity * 6 });
        }

        if (p >= P.degradeEnd && p < P.stormEnd) {
          if (lastPhase !== 4) { lastPhase = 4; gsap.set(staticRef.current, { autoAlpha: 0 }); }
          const frac = (p - P.degradeEnd) / (P.stormEnd - P.degradeEnd);
          gsap.set(barFillRef.current, { width: `${Math.max(0, 28 - frac * 28)}%` });
          gsap.set(noiseRef.current,   { autoAlpha: 0.5 + frac * 0.3 });
          gsap.set(staticRef.current,  { autoAlpha: Math.sin(p * 300) > (0.6 - frac * 0.6) ? frac * 0.9 : 0 });
          gsap.set(textWrapRef.current, { x: Math.sin(p * 190) * 12 * frac, y: Math.cos(p * 170) * 4 * frac });
          chars.forEach((ch, i) => {
            const seed = i * 2.3;
            const noise = (Math.sin(seed + p * 120) + 1) / 2;
            ch.textContent = noise > (1 - frac * 0.85) ? gc(p, i) : (ch.dataset.final ?? "");
            const flicker = Math.sin(seed * 4 + p * 200) > (0.3 - frac * 0.5) ? 1 : Math.max(0.1, 1 - frac);
            gsap.set(ch, { opacity: flicker, skewX: Math.sin(seed * 3 + p * 80) * 14 * frac, x: Math.sin(seed * 5 + p * 60) * 5 * frac });
          });
          gsap.set(subRef.current, { autoAlpha: Math.sin(p * 160) > 0.4 ? 0 : 0.45 * (1 - frac * 0.7) });
        }

        if (p >= P.stormEnd && p < P.fallEnd) {
          if (lastPhase !== 5) {
            lastPhase = 5;
            chars.forEach(ch => { ch.textContent = ch.dataset.final ?? ""; });
            gsap.set(staticRef.current, { autoAlpha: 0 });
            gsap.set(textWrapRef.current, { x: 0, y: 0 });
            gsap.set(barFillRef.current, { width: "0%" });
          }
          const frac = (p - P.stormEnd) / (P.fallEnd - P.stormEnd);
          const e = frac * frac;
          gsap.set(coordsRef.current, { autoAlpha: 1 - frac * 2 });
          gsap.set(barRef.current,    { autoAlpha: 1 - frac * 2 });
          gsap.set(subRef.current,    { autoAlpha: 0 });
          gsap.set(noiseRef.current,  { autoAlpha: 0.3 + e * 0.2 });
          chars.forEach((ch, i) => {
            const seed = i * 1.4 + 7;
            const fallSpeed = 0.6 + ((Math.sin(seed) + 1) / 2) * 0.8;
            const xDrift    = Math.sin(seed * 2.1) * 30;
            const localFall = Math.min(1, e * fallSpeed);
            gsap.set(ch, { y: localFall * 180, x: xDrift * localFall, opacity: Math.max(0, 1 - localFall * 1.3), filter: `blur(${localFall * 8}px)`, skewX: 0 });
          });
        }

        if (p >= P.fallEnd && p < P.whiteEnd) {
          if (lastPhase !== 6) {
            lastPhase = 6;
            gsap.set(chars, { autoAlpha: 0 });
            gsap.set(subRef.current,    { autoAlpha: 0 });
            gsap.set(coordsRef.current, { autoAlpha: 0 });
            gsap.set(barRef.current,    { autoAlpha: 0 });
            gsap.set(noiseRef.current,  { autoAlpha: 0 });
          }
          const frac = (p - P.fallEnd) / (P.whiteEnd - P.fallEnd);
          if (frac < 0.35) {
            gsap.set(staticRef.current,  { autoAlpha: frac / 0.35 });
            gsap.set(overlayRef.current, { autoAlpha: 0, backgroundColor: "#ffffff" });
          } else {
            const dissolveP = (frac - 0.35) / 0.65;
            const e = dissolveP * dissolveP * (3 - 2 * dissolveP);
            gsap.set(staticRef.current,  { autoAlpha: 1 - dissolveP });
            gsap.set(overlayRef.current, { autoAlpha: e, backgroundColor: "#000000" });
          }
        }

        if (p >= P.whiteEnd) {
          if (lastPhase !== 7) {
            lastPhase = 7;
            gsap.set(staticRef.current,  { autoAlpha: 0 });
            gsap.set(overlayRef.current, { autoAlpha: 1, backgroundColor: "#000000" });
          }
        }

        if (p < 0.02 && lastPhase !== 0) {
          lastPhase = 0;
          gsap.set(chars, { opacity: 0, x: 0, y: 0, skewX: 0, filter: "blur(0px)" });
          chars.forEach(ch => { ch.textContent = ch.dataset.final ?? ""; });
          gsap.set(textWrapRef.current,  { autoAlpha: 0, x: 0, y: 0 });
          gsap.set(subRef.current,       { autoAlpha: 0, y: 6 });
          gsap.set(coordsRef.current,    { autoAlpha: 0, x: -8 });
          gsap.set(barRef.current,       { autoAlpha: 0 });
          gsap.set(barFillRef.current,   { width: "100%" });
          gsap.set(noiseRef.current,     { autoAlpha: 0 });
          gsap.set(staticRef.current,    { autoAlpha: 0 });
          gsap.set(overlayRef.current,   { autoAlpha: 0 });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cl = t.connectionLost;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={scanlinesRef} className={styles.scanlines} />
      <div ref={noiseRef} className={styles.noise} style={{ backgroundImage: "url('/images/noise.png')", backgroundSize: "200px" }} />
      <div ref={staticRef} className={styles.static} />
      <div ref={overlayRef} className={styles.overlay} />

      <div ref={coordsRef} className={styles.hud}>
        <div className={styles.hudRow}>
          <span className={styles.hudKey}>{cl.hudSigLabel}</span>
          <div ref={barRef} className={styles.signalBar}>
            <div ref={barFillRef} className={styles.signalFill} />
          </div>
        </div>
        <div className={styles.hudRow}>
          <span className={styles.hudKey}>{cl.hudNodeLabel}</span>
          <span className={styles.hudVal}>{cl.hudNodeValue}</span>
        </div>
        <div className={styles.hudRow}>
          <span className={styles.hudKey}>{cl.hudStatusLabel}</span>
          <span className={`${styles.hudVal} ${styles.hudBlink}`}>{cl.hudStatusValue}</span>
        </div>
      </div>

      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerTR}`} />
      <div className={`${styles.corner} ${styles.cornerBL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      <div className={styles.center}>
        <div ref={textWrapRef} className={`${styles.textWrap} title`} />
        <p ref={subRef} className={styles.sub}>{cl.subtext}</p>
      </div>

      <div className={styles.bottomMeta}>
        <span className={styles.bottomMetaItem}>{cl.bottomLeft}</span>
        <span className={styles.cursor} />
        <span className={styles.bottomMetaItem}>{cl.bottomRight}</span>
      </div>
    </section>
  );
};