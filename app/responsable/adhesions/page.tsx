import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import { ResponsableAdhesionsList } from "@/components/responsable/ResponsableAdhesionsList";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Adhésions | Espace Responsable" };

export default async function ResponsableAdhesions() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const village = (session.user as any).village;
  if (!village) redirect("/responsable");

  const demandes = await prisma.demandeAdhesion.findMany({
    where: { village },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: "var(--foreground)" }}><Users className="h-6 w-6" style={{ color: "var(--acogrami-green)" }} />Demandes d&apos;adhésion</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Village de <span className="font-semibold">{village}</span></p>
      </div>

      <ResponsableAdhesionsList
        initialDemandes={demandes.map(d => ({
          id: d.id,
          prenom: d.prenom,
          nom: d.nom,
          email: d.email,
          statut: d.statut,
          createdAt: d.createdAt.toISOString()
        }))}
      />
    </div>
  );
}
