"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SoundToggle() {
  const [isOn, setIsOn] = useState(false);
  const isOnRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    isOnRef.current = isOn;
  }, [isOn]);

  useEffect(() => {
    const audio = new Audio("/sounds/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const handleVisibilityChange = () => {
      if (!audioRef.current) return;

      if (document.hidden) {
        audioRef.current.pause();
      } else {
        if (isOnRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isOnRef.current) {
      audioRef.current.pause();
      setIsOn(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsOn(true);
    }
  };

  return (
    <div className="absolute bottom-10 right-10 z-20 text-[14px] tracking-[2.5px] sound-toggle">
      
      <span className="block mb-2 text-[11px] text-[#030303] title">
        {t.global.sound}
      </span>

      <div
        onClick={toggleSound}
        className="flex items-center gap-[12px] cursor-pointer title opacity-90 hover:opacity-100 transition"
      >
        <span
          className={`transition-all duration-300 ${
            !isOn ? "opacity-100 text-black" : "opacity-80 text-[#222]"
          }`}
        >
          {t.global.soundOff}
        </span>

        {/* SLIDER */}
        <div
          className={`
            relative w-[48px] h-[4px] border border-[#1a1a1a]

            after:content-['']
            after:absolute
            after:top-0
            after:h-[3px]
            after:w-[24px]
            after:bg-[#1a1a1a]
            after:transition-all
            after:duration-300

            ${isOn ? "after:left-[23px]" : "after:left-0"}
          `}
        />

        <span
          className={`transition-all duration-300 ${
            isOn ? "opacity-100 text-black" : "opacity-80 text-[#222]"
          }`}
        >
          {t.global.soundOn}
        </span>
      </div>
    </div>
  );
}