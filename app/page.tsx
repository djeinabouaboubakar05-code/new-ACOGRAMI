import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { VillagesGrid } from "@/components/home/VillagesGrid";
import { LatestNews } from "@/components/home/LatestNews";
import { ImpactStats } from "@/components/home/ImpactStats";
import { JoinCta } from "@/components/home/JoinCta";
import { PartnersSection } from "@/components/home/PartnersSection";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let membres = 0;
  let projetsValides = 0;
  let villages = 0;

  try {
    const [membresCount, projetsCount, villagesCount] = await Promise.all([
      prisma.user.count(),
      prisma.projet.count({ where: { avancement: { gt: 0 } } }),
      prisma.village.count(),
    ]);
    membres = membresCount;
    projetsValides = projetsCount;
    villages = villagesCount;
  } catch (error) {
    console.error("Failed to load statistics from database:", error);
  }

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
