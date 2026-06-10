import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EvenementsClient } from "./EvenementsClient";

export const metadata: Metadata = { title: "Événements | ACOGRAMI" };
export const revalidate = 60;

export default async function EvenementsPage() {
  const session = await getServerSession(authOptions);
  const userId = session ? (session.user as any).id : null;

  let rawEvenements: any[] = [];
  try {
    rawEvenements = await prisma.evenement.findMany({
      where: { statut: "VALIDE" },
      orderBy: { date: "asc" },
      include: { inscriptions: { select: { userId: true } } },
    });
  } catch {
    rawEvenements = await prisma.evenement.findMany({
      where: { statut: "VALIDE" },
      orderBy: { date: "asc" },
    });
  }

  const data = rawEvenements.map((e: any) => ({
    id: e.id,
    titre: e.titre,
    description: e.description,
    date: e.date.toISOString(),
    lieu: e.lieu,
    image: e.image ?? null,
    nbInscrits: e.inscriptions?.length ?? 0,
    isInscrit: userId ? (e.inscriptions ?? []).some((i: any) => i.userId === userId) : false,
  }));

  return <EvenementsClient evenements={data} isLoggedIn={!!userId} />;
}
