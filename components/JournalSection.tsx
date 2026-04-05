"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./JournalSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const STACK = [
    { name: "React // Next.js",     proficiency: 92, icon: "next.png" },
    { name: "Node.js",              proficiency: 89, icon: "node.png" },
    { name: "Java // Spring",       proficiency: 85, icon: "java.png" },
    { name: "Python",               proficiency: 83, icon: "python.png" },
    { name: "PostgreSQL // MySQL",  proficiency: 91, icon: "mysql.png" },
    { name: "Typescript",           proficiency: 79, icon: "typescript.png" },
];

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
                    const total = pages.length - 1;
                    pages.forEach((page, i) => {
                        gsap.set(page, {
                            zIndex: self.progress * total > i + 0.5 ? 0 : pages.length - i,
                        });
                    });
                },
            },
        });

        pages.forEach((page, i) => {
            if (i === pages.length - 1) return;
            tl.to(page, {
                keyframes: [
                    { rotateY: -60,  skewY: 6,  scaleX: 0.96, "--b": 0.85, duration: 0.3 },
                    { rotateY: -100, skewY: 12, scaleX: 0.9,  "--b": 0.6,  duration: 0.4 },
                    { rotateY: -140, skewY: 6,  scaleX: 0.96, "--b": 0.85, duration: 0.3 },
                    { rotateY: -180, skewY: 0,  scaleX: 1,    "--b": 1,    duration: 0.3 },
                ],
                ease: "none",
            });
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className={`relative h-screen w-full bg-[#0c0c0c] overflow-hidden flex items-center justify-center ${styles.journalSection}`}
        >
            <div className={styles.paperTexture} />
            <div className={styles.pageWrapper}>

                {/* ═══════════════════════════════════════
                    PAGE 1 — Technical Dossier
                ═══════════════════════════════════════ */}
                <div className={`journal-page ${styles.journalPage}`}>

                    <div className={styles.pageHeader}>
                        <div className={styles.classifiedBadge}>CLASSIFIED</div>
                        <div className={styles.headerLeft}>
                            <span className={`subtitle ${styles.headerMeta}`}>Confidential Report</span>
                            <span className="cursive-el text-xl">Personnel Subject Dossier</span>
                        </div>
                        <h1 className={`title ${styles.headerVol}`}>Vol. MMXXVI // S-14</h1>
                        <span className={`subtitle ${styles.headerRight}`}>São José do Rio Pardo<br />SP // Brazil</span>
                    </div>

                    <div className={styles.p1Body}>
                        <div className={styles.p1Left}>

                            <div className={styles.p1HeadlineRow}>
                                <h2 className={`title ${styles.p1Headline}`}>Public<br />Record</h2>
                                <div className={styles.p1ClearedBadge}>
                                    <p className={`subtitle ${styles.clearedText}`}>Cleared for<br />Analysis</p>
                                </div>
                            </div>

                            <div className={styles.p1DataGrid}>
                                <div className={styles.p1FullRow}>
                                    <p className={`subtitle ${styles.fieldLabel}`}>Primary Role // Specialization</p>
                                    <p className={`title ${styles.p1RoleTitle}`}>Full Stack Developer // Specialized</p>
                                    <p className={`subtitle ${styles.p1RoleDesc}`}>
                                        High-performance architecture design and advanced web aesthetics.
                                        Expertise in custom API development and secure authentication protocols.
                                        Specialized in AI integration, cloud ecosystems, and full-cycle system deployment.
                                    </p>
                                </div>
                                <div>
                                    <p className={`subtitle ${styles.fieldLabel}`}>Subject Status</p>
                                    <p className={`title ${styles.p1StatusText}`}>Active // Operational</p>
                                </div>
                                <div>
                                    <p className={`subtitle ${styles.fieldLabel}`}>Security Clearance</p>
                                    <p className={`title ${styles.p1StatusText}`}>Level 4 (Admin)</p>
                                </div>
                            </div>

                            {/* Mobile-only: show stack teaser + status when logo is hidden */}
                            <div className={styles.p1MobileBottom}>
                                <p className={`subtitle ${styles.fieldLabel}`}>Tech Stack</p>
                                <div className={styles.p2StackGrid}>
                                    {STACK.slice(0, 4).map((s, i) => (
                                        <div key={i} className={styles.p2StackItem}>
                                            <div className={styles.p2StackLeft}>
                                                <div className="relative w-4 h-4 shrink-0">
                                                    <Image src={`/images/icons/${s.icon}`} alt={s.name} fill className="object-contain grayscale contrast-125 mix-blend-multiply opacity-80" />
                                                </div>
                                                <span className={styles.p2StackName}>{s.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Logo — desktop only, flush to top */}
                        <div className={styles.p1Right}>
                            <Image
                                src="/images/logo.png"
                                alt="Subject Front"
                                width={500}
                                height={500}
                                className={styles.p1Logo}
                            />
                            <div className={styles.p1Ornament}>
                                <Image src="/images/ornament-top.png" alt="Stamp" width={100} height={20} className="grayscale sepia invert opacity-30" />
                                <span className={`subtitle ${styles.ornamentLabel}`}>Archive Dept.</span>
                            </div>
                        </div>
                    </div>

                    <div className={`subtitle ${styles.pageIndicator}`}>PAGE 1/3 →</div>
                </div>

                {/* ═══════════════════════════════════════
                    PAGE 2 — Education & Tech
                ═══════════════════════════════════════ */}
                <div className={`journal-page ${styles.journalPage}`}>

                    <div className={styles.pageHeader}>
                        <div className={`title ${styles.p2AngleMark}`}>45°</div>
                        <div className={styles.headerLeft}>
                            <span className={`subtitle ${styles.headerMeta}`}>Tech Specs &amp; Background</span>
                            <span className="cursive-el text-xl">Systems Personnel Archive</span>
                        </div>
                        <span className={`subtitle ${styles.headerMeta}`}>Archive Ref: MMXXVI-B</span>
                    </div>

                    <div className={styles.p2Body}>
                        <div className={styles.p2Left}>

                            {/* Education — with drop caps restored */}
                            <div className={styles.p2EduSection}>
                                <p className={`subtitle ${styles.fieldLabel}`}>Academic Background</p>

                                <div className={styles.p2EduBlock}>
                                    <span className={`bg-black text-[#dcd5c5] px-3 py-1 title rotate-[-0.5deg] ${styles.p2SchoolLabel}`}>
                                        Fatec Mococa // Systems Analysis
                                    </span>
                                    {/* Drop cap: pull first letter out as a span */}
                                    <p className={`subtitle ${styles.p2BodyTextDrop}`}>
                                        <span className={styles.p2DropCap} aria-hidden="true">S</span>
                                        tarted in 2023, graduating July 2026. Advanced Software Engineering focus:
                                        Data Structures, Cloud Computing, Full-Stack lifecycle management,
                                        scalable system reliability, and modern development patterns.
                                    </p>
                                </div>

                                <div className={styles.p2EduBlock}>
                                    <span className={`bg-black text-[#dcd5c5] px-3 py-1 title rotate-[0.5deg] ${styles.p2SchoolLabel}`}>
                                        Etec // Internet Informatics
                                    </span>
                                    <p className={`subtitle ${styles.p2BodyTextDrop}`}>
                                        <span className={styles.p2DropCap} aria-hidden="true">C</span>
                                        ompleted 2020–2022. Web Development fundamentals: Internet Protocols (TCP/IP, HTTP),
                                        System Architecture, responsive front-end design, algorithmic logic, and database management.
                                    </p>
                                </div>
                            </div>

                            {/* Stack */}
                            <div className={styles.p2StackSection}>
                                <span className={`subtitle ${styles.p2StackTitle}`}>Tech Stack Proficiency</span>
                                <div className={styles.p2StackGrid}>
                                    {STACK.map((s, i) => (
                                        <div key={i} className={styles.p2StackItem}>
                                            <div className={styles.p2StackLeft}>
                                                <div className="relative w-5 h-5 shrink-0">
                                                    <Image src={`/images/icons/${s.icon}`} alt={s.name} fill className="object-contain grayscale contrast-125 mix-blend-multiply opacity-80" />
                                                </div>
                                                <span className={styles.p2StackName}>{s.name}</span>
                                            </div>
                                            <div className={styles.p2StackRight}>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, j) => (
                                                        <div key={j} className={`relative w-3 h-3 ${j < Math.round(s.proficiency / 20) ? "opacity-100" : "opacity-10"}`}>
                                                            <Image src="/images/star.png" alt="" fill className="object-contain grayscale mix-blend-multiply" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className={styles.p2StackPct}>[{s.proficiency}%]</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.p2Verified}>
                                <p className={`subtitle ${styles.p2VerifiedText}`}>Data verified // Subject MMXXVI-B</p>
                            </div>

                            {/* Mobile-only: observation note teaser */}
                            <div className={styles.p2MobileBottom}>
                                <p className={`subtitle ${styles.fieldLabel}`}>Observation Note</p>
                                <p className={`cursive-el ${styles.p2MobileNote}`}>
                                    "Technical Evaluation: High proficiency in fluid motion and scalable architecture. Field-ready for complex digital engineering and UI/UX optimization."
                                </p>
                            </div>
                        </div>

                        {/* Computer image — desktop, flush to header */}
                        <div className={styles.p2Right}>
                            <Image
                                src="/images/computer-il.png"
                                alt="Subject 45deg"
                                fill
                                className="object-cover object-left grayscale contrast-125 mix-blend-multiply"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════
                    PAGE 3 — Origin & Vision
                ═══════════════════════════════════════ */}
                <div className={`journal-page ${styles.journalPage}`}>

                    <div className={styles.pageHeader}>
                        <div className={styles.headerLeft}>
                            <span className={`subtitle ${styles.headerMeta}`}>Geographical Origin</span>
                            <span className="cursive-el text-xl">Subject Location Data</span>
                        </div>
                        <span className={`subtitle ${styles.headerRight}`}>Sector: 019 // SP</span>
                    </div>

                    <div className={styles.p3Body}>
                        <div className={styles.p3Left}>

                            {/* City image: flush to header (no top padding on p3Left above) */}
                            <div className={styles.p3CityImage}>
                                <Image
                                    src="/images/city.png"
                                    alt="São José do Rio Pardo"
                                    fill
                                    className="object-cover grayscale contrast-150 mix-blend-multiply opacity-90"
                                />
                                <div className={styles.p3CityLabel}>Ref: SJRP_BRAZIL_001</div>
                            </div>

                            {/* Subject badge: zero gap from image */}
                            <div className={styles.p3SubjectBlock}>
                                <div className={`bg-black text-[#dcd5c5] p-2 px-4 rotate-[-1deg] inline-block ${styles.p3SubjectBadge}`}>
                                    <span className="title">Subject: Gustavo Barros // São José do Rio Pardo</span>
                                </div>
                                <p className={`subtitle ${styles.p3Desc}`}>
                                    Geographical Origin: São José do Rio Pardo, SP. Bridging complex logic with cinematic aesthetics.
                                </p>
                            </div>

                            <div className={styles.p3InfoGrid}>
                                <div>
                                    <p className={`subtitle ${styles.fieldLabel}`}>Current Operation</p>
                                    <p className={`title ${styles.p3InfoTitle}`}>SaaS Analytics System</p>
                                </div>
                                <div>
                                    <p className={`subtitle ${styles.fieldLabel}`}>Situation</p>
                                    <p className={`title underline ${styles.p3InfoTitle}`}>Open to work</p>
                                </div>
                            </div>

                            {/* Mobile-only: compact terminal + note */}
                            <div className={styles.p3MobileBottom}>
                                <p className={`subtitle ${styles.fieldLabel}`}>System Status</p>
                                <div className={`title`}>
                                    {[
                                        ["RUNTIME", "NEXT_JS_V15"],
                                        ["STACK",   "TS // NEXT"],
                                        ["STATUS",  "READY"],
                                    ].map(([k, v]) => (
                                        <p key={k} className={styles.p3MobileTerminalRow}>
                                            <span>{k}:</span>
                                            <span className="font-bold">{v}</span>
                                        </p>
                                    ))}
                                </div>
                                <p className={`cursive-el ${styles.p3MobileNoteText}`}>
                                    "A versatile operative specializing in full-stack engineering.
                                    Strategic asset for high-stakes projects requiring end-to-end technical oversight."
                                </p>
                            </div>

                            {/* Signature */}
                            <div className={styles.p3Signature}>
                                <div className={styles.p3SignatureBlock}>
                                    <p className={`subtitle ${styles.fieldLabel}`}>Authorized Signature:</p>
                                    <span className="cursive-el text-3xl leading-none text-black/80 rotate-[-2deg]">
                                        Gustavo Medeiros de Barros
                                    </span>
                                    <div className="w-full h-px bg-black mt-1" />
                                </div>
                                <div className={styles.p3Stamp}>
                                    <Image
                                        src="/images/custom-stamp.png"
                                        alt="Stamp"
                                        width={128}
                                        height={128}
                                        className="grayscale mix-blend-multiply contrast-125 opacity-90"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terminal + note — desktop only */}
                        <div className={styles.p3Right}>
                            <div className={`title ${styles.p3Terminal}`}>
                                <div>
                                    <p className={`opacity-40 font-bold tracking-tighter ${styles.p3KernelLabel}`}>[ SYSTEM_KERNEL_LOG ]</p>
                                    <p className="flex justify-between"><span>CPU_USAGE:</span><span className="font-bold">OPTIMIZED</span></p>
                                    <p className="flex justify-between"><span>RUNTIME:</span><span className="font-bold">NEXT_JS_V15</span></p>
                                    <p className="flex justify-between"><span>STACK:</span><span className="font-bold">TS // NEXT</span></p>
                                    <p className="flex justify-between"><span>STATUS:</span><span className="font-extrabold">READY</span></p>
                                </div>
                                <div className={styles.p3Logs}>
                                    <p className="animate-pulse">BOOTING_CORE...</p>
                                    <p>LOADING_UI_PRESETS</p>
                                    <p>ANALYZING_REPOS...</p>
                                    <p>0x53797374656d_OK</p>
                                </div>
                            </div>

                            <div className={`title ${styles.p3SecMark}`}>SEC_90</div>

                            <div className={styles.p3Note}>
                                <div className={styles.p3NoteInner}>
                                    <p className={`subtitle ${styles.p3NoteLabel}`}>OBSERVATION_NOTE:</p>
                                    <p className={`cursive-el ${styles.p3NoteText}`}>
                                        "A versatile operative specializing in full-stack engineering.
                                        Subject excels at delivering fluid user experiences while maintaining rigid backend stability.
                                        Strategic asset for high-stakes projects requiring end-to-end technical oversight and advanced visual logic."
                                    </p>
                                </div>
                            </div>

                            <div className={styles.p3Meta}>
                                <span>Hash: MMXXVI_S14</span>
                                <span>CRC: 8E2F</span>
                            </div>
                        </div>
                    </div>

                    <div className={`subtitle ${styles.endOfDossier}`}>--- END OF DOSSIER ---</div>
                </div>

            </div>
        </section>
    );
};