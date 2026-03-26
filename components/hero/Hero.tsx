"use client";

import Image from "next/image";
import { useEffect } from "react";
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(`.${styles["hero-wrapper"]}`, {
        opacity: 0,
        scale: 1.1,
        filter: "brightness(2) blur(5px)",
      });

      gsap.set(`.${styles["burn-overlay"]}`, { opacity: 1 });

      const tl = gsap.timeline();

      tl.to(`.${styles["hero-wrapper"]}`, {
        opacity: 1,
        filter: "brightness(1.3) blur(0px)",
        scale: 1,
        duration: 1,
        ease: "power2.out",
      })
        .to(
          `.${styles["burn-overlay"]}`,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
          },
          "-=0.5"
        )
        .to(`.${styles["hero-wrapper"]}`, {
          filter: "brightness(1)",
          duration: 0.4,
        });
    });

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

    return () => {
      ctx.revert();
      wrapper?.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <section className="w-full h-screen flex items-center justify-center bg-white overflow-hidden relative">
      <div className="relative flex items-center justify-center w-full h-full">
        <SoundToggle />

        {/* SVG */}
        <svg
          viewBox="0 0 100 100"
          className={`absolute w-[1200px] h-[1200px] ${styles.spinner}`}
        >
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
              />
              <Image
                src="/images/hero-portrait-nsg.png"
                alt=""
                width={600}
                height={800}
                className={styles.glitchClone1}
              />
              <Image
                src="/images/hero-portrait-nsg.png"
                alt=""
                width={600}
                height={800}
                className={styles.glitchClone2}
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
        <div className={styles["noise-overlay"]}></div>
      </div>
    </section>
  );
}