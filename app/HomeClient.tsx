"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/hero/Loader";
import Hero from "@/components/hero/Hero";
import { AboutScrollSection } from "@/components/AboutScrollSection";
import { JournalSection } from "@/components/JournalSection";
import { JourneyIntroSection } from "@/components/JourneyIntroSection";
import { JourneySection } from "@/components/JourneySection";
import { BootSection } from "@/components/BootSection";
import { ContactSection } from "@/components/ContactSection";
import { ConnectionLostSection } from "@/components/ConnectionLostSection";

export default function HomeClient() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const skip = localStorage.getItem("skip-loader");

    if (skip === "true") {
      setLoading(false);
      localStorage.removeItem("skip-loader");
    }
  }, []);

  if (!mounted) return null;

  return (
    <main className="bg-black">
      {loading ? (
        <Loader onFinish={() => setLoading(false)} />
      ) : (
        <div key="main-content">
          <Hero />
          <AboutScrollSection />
          <JournalSection />
          <JourneyIntroSection />
          <JourneySection />
          <BootSection />
          <ContactSection />
          <ConnectionLostSection />
        </div>
      )}
    </main>
  );
}