"use client";

import { useState } from "react";
import Loader from "@/components/hero/Loader";
import Hero from "@/components/hero/Hero";
import { AboutScrollSection } from "@/components/AboutScrollSection";
import { JournalSection } from "@/components/JournalSection";
import { JourneyIntroSection } from "@/components/JourneyIntroSection";
import { JourneySection } from "@/components/JourneySection";
import { BootSection } from "@/components/BootSection";
import { ContactSection } from "@/components/ContactSection";

export default function HomeClient() {
  const [loading, setLoading] = useState(true);

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
        </div>
      )}
    </main>
  );
}