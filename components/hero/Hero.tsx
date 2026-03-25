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
      gsap.set(`.${styles["hero-image"]}`, {
        opacity: 0,
        scale: 1.1,
        filter: "brightness(2) blur(5px)",
      });

      gsap.set(`.${styles["burn-overlay"]}`, { opacity: 1 });

      const tl = gsap.timeline();

      tl.to(`.${styles["hero-image"]}`, {
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
        .to(`.${styles["hero-image"]}`, {
          filter: "brightness(1)",
          duration: 0.4,
        });
    });

    return () => ctx.revert();
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

        {/* IMAGEM */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className={`${styles["hero-image"]} ${styles["glitch-image"]}`}>
            <div className={styles["burn-overlay"]}></div>

            <Image
              src="/images/hr-portrait.png"
              alt="Gustavo Barros portrait"
              width={600}
              height={800}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* NOISE */}
        <div className={styles["noise-overlay"]}></div>
      </div>
    </section>
  );
}