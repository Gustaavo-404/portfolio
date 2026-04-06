"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Locale, t } from "@/i18n/translations";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLang: () => void;
  t: ReturnType<typeof t>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("preferred-locale") as Locale;
    if (savedLocale && (savedLocale === "pt" || savedLocale === "en")) {
      setLocale(savedLocale);
    }
  }, []);

  const toggleLang = () => {
    const newLocale = locale === "pt" ? "en" : "pt";
    setLocale(newLocale);
    localStorage.setItem("preferred-locale", newLocale);
  };

  const translations = t(locale);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLang,
        t: translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}