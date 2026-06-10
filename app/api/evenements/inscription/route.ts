import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: s'inscrire à un événement
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { evenementId } = await request.json();
    if (!evenementId) return NextResponse.json({ error: "ID d'événement requis" }, { status: 400 });

    const userId = (session.user as any).id;

    const evenement = await prisma.evenement.findUnique({ where: { id: evenementId } });
    if (!evenement) return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
    if (evenement.statut !== "VALIDE") return NextResponse.json({ error: "Cet événement n'est pas ouvert aux inscriptions" }, { status: 400 });

    const inscription = await prisma.inscriptionEvenement.create({
      data: { evenementId, userId },
    });

    return NextResponse.json(inscription, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Vous êtes déjà inscrit à cet événement" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE: se désinscrire d'un événement
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const evenementId = searchParams.get("evenementId");
    if (!evenementId) return NextResponse.json({ error: "ID d'événement requis" }, { status: 400 });

    const userId = (session.user as any).id;

    await prisma.inscriptionEvenement.delete({
      where: { evenementId_userId: { evenementId, userId } },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
  }
}

// GET: liste des inscrits d'un événement (admin/responsable)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const evenementId = searchParams.get("evenementId");

  if (!evenementId) {
    // Return events the current user is registered for
    const userId = (session.user as any).id;
    const inscriptions = await prisma.inscriptionEvenement.findMany({
      where: { userId },
      include: { evenement: true },
      orderBy: { evenement: { date: "asc" } },
    });
    return NextResponse.json(inscriptions);
  }

  const inscriptions = await prisma.inscriptionEvenement.findMany({
    where: { evenementId },
    include: { user: { select: { id: true, nom: true, prenom: true, email: true, village: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(inscriptions);
}
