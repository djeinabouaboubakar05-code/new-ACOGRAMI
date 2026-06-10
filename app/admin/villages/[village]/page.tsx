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

  const members = await prisma.user.findMany({
    where: { village: villageName },
    select: {
      id: true,
      prenom: true,
      nom: true,
      email: true,
      role: true,
      village: true,
      estValide: true,
      createdAt: true,
    },
    orderBy: { nom: "asc" },
  });

  if (members.length === 0 && !["Bafoussam","Bamougoum","Bansoa","Bandjoun","Baham","Batié","Batcham","Baleng","Dschang","Fokoué","Foumban","Foumbot","Koutaba","Mbouda","Penka-Michel","Tonga"].includes(villageName)) {
    notFound();
  }

  // Get cotisations count for this village's members
  const memberIds = members.map((m) => m.id);
  const cotisationsCount = memberIds.length > 0
    ? await prisma.cotisation.count({ where: { userId: { in: memberIds } } })
    : 0;

  return (
    <VillageDetailClient
      villageName={villageName}
      members={members.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      }))}
      cotisationsCount={cotisationsCount}
    />
  );
}
