import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VillageDetailClient } from "@/components/admin/VillageDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ village: string }> }): Promise<Metadata> {
  const { village } = await params;
  const name = decodeURIComponent(village);
  return { title: `Village ${name} | Administration ACOGRAMI` };
}

export default async function VillageDetailPage({ params }: { params: Promise<{ village: string }> }) {
  const { village } = await params;
  const villageName = decodeURIComponent(village);

  const villageData = await prisma.village.findUnique({
    where: { slug: villageName },
    include: {
      membres: {
        orderBy: { nom: "asc" }
      }
    }
  });

  if (!villageData) {
    notFound();
  }

  // Pour la phase 1 on ignore les cotisations, mais on garde 0 pour ne pas casser le composant
  const cotisationsCount = 0;

  return (
    <VillageDetailClient
      villageName={villageData.nom}
      villageId={villageData.id}
      chefId={villageData.chefId}
      members={villageData.membres.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      }))}
      cotisationsCount={cotisationsCount}
    />
  );
}
