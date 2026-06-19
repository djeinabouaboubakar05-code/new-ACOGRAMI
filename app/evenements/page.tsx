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
      where: { estPublic: true },
      orderBy: { date: "asc" },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  const data = rawEvenements.map((e: any) => ({
    id: e.id,
    titre: e.titre,
    description: e.description,
    date: e.date.toISOString(),
    lieu: e.lieu,
    image: e.image ?? null,
    nbInscrits: 0,
    isInscrit: false,
  }));

  return <EvenementsClient evenements={data} isLoggedIn={!!userId} />;
}
