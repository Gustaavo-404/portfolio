"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ConnectionLostSection.module.css";

gsap.registerPlugin(ScrollTrigger);

// ── Glitch char pool ──
const GLITCH = "▓░▒█▄▀■□◆◇○●◈∅⊗⌀⌘⌬⍟╬╪═║▐▌▀▄";

// ── Helper: pick deterministic glitch char from progress + seed ───────────
const gc = (p: number, seed: number) =>
  GLITCH[Math.floor(((Math.sin(seed * 13.7 + p * 90) + 1) / 2) * GLITCH.length)];

export const ConnectionLostSection = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);  // final black overlay
  const textWrapRef  = useRef<HTMLDivElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const noiseRef     = useRef<HTMLDivElement>(null);
  const scanlinesRef = useRef<HTMLDivElement>(null);
  const staticRef    = useRef<HTMLDivElement>(null);   // full-screen static burst
  const coordsRef    = useRef<HTMLDivElement>(null);   // HUD metadata
  const barRef       = useRef<HTMLDivElement>(null);   // signal strength bar
  const barFillRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !textWrapRef.current) return;

    // ── Build letter spans for "CONNECTION LOST" ──
    const TEXT = "CONNECTION LOST";
    let ci = 0;
    textWrapRef.current.innerHTML = TEXT.split("").map(ch => {
      if (ch === " ") return `<span class="${styles.space}">&nbsp;</span>`;
      return `<span class="${styles.char}" data-final="${ch}" data-idx="${ci++}">${ch}</span>`;
    }).join("");

    const chars = Array.from(
      textWrapRef.current.querySelectorAll<HTMLSpanElement>(`.${styles.char}`)
    );

    // ── Initial hidden states ──
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

    // ── Progress boundaries ──────────────────────────────────────────────
    // p = 0.00 → 1.00 across the full ScrollTrigger range
    //
    // Phase 1  0.00–0.10  section enters, text flickers in char-by-char
    // Phase 2  0.10–0.28  stable — all chars visible, HUD appears
    // Phase 3  0.28–0.50  signal starts degrading: glitch per char, bar drops
    // Phase 4  0.50–0.70  heavy glitch storm + static bursts + shake
    // Phase 5  0.70–0.85  chars fall / scatter downward with blur
    // Phase 6  0.85–0.95  static whiteout + fade to pure black
    // Phase 7  0.95–1.00  pure black, held

    const P = {
      revealEnd:   0.10,
      holdEnd:     0.28,
      degradeEnd:  0.50,
      stormEnd:    0.70,
      fallEnd:     0.85,
      whiteEnd:    0.95,
    };

    let lastPhase = -1;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=400%",          // 4× viewport height of slow scroll
      scrub: 0.8,
      pin: true,
      pinSpacing: true,
      onUpdate(self) {
        const p = self.progress;

        // ── PHASE 1: reveal chars staggered ──
        if (p < P.revealEnd) {
          if (lastPhase !== 1) { lastPhase = 1; gsap.set(textWrapRef.current, { autoAlpha: 1 }); }

          const frac = p / P.revealEnd;
          chars.forEach((ch, i) => {
            const thresh = i / chars.length;
            const local  = Math.max(0, Math.min(1, (frac - thresh) / 0.25));
            // Slight horizontal drift on entry
            const drift  = (1 - local) * (i % 2 === 0 ? -8 : 8);
            gsap.set(ch, {
              opacity: local,
              x: drift,
              filter: local < 0.8 ? `blur(${(1 - local) * 4}px)` : "blur(0px)",
            });
            // Show glitch chars while arriving
            if (local < 0.6 && local > 0) {
              ch.textContent = gc(p, i);
            } else {
              ch.textContent = ch.dataset.final ?? "";
            }
          });

          // Sub text
          if (frac > 0.7) {
            gsap.set(subRef.current, { autoAlpha: Math.min(1, (frac - 0.7) / 0.3) * 0.45, y: 0 });
          }
        }

        // ── PHASE 2: stable — full bright, HUD slides in ──
        if (p >= P.revealEnd && p < P.holdEnd) {
          if (lastPhase !== 2) {
            lastPhase = 2;
            chars.forEach(ch => { ch.textContent = ch.dataset.final ?? ""; });
            gsap.set(chars, { opacity: 1, x: 0, filter: "blur(0px)", skewX: 0, y: 0 });
            gsap.set(subRef.current, { autoAlpha: 0.45, y: 0 });
            gsap.set(noiseRef.current, { autoAlpha: 0 });
            // HUD appears
            gsap.to(coordsRef.current, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out" });
            gsap.to(barRef.current,    { autoAlpha: 1,         duration: 0.35 });
          }
        }

        // ── PHASE 3: degrade — chars start glitching, bar drops ──────────
        if (p >= P.holdEnd && p < P.degradeEnd) {
          if (lastPhase !== 3) { lastPhase = 3; }

          const frac      = (p - P.holdEnd) / (P.degradeEnd - P.holdEnd);
          const intensity = frac * frac; // slow start

          // Signal bar shrinks
          const barW = Math.max(0, 100 - frac * 72);
          gsap.set(barFillRef.current, { width: `${barW}%` });

          // Noise creeps in
          gsap.set(noiseRef.current, { autoAlpha: frac * 0.35 });

          // Per-char glitch — more chars affected as frac grows
          chars.forEach((ch, i) => {
            const seed    = i * 1.9;
            const noise   = (Math.sin(seed + p * 70) + 1) / 2;
            const chance  = intensity * 0.7;
            if (noise < chance) {
              ch.textContent = gc(p, i);
              const skew = Math.sin(seed * 2 + p * 50) * 8 * intensity;
              gsap.set(ch, { skewX: skew, opacity: 0.5 + noise * 0.5 });
            } else {
              ch.textContent = ch.dataset.final ?? "";
              gsap.set(ch, { skewX: 0, opacity: 1 });
            }
          });

          // Occasional whole-text horizontal jitter
          const jitter = Math.sin(p * 200) * intensity * 6;
          gsap.set(textWrapRef.current, { x: jitter });
        }

        // ── PHASE 4: storm — max glitch + static bursts + RGB split ──
        if (p >= P.degradeEnd && p < P.stormEnd) {
          if (lastPhase !== 4) { lastPhase = 4; gsap.set(staticRef.current, { autoAlpha: 0 }); }

          const frac      = (p - P.degradeEnd) / (P.stormEnd - P.degradeEnd);
          const intensity = frac;

          // Bar nearly gone
          gsap.set(barFillRef.current, { width: `${Math.max(0, 28 - frac * 28)}%` });
          gsap.set(noiseRef.current,   { autoAlpha: 0.5 + frac * 0.3 });

          // Static burst flicker
          const staticFlash = Math.sin(p * 300) > (0.6 - frac * 0.6) ? frac * 0.9 : 0;
          gsap.set(staticRef.current, { autoAlpha: staticFlash });

          // Whole text shake
          const shakeX = Math.sin(p * 190) * 12 * intensity;
          const shakeY = Math.cos(p * 170) * 4  * intensity;
          gsap.set(textWrapRef.current, { x: shakeX, y: shakeY });

          // Per-char: most chars are glitch chars now, random brightness
          chars.forEach((ch, i) => {
            const seed  = i * 2.3;
            const noise = (Math.sin(seed + p * 120) + 1) / 2;
            ch.textContent = noise > (1 - intensity * 0.85)
              ? gc(p, i)
              : (ch.dataset.final ?? "");
            const flicker = Math.sin(seed * 4 + p * 200) > (0.3 - intensity * 0.5)
              ? 1 : Math.max(0.1, 1 - intensity);
            const skew = Math.sin(seed * 3 + p * 80) * 14 * intensity;
            const xOff = Math.sin(seed * 5 + p * 60) * 5 * intensity;
            gsap.set(ch, { opacity: flicker, skewX: skew, x: xOff });
          });

          // Sub text flickers
          const subFlicker = Math.sin(p * 160) > 0.4 ? 0 : 0.45 * (1 - frac * 0.7);
          gsap.set(subRef.current, { autoAlpha: subFlicker });
        }

        // ── PHASE 5: fall — chars scatter downward + blur out ──
        if (p >= P.stormEnd && p < P.fallEnd) {
          if (lastPhase !== 5) {
            lastPhase = 5;
            // Restore final chars before falling
            chars.forEach(ch => { ch.textContent = ch.dataset.final ?? ""; });
            gsap.set(staticRef.current, { autoAlpha: 0 });
            gsap.set(textWrapRef.current, { x: 0, y: 0 });
            gsap.set(barFillRef.current, { width: "0%" });
          }

          const frac = (p - P.stormEnd) / (P.fallEnd - P.stormEnd);
          const e    = frac * frac; // easeInQuad

          // HUD fades
          gsap.set(coordsRef.current, { autoAlpha: 1 - frac * 2 });
          gsap.set(barRef.current,    { autoAlpha: 1 - frac * 2 });
          gsap.set(subRef.current,    { autoAlpha: 0 });
          gsap.set(noiseRef.current,  { autoAlpha: 0.3 + e * 0.2 });

          // Each char falls at its own speed + direction
          chars.forEach((ch, i) => {
            const seed = i * 1.4 + 7;
            // Deterministic fall speed and X drift per char
            const fallSpeed = 0.6 + ((Math.sin(seed) + 1) / 2) * 0.8; // 0.6–1.4
            const xDrift    = Math.sin(seed * 2.1) * 30;
            const localFall = Math.min(1, e * fallSpeed);
            const yDrop     = localFall * 180;
            const blur      = localFall * 8;
            gsap.set(ch, {
              y:       yDrop,
              x:       xDrift * localFall,
              opacity: Math.max(0, 1 - localFall * 1.3),
              filter:  `blur(${blur}px)`,
              skewX:   0,
            });
          });
        }

        // ── PHASE 6: whiteout → black ──
        if (p >= P.fallEnd && p < P.whiteEnd) {
          if (lastPhase !== 6) {
            lastPhase = 6;
            gsap.set(chars, { autoAlpha: 0 });
            gsap.set(subRef.current,   { autoAlpha: 0 });
            gsap.set(coordsRef.current,{ autoAlpha: 0 });
            gsap.set(barRef.current,   { autoAlpha: 0 });
            gsap.set(noiseRef.current, { autoAlpha: 0 });
          }

          const frac = (p - P.fallEnd) / (P.whiteEnd - P.fallEnd);

          // First half: brief static flash
          if (frac < 0.35) {
            const flashP = frac / 0.35;
            gsap.set(staticRef.current, { autoAlpha: flashP });
            gsap.set(overlayRef.current, { autoAlpha: 0, backgroundColor: "#ffffff" });
          } else {
            // Second half: fade static + dissolve to black
            const dissolveP = (frac - 0.35) / 0.65;
            const e = dissolveP * dissolveP * (3 - 2 * dissolveP); // smoothstep
            gsap.set(staticRef.current,  { autoAlpha: 1 - dissolveP });
            gsap.set(overlayRef.current, {
              autoAlpha: e,
              backgroundColor: "#000000",
            });
          }
        }

        // ── PHASE 7: pure black, held ──
        if (p >= P.whiteEnd) {
          if (lastPhase !== 7) {
            lastPhase = 7;
            gsap.set(staticRef.current,  { autoAlpha: 0 });
            gsap.set(overlayRef.current, { autoAlpha: 1, backgroundColor: "#000000" });
          }
        }

        // ── Reset on scroll back to top ──
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
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>

      {/* Scanlines */}
      <div ref={scanlinesRef} className={styles.scanlines} />

      {/* Film grain noise */}
      <div
        ref={noiseRef}
        className={styles.noise}
        style={{ backgroundImage: "url('/images/noise.png')", backgroundSize: "200px" }}
      />

      {/* Static burst — full screen white TV noise feel */}
      <div ref={staticRef} className={styles.static} />

      {/* Final black overlay */}
      <div ref={overlayRef} className={styles.overlay} />

      {/* HUD — top-left metadata */}
      <div ref={coordsRef} className={styles.hud}>
        <div className={styles.hudRow}>
          <span className={styles.hudKey}>SIG</span>
          <div ref={barRef} className={styles.signalBar}>
            <div ref={barFillRef} className={styles.signalFill} />
          </div>
        </div>
        <div className={styles.hudRow}>
          <span className={styles.hudKey}>NODE</span>
          <span className={styles.hudVal}>RELAY-07 // SJRP-SP-111</span>
        </div>
        <div className={styles.hudRow}>
          <span className={styles.hudKey}>STATUS</span>
          <span className={`${styles.hudVal} ${styles.hudBlink}`}>DISCONNECTING</span>
        </div>
      </div>

      {/* Corner brackets */}
      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerTR}`} />
      <div className={`${styles.corner} ${styles.cornerBL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      {/* Main text */}
      <div className={styles.center}>
        <div ref={textWrapRef} className={`${styles.textWrap} title`} />
        <p ref={subRef} className={styles.sub}>
          signal lost — relay node unreachable — end of transmission
        </p>
      </div>

      {/* Bottom meta */}
      <div className={styles.bottomMeta}>
        <span className={styles.bottomMetaItem}>◈ CORE-TEC</span>
        <span className={styles.cursor} />
        <span className={styles.bottomMetaItem}>END OF LINE</span>
      </div>

    </section>
  );
};