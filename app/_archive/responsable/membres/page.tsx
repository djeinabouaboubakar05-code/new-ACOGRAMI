import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import { ResponsableMembresList } from "@/components/responsable/ResponsableMembresList";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Membres | Espace Responsable" };

export default async function ResponsableMembres() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const villageId = (session.user as any).villageId;
  const villageName = (session.user as any).villageName;
  if (!villageId) redirect("/responsable");

  const membres = await prisma.user.findMany({
    where: { villageId },
    orderBy: { nom: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: "var(--foreground)" }}>
          <Users className="h-6 w-6" style={{ color: "var(--acogrami-green)" }} />
          Membres du village
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
          {membres.length} membre{membres.length > 1 ? "s" : ""} pour <span className="font-semibold">{villageName}</span>
        </p>
      </div>

      <ResponsableMembresList
        initialMembres={membres.map((m) => ({
          id: m.id,
          prenom: m.prenom,
          nom: m.nom,
          email: m.email,
          villageId: m.villageId,
          statut: m.statut,
          estDelegue: m.estDelegue,
          role: m.role,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
