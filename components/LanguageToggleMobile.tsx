"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggleMobile() {
  const { locale, toggleLang } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-[12px] tracking-[2px] title">
      <button onClick={toggleLang} className="flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 transition">
        <span className={`transition-all ${locale === "pt" ? "opacity-100 text-white" : "opacity-40"}`}>PT</span>
        <span className="opacity-40 text-white">/</span>
        <span className={`transition-all ${locale === "en" ? "opacity-100 text-white" : "opacity-40"}`}>EN</span>
      </button>
    </div>
  );
}