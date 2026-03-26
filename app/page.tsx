"use client";

import { useState } from "react";
import Loader from "@/components/hero/Loader";
import Hero from "@/components/hero/Hero";
import { AboutScrollSection } from "@/components/AboutScrollSection";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="bg-black">
      {loading ? (
        <Loader onFinish={() => setLoading(false)} />
      ) : (
        <div key="main-content">
          <Hero />
          <AboutScrollSection />
        </div>
      )}
    </main>
  );
}