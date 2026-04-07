"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./JournalSection.module.css";
import { useLanguage } from "@/contexts/LanguageContext";
 
gsap.registerPlugin(ScrollTrigger);
 
const STACK = [
  { name: "React // Next.js",    proficiency: 92, icon: "next.png" },
  { name: "Node.js",             proficiency: 89, icon: "node.png" },
  { name: "Java // Spring",      proficiency: 85, icon: "java.png" },
  { name: "Python",              proficiency: 83, icon: "python.png" },
  { name: "PostgreSQL // MySQL", proficiency: 91, icon: "mysql.png" },
  { name: "Typescript",          proficiency: 79, icon: "typescript.png" },
];
 
export const JournalSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const jt = t.journal;
 
  useGSAP(() => {
    const pages = gsap.utils.toArray<HTMLElement>(".journal-page");
    if (!pages.length) return;
 
    pages.forEach((page, i) => {
      gsap.set(page, { zIndex: pages.length - i, rotateY: 0, transformOrigin: "left center", "--b": 1 });
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
            gsap.set(page, { zIndex: self.progress * total > i + 0.5 ? 0 : pages.length - i });
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
    <section ref={containerRef} className={`relative h-screen w-full bg-[#0c0c0c] overflow-hidden flex items-center justify-center ${styles.journalSection}`}>
      <div className={styles.paperTexture} />
      <div className={styles.pageWrapper}>
 
        {/* PAGE 1 */}
        <div className={`journal-page ${styles.journalPage}`}>
          <div className={styles.pageHeader}>
            <div className={styles.classifiedBadge}>{jt.p1ClassifiedBadge}</div>
            <div className={styles.headerLeft}>
              <span className={`subtitle ${styles.headerMeta}`}>{jt.p1ConfidentialReport}</span>
              <span className="cursive-el text-xl">{jt.p1DossierTitle}</span>
            </div>
            <h1 className={`title ${styles.headerVol}`}>{jt.p1Vol}</h1>
            <span className={`subtitle ${styles.headerRight}`}>{jt.p1Location.split("\n").map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</span>
          </div>
 
          <div className={styles.p1Body}>
            <div className={styles.p1Left}>
              <div className={styles.p1HeadlineRow}>
                <h2 className={`title ${styles.p1Headline}`}>{jt.p1HeadlineLeft.split("\n").map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
                <div className={styles.p1ClearedBadge}>
                  <p className={`subtitle ${styles.clearedText}`}>{jt.p1ClearedBadge.split("\n").map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</p>
                </div>
              </div>
 
              <div className={styles.p1DataGrid}>
                <div className={styles.p1FullRow}>
                  <p className={`subtitle ${styles.fieldLabel}`}>{jt.p1RoleLabel}</p>
                  <p className={`title ${styles.p1RoleTitle}`}>{jt.p1RoleTitle}</p>
                  <p className={`subtitle ${styles.p1RoleDesc}`}>{jt.p1RoleDesc}</p>
                </div>
                <div>
                  <p className={`subtitle ${styles.fieldLabel}`}>{jt.p1StatusLabel}</p>
                  <p className={`title ${styles.p1StatusText}`}>{jt.p1StatusValue}</p>
                </div>
                <div>
                  <p className={`subtitle ${styles.fieldLabel}`}>{jt.p1ClearanceLabel}</p>
                  <p className={`title ${styles.p1StatusText}`}>{jt.p1ClearanceValue}</p>
                </div>
              </div>
 
              <div className={styles.p1MobileBottom}>
                <p className={`subtitle ${styles.fieldLabel}`}>{jt.p1TechStackLabel}</p>
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
 
            <div className={styles.p1Right}>
              <Image src="/images/logo.png" alt="Subject Front" width={500} height={500} className={styles.p1Logo} />
              <div className={styles.p1Ornament}>
                <Image src="/images/ornament-top.png" alt="Stamp" width={100} height={20} className="grayscale sepia invert opacity-30" />
                <span className={`subtitle ${styles.ornamentLabel}`}>{jt.pageMeta}</span>
              </div>
            </div>
          </div>
 
          <div className={`subtitle ${styles.pageIndicator}`}>{jt.p1PageIndicator}</div>
        </div>
 
        {/* PAGE 2 */}
        <div className={`journal-page ${styles.journalPage}`}>
          <div className={styles.pageHeader}>
            <div className={`title ${styles.p2AngleMark}`}>{jt.p2AngleMark}</div>
            <div className={styles.headerLeft}>
              <span className={`subtitle ${styles.headerMeta}`}>{jt.p2TechSpecs}</span>
              <span className="cursive-el text-xl">{jt.p2SystemsPersonnel}</span>
            </div>
            <span className={`subtitle ${styles.headerMeta}`}>{jt.p2ArchiveRef}</span>
          </div>
 
          <div className={styles.p2Body}>
            <div className={styles.p2Left}>
              <div className={styles.p2EduSection}>
                <p className={`subtitle ${styles.fieldLabel}`}>{jt.p2EduLabel}</p>
 
                <div className={styles.p2EduBlock}>
                  <span className={`bg-black text-[#dcd5c5] px-3 py-1 title rotate-[-0.5deg] ${styles.p2SchoolLabel}`}>{jt.p2Fatec}</span>
                  <p className={`subtitle ${styles.p2BodyTextDrop}`}>
                    <span className={styles.p2DropCap} aria-hidden="true">S</span>
                    {jt.p2FatecBody}
                  </p>
                </div>
 
                <div className={styles.p2EduBlock}>
                  <span className={`bg-black text-[#dcd5c5] px-3 py-1 title rotate-[0.5deg] ${styles.p2SchoolLabel}`}>{jt.p2Etec}</span>
                  <p className={`subtitle ${styles.p2BodyTextDrop}`}>
                    <span className={styles.p2DropCap} aria-hidden="true">C</span>
                    {jt.p2EtecBody}
                  </p>
                </div>
              </div>
 
              <div className={styles.p2StackSection}>
                <span className={`subtitle ${styles.p2StackTitle}`}>{jt.p2StackTitle}</span>
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
                <p className={`subtitle ${styles.p2VerifiedText}`}>{jt.p2Verified}</p>
              </div>
 
              <div className={styles.p2MobileBottom}>
                <p className={`subtitle ${styles.fieldLabel}`}>{jt.p2MobileNoteLabel}</p>
                <p className={`cursive-el ${styles.p2MobileNote}`}>{jt.p2MobileNote}</p>
              </div>
            </div>
 
            <div className={styles.p2Right}>
              <Image src="/images/computer-il.png" alt="Subject 45deg" fill className="object-cover object-left grayscale contrast-125 mix-blend-multiply" priority />
            </div>
          </div>
        </div>
 
        {/* PAGE 3 */}
        <div className={`journal-page ${styles.journalPage}`}>
          <div className={styles.pageHeader}>
            <div className={styles.headerLeft}>
              <span className={`subtitle ${styles.headerMeta}`}>{jt.p3GeoOrigin}</span>
              <span className="cursive-el text-xl">{jt.p3LocationData}</span>
            </div>
            <span className={`subtitle ${styles.headerRight}`}>{jt.p3Sector}</span>
          </div>
 
          <div className={styles.p3Body}>
            <div className={styles.p3Left}>
              <div className={styles.p3CityImage}>
                <Image src="/images/city.png" alt="São José do Rio Pardo" fill className="object-cover grayscale contrast-150 mix-blend-multiply opacity-90" />
                <div className={styles.p3CityLabel}>{jt.p3CityRef}</div>
              </div>
 
              <div className={styles.p3SubjectBlock}>
                <div className={`bg-black text-[#dcd5c5] p-2 px-4 rotate-[-1deg] inline-block ${styles.p3SubjectBadge}`}>
                  <span className="title">{jt.p3SubjectBadge}</span>
                </div>
                <p className={`subtitle ${styles.p3Desc}`}>{jt.p3Desc}</p>
              </div>
 
              <div className={styles.p3InfoGrid}>
                <div>
                  <p className={`subtitle ${styles.fieldLabel}`}>{jt.p3CurrentOp}</p>
                  <p className={`title ${styles.p3InfoTitle}`}>{jt.p3CurrentOpValue}</p>
                </div>
                <div>
                  <p className={`subtitle ${styles.fieldLabel}`}>{jt.p3SituationLabel}</p>
                  <p className={`title underline ${styles.p3InfoTitle}`}>{jt.p3SituationValue}</p>
                </div>
              </div>
 
              <div className={styles.p3MobileBottom}>
                <p className={`subtitle ${styles.fieldLabel}`}>System Status</p>
                <div className="title">
                  {jt.p3MobileTerminalRows.map(([k, v]) => (
                    <p key={k} className={styles.p3MobileTerminalRow}>
                      <span>{k}:</span><span className="font-bold">{v}</span>
                    </p>
                  ))}
                </div>
                <p className={`cursive-el ${styles.p3MobileNoteText}`}>{jt.p3MobileNote}</p>
              </div>
 
              <div className={styles.p3Signature}>
                <div className={styles.p3SignatureBlock}>
                  <p className={`subtitle ${styles.fieldLabel}`}>{jt.p3AuthSignature}</p>
                  <span className="cursive-el text-3xl leading-none text-black/80 rotate-[-2deg]">Gustavo Medeiros de Barros</span>
                  <div className="w-full h-px bg-black mt-1" />
                </div>
                <div className={styles.p3Stamp}>
                  <Image src="/images/custom-stamp.png" alt="Stamp" width={128} height={128} className="grayscale mix-blend-multiply contrast-125 opacity-90" />
                </div>
              </div>
            </div>
 
            <div className={styles.p3Right}>
              <div className={`title ${styles.p3Terminal}`}>
                <div>
                  <p className={`opacity-40 font-bold tracking-tighter ${styles.p3KernelLabel}`}>{jt.p3KernelLabel}</p>
                  <p className="flex justify-between"><span>{jt.p3CpuUsage}</span><span className="font-bold">{jt.p3CpuValue}</span></p>
                  <p className="flex justify-between"><span>{jt.p3Runtime}</span><span className="font-bold">{jt.p3RuntimeValue}</span></p>
                  <p className="flex justify-between"><span>{jt.p3Stack}</span><span className="font-bold">{jt.p3StackValue}</span></p>
                  <p className="flex justify-between"><span>{jt.p3Status}</span><span className="font-extrabold">{jt.p3StatusValue}</span></p>
                </div>
                <div className={styles.p3Logs}>
                  {jt.p3LogLines.map((line, i) => (
                    <p key={i} className={i === 0 ? "animate-pulse" : ""}>{line}</p>
                  ))}
                </div>
              </div>
 
              <div className={`title ${styles.p3SecMark}`}>{jt.p3SecMark}</div>
 
              <div className={styles.p3Note}>
                <div className={styles.p3NoteInner}>
                  <p className={`subtitle ${styles.p3NoteLabel}`}>{jt.p3NoteLabel}</p>
                  <p className={`cursive-el ${styles.p3NoteText}`}>{jt.p3NoteText}</p>
                </div>
              </div>
 
              <div className={styles.p3Meta}>
                <span>{jt.p3HashLabel}</span>
                <span>{jt.p3CrcLabel}</span>
              </div>
            </div>
          </div>
 
          <div className={`subtitle ${styles.endOfDossier}`}>{jt.p3EndDossier}</div>
        </div>
 
      </div>
    </section>
  );
};