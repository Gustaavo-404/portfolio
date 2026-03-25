"use client";

import { useState } from "react";
import Hero from "@/components/hero/Hero";
import Loader from "@/components/hero/Loader";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main>
      {loading && <Loader onFinish={() => setLoading(false)} />}
      {!loading && <Hero />}
    </main>
  );
}