import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";
import { VillagesAdminClient } from "@/components/admin/VillagesAdminClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Villages | Administration ACOGRAMI" };

export default async function AdminVillages() {
  const membresParVillage = await prisma.user.groupBy({
    by: ["village"],
    _count: { id: true },
    where: { village: { not: null } },
  });

  const map = Object.fromEntries(
    membresParVillage.map((m) => [m.village || "", m._count.id])
  );

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

      <VillagesAdminClient villageCounts={map} />
    </div>
  );
}
