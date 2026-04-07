"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { locale, toggleLang } = useLanguage();

  return (
    <div className="absolute bottom-10 left-10 z-20 hidden md:block text-[14px] tracking-[2.5px] title">
      <div onClick={toggleLang} className="flex items-center gap-3 cursor-pointer opacity-90 hover:opacity-100 transition">
        <span className={`transition-all ${locale === "pt" ? "opacity-100 text-black" : "opacity-40"}`}>PT</span>
        <span className="opacity-40">/</span>
        <span className={`transition-all ${locale === "en" ? "opacity-100 text-black" : "opacity-40"}`}>EN</span>
      </div>
    </div>
  );
}