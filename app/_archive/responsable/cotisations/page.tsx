import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreditCard } from "lucide-react";
import { ResponsableCotisationsClient } from "@/components/responsable/ResponsableCotisationsClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Cotisations | Espace Responsable" };

export default async function ResponsableCotisations() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const village = (session.user as any).village;
  if (!village) redirect("/responsable");

  // Fetch users of the village (role MEMBRE only)
  const membres = await prisma.user.findMany({
    where: { village, role: "MEMBRE" },
    select: { id: true, nom: true, prenom: true, email: true }
  });

  const userIds = membres.map((m) => m.id);

  // Fetch cotisations of those users
  const cotisations = await prisma.cotisation.findMany({
    where: { userId: { in: userIds } },
    include: { user: true },
    orderBy: { date: "desc" }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "var(--foreground)" }}>
            <CreditCard className="h-7 w-7 text-acogrami-green" />
            Cotisations
          </h1>
          <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>
            Suivi des contributions financières du village <span className="font-semibold">{village}</span>
          </p>
        </div>
      </div>

      <ResponsableCotisationsClient
        initialCotisations={cotisations.map((c) => ({
          id: c.id,
          montant: c.montant,
          annee: c.annee,
          ref: c.ref,
          date: c.date.toISOString(),
          user: {
            id: c.user.id,
            prenom: c.user.prenom,
            nom: c.user.nom,
            email: c.user.email,
          },
        }))}
        allMembres={membres}
        village={village}
      />
    </div>
  );
}
