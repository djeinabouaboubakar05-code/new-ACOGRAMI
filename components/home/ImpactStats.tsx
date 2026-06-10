"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HOME_IMAGES } from "@/lib/images/home";

const STATS = [
  { label: "Membres actifs", key: "membres" as const, suffix: "+", desc: "Une communauté engagée et solidaire", imgUrl: HOME_IMAGES.impact.members },
  { label: "Projets réalisés", key: "projetsValides" as const, suffix: "", desc: "Des actions concrètes pour un avenir meilleur", imgUrl: HOME_IMAGES.impact.scholarships },
  { label: "Villages", key: "villages" as const, suffix: "", desc: "Des initiatives fédératrices pour nos villages", imgUrl: HOME_IMAGES.impact.projects },
];

interface ImpactStatsProps {
  stats: { membres: number; projetsValides: number; villages: number };
}

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, active]);
  return count;
}

function StatCard({ stat, value, active }: { stat: typeof STATS[0]; value: number; active: boolean }) {
  const count = useCountUp(value, active);
  return (
    <div className="rounded-2xl p-8 text-center flex flex-col items-center shadow-xl" style={{ backgroundColor: "var(--card)" }}>
      <div className="relative w-24 h-24 rounded-full mb-6 overflow-hidden border-4 shadow-sm" style={{ borderColor: "var(--card-border)" }}>
        <Image src={stat.imgUrl} alt={stat.label} fill className="object-cover" sizes="96px" />
      </div>
      <p className="text-4xl font-extrabold mb-2" style={{ color: "var(--card-foreground)" }}>
        {count}{stat.suffix}
      </p>
      <p className="text-lg font-bold mb-3" style={{ color: "var(--acogrami-green)" }}>{stat.label}</p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{stat.desc}</p>
    </div>
  );
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-acogrami-green py-20 lg:py-28 text-white relative" aria-label="Notre impact">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-bold tracking-widest text-[#D97736] uppercase mb-2 block">NOTRE IMPACT</span>
          <h2 className="text-3xl lg:text-4xl font-bold">Notre impact concret</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} value={stats[stat.key] || 0} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
