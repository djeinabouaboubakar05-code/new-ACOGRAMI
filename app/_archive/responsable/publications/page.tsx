import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Newspaper } from "lucide-react";
import { PublicationsResponsable } from "@/components/responsable/PublicationsResponsable";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Publications | Espace Responsable" };

export default async function ResponsablePublications() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const auteurId = user.id;
  const userVillage = user.village || "Général";

  const actualites = await prisma.actualite.findMany({
    where: { auteurId },
    orderBy: { createdAt: "desc" }
  });

  const projets = await prisma.projet.findMany({
    where: { soumisPar: userVillage },
    orderBy: { createdAt: "desc" }
  });

  const evenements = await prisma.evenement.findMany({
    orderBy: { date: "desc" }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "var(--foreground)" }}>
          <Newspaper className="h-7 w-7 text-acogrami-green" />
          Espace de publication
        </h1>
        <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>
          Gérez les actualités de votre village, proposez des projets et des événements communautaires.
        </p>
      </div>

      <PublicationsResponsable
        initialActualites={actualites.map(a => ({
          id: a.id,
          titre: a.titre,
          contenu: a.contenu,
          image: a.image,
          createdAt: a.createdAt.toISOString()
        }))}
        initialProjets={projets.map(p => ({
          id: p.id,
          titre: p.titre,
          description: p.description,
          statut: p.statut,
          soumisPar: p.soumisPar,
          createdAt: p.createdAt.toISOString()
        }))}
        initialEvenements={evenements.map(e => ({
          id: e.id,
          titre: e.titre,
          description: e.description,
          date: e.date.toISOString(),
          lieu: e.lieu,
          statut: e.statut,
          createdAt: e.createdAt.toISOString()
        }))}
        auteurId={auteurId}
        village={userVillage}
      />
    </div>
  );
}
