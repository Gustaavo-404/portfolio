"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export const AboutScrollSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const titleElements = sectionRef.current?.querySelectorAll(".split-title");
    const descElements = sectionRef.current?.querySelectorAll(".split-desc");

    if (!titleElements?.length || !descElements?.length) return;

    const splitTitles = new SplitType(titleElements as any, { types: "chars,words" });
    const splitTexts = new SplitType(descElements as any, { types: "lines" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=650%",
        scrub: 1.5,
        pin: true,
      },
    });

    // Initial State Setup
    gsap.set([".split-title .char", ".split-desc .line", ".ornament-img", ".skill-pill", ".detail-item", ".cursive-el"], { 
      opacity: 0, 
      y: 40,
      filter: "blur(15px)" 
    });

    // --- SCENE 1: THE IDENTITY ---
    tl.to(".ornament-top", { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 })
    .to(".cursive-intro", { opacity: 1, y: 0, filter: "blur(0px)" }, "-=0.8")
    .to(".title-1 .char", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.03,
      ease: "power4.out",
    }, "-=0.5")
    .to(".desc-1 .line", {
      opacity: 0.7,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.1,
    }, "-=0.7")
    
    // Exit Scene 1
    .to(".scene-1", { opacity: 0, y: -100, filter: "blur(30px)", duration: 1.5 }, "+=1.2")

    // --- SCENE 2: THE CRAFT (ENGINEERING) ---
    .to(".scene-2", { 
        opacity: 1,
        onStart: () => { gsap.set(".scene-2", { display: "flex" }); }, 
    }, "<")
    .to(".title-2 .char", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.03,
    })
    .to(".skill-pill", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.06,
      ease: "power2.out"
    }, "-=0.4")
    .to(".detail-item", { opacity: 0.5, y: 0, filter: "blur(0px)", stagger: 0.1 }, "-=0.6")

    // Exit Scene 2
    .to(".scene-2", { opacity: 0, scale: 1.15, filter: "blur(30px)", duration: 1.5 }, "+=1.2")

    // --- SCENE 3: THE VISION (PHILOSOPHY) ---
    .to(".scene-3", { 
        opacity: 1,
        onStart: () => { gsap.set(".scene-3", { display: "flex" }); },
    }, "<")
    .to(".title-3 .char", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.03,
    })
    .to(".desc-3 .line", {
      opacity: 0.7,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.1,
    }, "-=0.8")
    .to(".ornament-bottom", { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 }, "-=0.5")
    .to(".cursive-signature", { opacity: 1, y: 0, filter: "blur(0px)", rotate: -1, scale: 1.05 }, "-=0.4");

    return () => {
      splitTitles.revert();
      splitTexts.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full bg-[#0c0c0c] text-white overflow-hidden flex items-center justify-center font-serif"
    >
      {/* Heavy Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10"></div>

      <div className="relative w-full max-w-6xl px-8 h-[75vh] flex items-center justify-center z-20">
        
        {/* SCENE 1: IDENTITY */}
        <div className="scene-1 absolute flex flex-col items-center text-center gap-4">
          <Image 
            src="/images/ornament-top.png" 
            alt="Ornament Top" 
            width={450} 
            height={100} 
            className="ornament-top ornament-img mb-6 pointer-events-none select-none"
          />
          <span className="cursive cursive-intro cursive-el text-3xl text-white mb-[-15px]">Full Stack Developer</span>
          <h2 className="title split-title title-1 text-7xl md:text-[11rem] uppercase leading-none tracking-tighter">
            Gustavo Barros
          </h2>
          <p className="subtitle split-desc desc-1 text-xs md:text-sm tracking-[0.4em] uppercase opacity-60 max-w-2xl leading-relaxed">
            Full Stack Developer & Systems Analyst. <br/> 
            Transforming binary logic into timeless digital experiences.
          </p>
        </div>

        {/* SCENE 2: ENGINEERING */}
        <div className="scene-2 absolute hidden flex-col items-center text-center gap-10">
          <div className="flex gap-16 mb-2">
            <div className="detail-item flex flex-col items-start border-l border-white/10 pl-6">
              <span className="subtitle text-[9px] uppercase tracking-[0.2em] opacity-40">Core Expertise</span>
              <span className="subtitle text-xs uppercase tracking-widest mt-1">Full Stack Systems</span>
            </div>
            <div className="detail-item flex flex-col items-start border-l border-white/10 pl-6">
              <span className="subtitle text-[9px] uppercase tracking-[0.2em] opacity-40">Development</span>
              <span className="subtitle text-xs uppercase tracking-widest mt-1">Robust Architecture</span>
            </div>
          </div>
          
          <h2 className="title split-title title-2 text-6xl md:text-9xl uppercase tracking-tighter">
            The Craft
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
            {["Spring Boot", "Next.js", "Node.js", "Python", "PostgreSQL", "MySQL", "TypeScript"].map((skill) => (
              <span key={skill} className="skill-pill subtitle px-6 py-2 text-[11px] border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-700 uppercase tracking-widest">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* SCENE 3: PHILOSOPHY */}
        <div className="scene-3 absolute hidden flex-col items-center text-center gap-8">
          <h2 className="title split-title title-3 text-6xl md:text-9xl uppercase tracking-tighter">
            The Vision
          </h2>
          <div className="max-w-3xl space-y-8">
            <p className="split-desc desc-3 subtitle text-[11px] md:text-xs tracking-[0.25em] uppercase leading-[2.2] opacity-80">
              In a world of noise, I choose precision. <br/> 
              Design is the bridge between human emotion and machine logic. <br/> 
              My mission is to build software that feels as solid as it performs.
            </p>
            <div className="cursive-signature cursive cursive-el text-5xl text-white pt-6">
              Gustavo M. de Barros
            </div>
          </div>
          <Image 
            src="/images/ornament-bottom.png" 
            alt="Ornament Bottom" 
            width={450} 
            height={100} 
            className="ornament-bottom ornament-img mt-8 pointer-events-none select-none"
          />
        </div>
      </div>

      {/* Editorial Layout */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-32 opacity-20 z-30">
         <div className="rotate-90 origin-left subtitle text-[9px] tracking-[0.6em] uppercase whitespace-nowrap">
           Full Stack
         </div>
         <div className="rotate-90 origin-left subtitle text-[9px] tracking-[0.6em] uppercase whitespace-nowrap">
           São Paulo, BR
         </div>
      </div>

      <div className="absolute right-12 bottom-12 flex flex-col items-end opacity-20 z-30">
        <span className="subtitle text-[9px] tracking-[0.4em] uppercase">Ref. Code: 01-BRL-ARCHIVE</span>
        <span className="title text-2xl mt-1">M.M.XXVI</span>
      </div>

      <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-50 subtitle text-[10px] tracking-[2em] uppercase whitespace-nowrap">
        Personal Dossier
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 subtitle text-[8px] tracking-[1em] uppercase animate-pulse">
        Hold & Scroll to explore
      </div>
    </section>
  );
};