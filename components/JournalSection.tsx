"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./JournalSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export const JournalSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const pages = gsap.utils.toArray<HTMLElement>(".journal-page");
        if (!pages.length) return;

        pages.forEach((page, i) => {
            gsap.set(page, {
                zIndex: pages.length - i,
                rotateY: 0,
                transformOrigin: "left center",
                "--b": 1,
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${pages.length * 150}%`,
                scrub: 1,
                pin: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const total = pages.length - 1;
                    pages.forEach((page, i) => {
                        const pageProgress = progress * total;
                        if (pageProgress > i + 0.5) {
                            gsap.set(page, { zIndex: 0 });
                        } else {
                            gsap.set(page, { zIndex: pages.length - i });
                        }
                    });
                }
            },
        });

        pages.forEach((page, i) => {
            if (i === pages.length - 1) return;
            tl.to(page, {
                keyframes: [
                    { rotateY: -60, skewY: 6, scaleX: 0.96, "--b": 0.85, duration: 0.3 },
                    { rotateY: -100, skewY: 12, scaleX: 0.9, "--b": 0.6, duration: 0.4 },
                    { rotateY: -140, skewY: 6, scaleX: 0.96, "--b": 0.85, duration: 0.3 },
                    { rotateY: -180, skewY: 0, scaleX: 1, "--b": 1, duration: 0.3 }
                ],
                ease: "none"
            });
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full bg-[#0c0c0c] overflow-hidden flex items-center justify-center"
            style={{ perspective: "2500px" }}
        >
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] z-50"></div>

            <div className="relative w-[85vw] h-[85vh] max-w-6xl shadow-2xl">

                {/* PAGE 1 - FRONT VIEW (Technical Dossier) */}
                <div className={`journal-page ${styles.journalPage} absolute w-full h-full bg-[#dcd5c5] text-[#1a1a1a] p-10 flex flex-col border-r border-black/10 shadow-inner overflow-hidden`}>
                    <div className="flex justify-between items-end border-b-4 border-black pb-2 mb-8 relative">
                        <div className="absolute -top-6 right-12 bg-black text-[#dcd5c5] px-4 py-1 rotate-3 title text-lg">CLASSIFIED</div>
                        <div className="flex flex-col">
                            <span className="subtitle text-[10px] font-bold tracking-[0.3em] uppercase">Confidential Report</span>
                            <span className="cursive-el text-xl mt-[-5px]">Personnel Subject Dossier</span>
                        </div>
                        <h1 className="title text-4xl tracking-tighter uppercase">Vol. MMXXVI // S-14</h1>
                        <span className="subtitle text-[10px] font-bold tracking-[0.3em] uppercase text-right">São José do Rio Pardo<br />SP // Brazil</span>
                    </div>

                    <div className="grid grid-cols-12 gap-6 flex-1">
                        <div className="col-span-8 border-r border-black/10 pr-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="title text-[5.5rem] leading-[0.8] uppercase tracking-tighter">Public <br /> Record</h2>
                                <div className="border-4 border-black p-1 text-center rotate-[-15deg] mt-[-1rem]">
                                    <p className="subtitle text-[9px] font-black uppercase">Cleared for<br />Release</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-black/30">
                                <div className="col-span-2 space-y-1">
                                    <p className="subtitle text-[9px] uppercase tracking-widest opacity-60">Primary Role // Specialization</p>
                                    <p className="title text-4xl font-bold">Full Stack Developer // Specialized</p>
                                    <p className="text-[12px] leading-relaxed font-serif italic">
                                        High-performance architecture design and advanced web aesthetics.
                                        Expertise in custom API development and secure authentication protocols (OAuth 2.0).
                                        Specialized in Artificial Intelligence integration, cloud ecosystems, and full-cycle system deployment.
                                    </p>                                
                                </div>
                                <div className="space-y-1">
                                    <p className="subtitle text-[9px] uppercase tracking-widest opacity-60">Subject Status</p>
                                    <p className="title text-3xl italic">Active // Operational</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="subtitle text-[9px] uppercase tracking-widest opacity-60">Security Clearance</p>
                                    <p className="title text-3xl">Level 4 (Admin)</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/10 space-y-2">
                                <span className="subtitle text-[10px] uppercase font-bold tracking-wider">Project Log:</span>
                                <div className="text-[11px] leading-snug font-serif italic space-y-1">
                                    <p>[LOG-031]: "AI chatbot platform for automation and support" (Spring Boot // Python)</p>
                                    <p>[LOG-045]: "SaaS for repository analytics and dev metrics" (Next.js // Typescript)</p>
                                    <p>[LOG-072]: "Portfolio optimization using linear programming"(Node.js // Python)</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4 flex justify-center items-center relative h-full">
                            <Image src="/images/vaultboy0.png" alt="Subject Front" width={342} height={941} className="h-[95%] w-auto object-contain grayscale contrast-125 mix-blend-multiply" />
                            <div className="absolute top-2 right-2 flex flex-col items-center rotate-6">
                                <Image src="/images/ornament-top.png" alt="Stamp" width={100} height={20} className="grayscale sepia invert opacity-30" />
                                <span className="subtitle text-[8px] uppercase tracking-wider font-bold mt-[-5px]">Archive Dept.</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-right subtitle text-[9px] tracking-[0.5em] animate-pulse">PAGE 1/3 →</div>
                </div>

                {/* PAGE 2 - 45 DEGREE VIEW (Education & Tech Breakdown) */}
                <div className={`journal-page ${styles.journalPage} absolute w-full h-full bg-[#dcd5c5] text-[#1a1a1a] p-10 flex flex-col border-r border-black/10 shadow-inner overflow-hidden`}>

                    <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-8 relative">
                        <div className="absolute -top-1 right-12 title text-5xl opacity-10">45°</div>
                        <div className="flex flex-col">
                            <span className="subtitle text-[9px] font-bold tracking-[0.3em] uppercase opacity-60">Tech Specs & Background</span>
                            <span className="cursive-el text-xl mt-[-2px]">Systems Personnel Archive</span>
                        </div>
                        <div className="text-right">
                            <span className="subtitle text-[9px] font-bold tracking-[0.3em] uppercase">Archive Ref: MMXXVI-B</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 flex-1">
                        <div className="col-span-8 border-r border-black/10 pr-6 flex flex-col space-y-6">

                            <div className="space-y-4 font-serif">
                                <p className="subtitle text-[9px] uppercase tracking-widest opacity-60 mb-1">Academic Background</p>

                                <div>
                                    <span className="cursive-el text-3xl leading-none">Fatec Mococa // Systems Analysis</span>
                                    <p className="text-sm leading-relaxed mt-1 border-l-2 border-black/10 pl-4 subtitle italic 
                                    first-letter:text-5xl first-letter:mr-2 
                                    first-letter:float-left first-letter:leading-[0.8] first-letter:font-serif">
                                        Started in 2023 with an expected graduation in July 2026. Deep immersion in advanced Software Engineering, focusing on complex Data Structures, Cloud Computing architectures, and Full-Stack lifecycle management. Research and development focused on scalable system reliability and modern development patterns.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <span className="cursive-el text-3xl leading-none">Etec // Internet Informatics</span>
                                    <p className="text-sm leading-relaxed mt-1 border-l-2 border-black/10 pl-4 subtitle italic 
                                    first-letter:text-5xl first-letter:mr-2 
                                    first-letter:float-left first-letter:leading-[0.8] first-letter:font-serif">
                                        Completed between 2020 and 2022. Established a rigorous technical foundation in Web Development,
                                        including deep dives into Internet Protocols (TCP/IP, HTTP), basic System Architecture, and
                                        responsive front-end design. Focused on the core principles of algorithmic logic and database management.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 border-t-4 border-double border-black/10 mt-auto">
                                <p className="subtitle text-[9px] uppercase tracking-widest opacity-60 mb-3">Tech Stack Proficiency Breakdown</p>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-3 subtitle text-[10px] uppercase tracking-widest font-bold">
                                    {[
                                        { name: "React // Next.js", proficiency: 92 },
                                        { name: "Node.js", proficiency: 88 },
                                        { name: "Java // Spring Boot", proficiency: 85 },
                                        { name: "Python", proficiency: 81 },
                                        { name: "PostgreSQL // MySQL", proficiency: 86 },
                                        { name: "Animations", proficiency: 90 },
                                    ].map((stack, index) => (
                                        <div key={index} className="flex justify-between items-center border-b border-black/10 pb-1.5 h-8">
                                            <span>{stack.name}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => {
                                                        const rating = stack.proficiency / 20;
                                                        const isFilled = i < Math.round(rating);
                                                        return (
                                                            <div key={i} className={`relative w-3 h-3 ${isFilled ? 'opacity-100' : 'opacity-20'}`}>
                                                                <Image
                                                                    src="/images/star.png"
                                                                    alt="Star"
                                                                    fill
                                                                    className="object-contain grayscale mix-blend-multiply"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <span className="text-xs opacity-50 w-10 text-right">[{stack.proficiency}%]</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 pt-2 border-t border-dashed border-black/20 self-start opacity-50">
                                <p className="subtitle text-[8px] uppercase tracking-wider">Data verified // Subject MMXXVI-B</p>
                            </div>
                        </div>

                        <div className="col-span-4 flex justify-center items-center relative h-full">
                            <Image
                                src="/images/vaultboy45.png"
                                alt="Subject 45deg"
                                width={315}
                                height={949}
                                className="h-[95%] w-auto object-contain grayscale contrast-125 mix-blend-multiply"
                            />
                        </div>
                    </div>
                </div>

                {/* PAGE 3 - PROFILE VIEW & LOCATION (Origin & Vision) */}
                <div className={`journal-page ${styles.journalPage} absolute w-full h-full bg-[#dcd5c5] text-[#1a1a1a] p-10 flex flex-col border-r border-black/10 shadow-inner overflow-hidden`}>

                    <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-6">
                        <div className="flex flex-col">
                            <span className="subtitle text-[9px] font-bold tracking-[0.3em] uppercase opacity-60">Geographical Origin</span>
                            <span className="cursive-el text-xl mt-[-2px]">Subject Location Data</span>
                        </div>
                        <div className="text-right">
                            <span className="subtitle text-[9px] font-bold tracking-[0.3em] uppercase">Sector: 019 // SP</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 flex-1">
                        <div className="col-span-8 border-r border-black/10 pr-6 flex flex-col">

                            {/* City Image Section */}
                            <div className="relative w-full h-48 mb-6 border-2 border-black p-1 bg-white/50">
                                <Image
                                    src="/images/city.png"
                                    alt="São José do Rio Pardo"
                                    fill
                                    className="object-cover grayscale contrast-150 mix-blend-multiply opacity-90"
                                />
                                <div className="absolute bottom-2 left-2 bg-black text-[#dcd5c5] px-2 py-0.5 text-[8px] uppercase font-bold">
                                    Ref: SJRP_BRAZIL_001
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="bg-black text-[#dcd5c5] p-2 inline-block px-4 rotate-[-1deg] mb-4">
                                        <span className="title text-2xl uppercase tracking-tighter">Subject: Gustavo Barros</span>
                                    </div>
                                    <p className="subtitle text-[12px] leading-relaxed font-serif italic border-l-4 border-black pl-4">
                                        Operating from São José do Rio Pardo, SP. A strategic hub for high-end digital engineering.
                                        Focused on bridging the gap between complex backend logic and cinematic front-end experiences.
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-black/10 grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="subtitle text-[9px] uppercase tracking-widest opacity-60">Current Operation</p>
                                        <p className="title text-xl">SaaS Analytics System</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="subtitle text-[9px] uppercase tracking-widest opacity-60">Situation</p>
                                        <p className="title text-xl underline stamp-text">Open to work</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex items-end gap-10 pt-10 border-t-2 border-dashed border-black/20">

                                <div className="flex flex-col gap-2 w-1/2">
                                    <p className="subtitle text-[8px] uppercase tracking-widest opacity-70">
                                        Authorized Signature:
                                    </p>
                                    <span className="cursive-el text-4xl leading-none text-black/80 rotate-[-2deg]">
                                        Gustavo Medeiros de Barros
                                    </span>
                                    <div className="w-full h-px bg-black"></div>
                                </div>

                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <Image
                                        src="/images/custom-stamp.png"
                                        alt="Gustavo Stamp"
                                        width={128}
                                        height={128}
                                        className="grayscale mix-blend-multiply contrast-125 opacity-90"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Right side with the 90deg Vault Boy */}
                        <div className="col-span-4 flex justify-center items-center relative h-full">
                            <div className="absolute inset-0 pointer-events-none"></div>
                            <Image
                                src="/images/vaultboy90.png"
                                alt="Subject Profile"
                                width={234}
                                height={956}
                                className="h-[90%] w-auto object-contain grayscale contrast-125 mix-blend-multiply"
                            />
                            <div className="absolute top-0 right-0 title text-6xl opacity-10 rotate-90 origin-top-right translate-x-4">90°</div>
                        </div>
                    </div>

                    <div className="mt-4 text-center subtitle text-[9px] tracking-[1em] opacity-40">
                        --- END OF DOSSIER ---
                    </div>
                </div>

            </div>
        </section>
    );
};