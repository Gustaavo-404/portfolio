"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import SoundToggle from "@/components/SoundToggle";
import styles from "./Hero.module.css";

export default function Hero() {
  const items = [
    { label: "ABOUT", rotate: 0, id: "arc1" },
    { label: "PROJECTS", rotate: 90, id: "arc2" },
    { label: "STACK", rotate: 180, id: "arc3" },
    { label: "CONTACT", rotate: 270, id: "arc4" },
  ];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const irisCircleRef = useRef<SVGCircleElement | null>(null);
  const irisOverlayRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    // ================= GSAP =================
    const ctx = gsap.context(() => {
      gsap.set(`.${styles["hero-wrapper"]}`, {
        opacity: 0,
        scale: 1.1,
        filter: "brightness(2) blur(5px)",
      });
      gsap.set(`.${styles["burn-overlay"]}`, { opacity: 1 });

      const tl = gsap.timeline();

      // 1. Iris on
      tl.to(irisCircleRef.current, {
        attr: { r: "150%" },
        duration: 1.0,
        ease: "power2.inOut",
      })
        // 2. Hero
        .to(`.${styles["hero-wrapper"]}`, {
          opacity: 1,
          filter: "brightness(1.3) blur(0px)",
          scale: 1,
          duration: 1,
          ease: "power2.out",
        }, "-=0.5")
        // 3. Burn overlay
        .to(`.${styles["burn-overlay"]}`, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.in",
        }, "-=0.5")
        // 4. Brightness
        .to(`.${styles["hero-wrapper"]}`, {
          filter: "brightness(1)",
          duration: 0.4,
        })
        // 5. Iris off
        .to(irisOverlayRef.current, {
          opacity: 0,
          duration: 0.2,
        }, "-=0.3");
    });

    // ================= MOUSE =================
    const wrapper = document.querySelector(
      `.${styles["hero-wrapper"]}`
    ) as HTMLElement | null;

    const mask = document.querySelector(
      `.${styles["signature-mask"]}`
    ) as HTMLElement | null;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!wrapper || !mask) return;

      const rect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    wrapper?.addEventListener("mousemove", handleMouseMove);

    const ticker = () => {
      if (!mask) return;

      const currentX =
        parseFloat(getComputedStyle(mask).getPropertyValue("--x")) || 0;
      const currentY =
        parseFloat(getComputedStyle(mask).getPropertyValue("--y")) || 0;

      const lerpX = currentX + (mouseX - currentX) * 0.15;
      const lerpY = currentY + (mouseY - currentY) * 0.15;

      mask.style.setProperty("--x", `${lerpX}px`);
      mask.style.setProperty("--y", `${lerpY}px`);
    };

    gsap.ticker.add(ticker);

    // ================= CANVAS =================
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener("resize", resize);

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    // ===== TYPES =====
    type Scratch = {
      x: number;
      segments: { y: number; dx: number }[];
      life: number;
      maxLife: number;
      width: number;
    };

    type Dust = {
      x: number;
      y: number;
      r: number;
      opacity: number;
      life: number;
      maxLife: number;
    };

    type HairLine = {
      x: number;
      life: number;
      maxLife: number;
      width: number;
    };

    const scratches: Scratch[] = [];
    const dusts: Dust[] = [];
    const hairlines: HairLine[] = [];

    // ===== SCRATCH =====
    const spawnScratch = (w: number, h: number) => {
      const x = rand(0, w);
      const segCount = Math.floor(h / 8);
      const segments = Array.from({ length: segCount }, () => ({
        y: 0,
        dx: rand(-1.5, 1.5),
      }));

      let cy = 0;
      for (const seg of segments) {
        seg.y = cy;
        cy += 8;
      }

      scratches.push({
        x,
        segments,
        life: rand(4, 12),
        maxLife: 12,
        width: rand(0.3, 1.0),
      });
    };

    // ===== DUST SPECK =====
    const spawnDust = (w: number, h: number) => {
      const life = rand(6, 20);
      dusts.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.5, 2.5),
        opacity: rand(0.3, 0.9),
        life,
        maxLife: life,
      });
    };

    // ===== HAIRLINE =====
    const spawnHairLine = (w: number, h: number) => {
      const life = rand(2, 6);
      hairlines.push({
        x: rand(0, w * 0.7),
        life,
        maxLife: life,
        width: rand(10, 80),
      });
    };

    let animationFrameId: number;
    let frameCount = 0;

    let hairlineY = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      frameCount++;

      ctx2d.clearRect(0, 0, w, h);

      // ── SPAWN ──
      // scratch
      if (Math.random() < 0.012) spawnScratch(w, h);
      // dust
      if (Math.random() < 0.15) spawnDust(w, h);
      // hairline
      if (Math.random() < 0.006) {
        hairlineY = rand(0, h);
        spawnHairLine(w, h);
      }

      // ── SCRATCHES ──
      for (let i = scratches.length - 1; i >= 0; i--) {
        const s = scratches[i];
        const t = s.life / s.maxLife;
        const alpha = t < 0.3 ? t / 0.3 : t > 0.8 ? (1 - t) / 0.2 : 1;

        ctx2d.save();
        ctx2d.globalAlpha = alpha * 0.85;
        ctx2d.strokeStyle = Math.random() > 0.15 ? "#ffffff" : "#ffe8b0";
        ctx2d.lineWidth = s.width;
        ctx2d.lineCap = "round";

        ctx2d.beginPath();
        for (let j = 0; j < s.segments.length; j++) {
          const seg = s.segments[j];
          const px = s.x + seg.dx * (j / s.segments.length) * 4;
          const py = seg.y;
          if (j === 0) ctx2d.moveTo(px, py);
          else ctx2d.lineTo(px, py);
        }
        ctx2d.stroke();
        ctx2d.restore();

        s.life--;
        if (s.life <= 0) scratches.splice(i, 1);
      }

      // ── DUST SPECKS ──
      for (let i = dusts.length - 1; i >= 0; i--) {
        const d = dusts[i];
        const t = d.life / d.maxLife;
        const alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;

        ctx2d.save();
        ctx2d.globalAlpha = alpha * d.opacity;

        const isLight = Math.random() > 0.4;
        ctx2d.fillStyle = isLight ? "#ffffff" : "#1a1005";

        ctx2d.beginPath();
        ctx2d.ellipse(
          d.x,
          d.y,
          d.r,
          d.r * rand(0.6, 1.0),
          rand(0, Math.PI),
          0,
          Math.PI * 2
        );
        ctx2d.fill();
        ctx2d.restore();

        d.life--;
        if (d.life <= 0) dusts.splice(i, 1);
      }

      // ── HAIRLINES ──
      for (let i = hairlines.length - 1; i >= 0; i--) {
        const h_line = hairlines[i];
        const t = h_line.life / h_line.maxLife;
        const alpha = t > 0.5 ? 1 : t / 0.5;

        ctx2d.save();
        ctx2d.globalAlpha = alpha * 0.5;
        ctx2d.strokeStyle = "#ffffff";
        ctx2d.lineWidth = 0.5;

        ctx2d.beginPath();
        ctx2d.moveTo(h_line.x, hairlineY);
        ctx2d.lineTo(h_line.x + h_line.width, hairlineY + rand(-1, 1));
        ctx2d.stroke();
        ctx2d.restore();

        h_line.life--;
        if (h_line.life <= 0) hairlines.splice(i, 1);
      }

      // ── FLICKER ──
      if (frameCount % 90 === 0 && Math.random() > 0.5) {
        const grad = ctx2d.createRadialGradient(
          w / 2, h / 2, h * 0.1,
          w / 2, h / 2, h * 0.9
        );
        grad.addColorStop(0, "rgba(255, 240, 180, 0.0)");
        grad.addColorStop(1, "rgba(255, 200, 80, 0.07)");
        ctx2d.save();
        ctx2d.globalAlpha = 1;
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, w, h);
        ctx2d.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // ================= CLEANUP =================
    return () => {
      ctx.revert();
      wrapper?.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(ticker);

      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="w-full h-screen flex items-center justify-center bg-white overflow-hidden relative">

      <svg
        ref={irisOverlayRef}
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 9998, pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="iris-open-mask">
            <rect width="100%" height="100%" fill="white" />
            <circle
              ref={irisCircleRef}
              cx="50%"
              cy="50%"
              r="0%"
              fill="black"
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="black" mask="url(#iris-open-mask)" />
      </svg>

      <div className="relative flex items-center justify-center w-full h-full">
        <SoundToggle />

        {/* SVG */}
        <svg
          viewBox="0 0 100 100"
          className="absolute w-[1200px] h-[1200px]"
        >
          <g className={styles.spinner}>
            <defs>
              {items.map((item, i) => (
                <path
                  key={i}
                  id={item.id}
                  d="M 50,10 A 40,40 0 0,1 90,50"
                  transform={`rotate(${item.rotate} 50 50)`}
                />
              ))}
            </defs>

            {items.map((item, i) => (
              <g key={i}>
                <use href={`#${item.id}`} className={styles.arc} />
                <text className={`${styles["arc-text"]} ${styles.title}`}>
                  <textPath
                    href={`#${item.id}`}
                    startOffset="50%"
                    textAnchor="middle"
                    dy={item.rotate === 0 || item.rotate === 90 ? 6 : -6}
                  >
                    {item.label}
                  </textPath>
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* HERO IMAGE */}
        <div className={styles["hero-wrapper"]}>

          {/* BASE */}
          <div className={styles["image-layer"]}>
            <div className={styles.glitch}>
              <Image
                src="/images/hero-portrait-nsg.png"
                alt="portrait"
                width={600}
                height={800}
                className={styles.img}
                priority
                unoptimized
              />
              <Image
                src="/images/hero-portrait-nsg.png"
                alt=""
                width={600}
                height={800}
                className={styles.glitchClone1}
                unoptimized
              />
              <Image
                src="/images/hero-portrait-nsg.png"
                alt=""
                width={600}
                height={800}
                className={styles.glitchClone2}
                unoptimized
              />
            </div>
          </div>

          {/* SIGNATURE */}
          <div className={`${styles["image-layer"]} ${styles["signature-mask"]}`}>
            <div className={styles.glitch}>
              <Image
                src="/images/hero-portrait-sg.png"
                alt="portrait signed"
                width={600}
                height={800}
                className={styles.img}
                priority
              />
              <Image
                src="/images/hero-portrait-sg.png"
                alt=""
                width={600}
                height={800}
                className={styles.glitchClone1}
              />
              <Image
                src="/images/hero-portrait-sg.png"
                alt=""
                width={600}
                height={800}
                className={styles.glitchClone2}
              />
            </div>
          </div>

          <div className={styles["burn-overlay"]}></div>
        </div>


        {/* NOISE */}
        <div className={styles["noise-overlay"]}>
          <canvas className={styles["film-canvas"]} ref={canvasRef}></canvas>
        </div>
      </div>
    </section>
  );
}