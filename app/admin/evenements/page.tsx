import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EvenementsAdminList } from "@/components/admin/EvenementsAdminList";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Événements | Administration ACOGRAMI" };

export default async function AdminEvenements() {
  let rawEvenements: any[] = [];
  try {
    rawEvenements = await prisma.evenement.findMany({
      orderBy: { date: "desc" },
      include: { inscriptions: { select: { userId: true } } },
    });
  } catch {
    rawEvenements = await prisma.evenement.findMany({ orderBy: { date: "desc" } });
  }

  return (
    <EvenementsAdminList initialEvenements={rawEvenements.map((e: any) => ({
      id: e.id,
      titre: e.titre,
      description: e.description,
      date: e.date.toISOString(),
      lieu: e.lieu,
      statut: e.statut,
      createdAt: e.createdAt.toISOString(),
      nbInscrits: e.inscriptions?.length ?? 0,
    }))} />
  );
}
