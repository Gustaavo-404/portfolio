"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export const JourneyIntroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const titleElements = sectionRef.current?.querySelectorAll(".split-title");
    if (!titleElements?.length) return;

    const splitTitles = new SplitType(titleElements as any, { types: "chars" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true,
      },
    });

    gsap.set(".split-title .char", { opacity: 0, y: 10, filter: "blur(10px)" });
    gsap.set(".year-counter", { opacity: 0, scale: 0.8 });

    // SUBTITLE
    tl.to(".split-title .char", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.05,
      duration: 1.5,
      ease: "power2.inOut",
    })
    .to(".split-title", {
      opacity: 0,
      filter: "blur(20px)",
      duration: 1,
    }, "+=1.5")

    // COUNTDOWN
    .to(".year-counter", {
      opacity: 1,
      scale: 1,
      duration: 1,
    })
    // FAST FORWARD EFFECT
    .to(yearRef.current, {
      innerText: 2019,
      duration: 3,
      snap: { innerText: 1 },
      ease: "none",
      onUpdate: function() {
        if (Math.random() > 0.8) {
          gsap.set(yearRef.current, { skewX: gsap.utils.random(-10, 10), opacity: 0.7 });
        } else {
          gsap.set(yearRef.current, { skewX: 0, opacity: 1 });
        }
      }
    })
    .to(".year-counter", {
      scale: 15,
      opacity: 0,
      filter: "blur(40px)",
      duration: 2,
      ease: "power4.in",
    }, "+=0.5");

    return () => {
      splitTitles.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full bg-[#0c0c0c] text-white overflow-hidden flex items-center justify-center"
    >
       {/* Heavy Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10"></div>
      

      <div className="relative z-30 flex flex-col items-center">
        
        {/* SUBTITLE */}
        <h2 className="split-title title text-4xl md:text-6xl uppercase tracking-[0.3em] font-mono text-[#dcd5c5] italic opacity-80">
          7 years ago...
        </h2>

        {/* COUNTDOWN */}
        <div className="year-counter absolute flex flex-col items-center">
          <span className="subtitle text-[10px] tracking-[1em] uppercase opacity-40 mb-4">Rewinding Timeline</span>
          <span 
            ref={yearRef} 
            className="title text-[10rem] md:text-[18rem] font-black tracking-tighter leading-none"
          >
            2026
          </span>
          <div className="w-full h-[2px] bg-white/10 mt-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/40 animate-pulse"></div>
          </div>
        </div>

      </div>

      {/* FRAME */}
      <div className="absolute top-10 left-10 border-l border-t border-white/20 w-20 h-20"></div>
      <div className="absolute bottom-10 right-10 border-r border-b border-white/20 w-20 h-20"></div>

      {/* TIMECODE */}
      <div className="absolute bottom-10 left-12 font-mono text-[10px] tracking-widest opacity-30">
        REC [●] 00:0{Math.floor(Math.random() * 9)}:42:09
      </div>
    </section>
  );
};