import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";
import { VillagesAdminClient } from "@/components/admin/VillagesAdminClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Villages | Administration ACOGRAMI" };

export default async function AdminVillages() {
  let villages = await prisma.village.findMany({
    include: {
      _count: { select: { membres: true } }
    },
    orderBy: { nom: 'asc' }
  });

  if (villages.length === 0) {
    // Si la table est vide (suite au reset), on crée les 16 villages de base
    const VILLAGE_LIST = [
      "Bamougoum", "Bayangam", "Baleng", "Bamendjou", "Bangou", "Batoufam", 
      "Bandjoun", "Badenkop", "Baméka", "Batié", "Bapa", "Bangam", 
      "Bandrefam", "Bafoussam", "Bahouan", "Baham"
    ];
    await prisma.village.createMany({
      data: VILLAGE_LIST.map(nom => ({
        nom,
        slug: nom.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }))
    });
    villages = await prisma.village.findMany({
      include: {
        _count: { select: { membres: true } },
      },
      orderBy: { nom: 'asc' }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MapPin className="h-7 w-7 text-acogrami-accent" />
          Gestion des Villages
        </h1>
        <p className="mt-2 text-text-muted">
          Cliquez sur un village pour voir la liste de ses membres et les informations détaillées.
        </p>
      </div>

      <VillagesAdminClient initialVillages={villages} />
    </div>
  );
}
