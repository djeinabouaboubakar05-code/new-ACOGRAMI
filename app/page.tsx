import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { VillagesGrid } from "@/components/home/VillagesGrid";
import { LatestNews } from "@/components/home/LatestNews";
import { ImpactStats } from "@/components/home/ImpactStats";
import { JoinCta } from "@/components/home/JoinCta";
import { PartnersSection } from "@/components/home/PartnersSection";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [membres, projetsValides, villages] = await Promise.all([
    prisma.user.count(),
    prisma.projet.count({ where: { avancement: { gt: 0 } } }),
    prisma.village.count(),
  ]);

  return (
    <>
      <Hero />
      <AboutPreview />
      <VillagesGrid />
      <ImpactStats stats={{ membres, projetsValides, villages }} />
      <LatestNews />
      <PartnersSection />
      <JoinCta />
    </>
  );
}
