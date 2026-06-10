import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET : Récupérer les cotisations
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const village = searchParams.get("village");

  try {
    const where: any = {};
    if (userId) {
      where.userId = userId;
    } else if (village) {
      where.user = { village };
    }

    const cotisations = await prisma.cotisation.findMany({
      where,
      include: {
        user: {
          select: { nom: true, prenom: true, email: true, village: true }
        }
      },
      orderBy: { date: "desc" }
    });

    return NextResponse.json(cotisations);
  } catch (error) {
    console.error("Error fetching cotisations:", error);
    return NextResponse.json({ error: "Erreur lors du chargement" }, { status: 500 });
  }
}

// POST : Créer une cotisation (simuler un paiement)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const currentUserId = (session.user as any).id;

  try {
    const body = await request.json();
    const { montant, annee, statut, ref, userId } = body;

    if (!montant || !annee || !ref) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const targetUserId = userId || currentUserId;

    const cotisation = await prisma.cotisation.create({
      data: {
        montant: parseInt(montant),
        annee,
        statut: statut || "PAYE",
        ref,
        userId: targetUserId,
      }
    });

    return NextResponse.json(cotisation, { status: 201 });
  } catch (error) {
    console.error("Error creating cotisation:", error);
    return NextResponse.json({ error: "Erreur lors du paiement" }, { status: 500 });
  }
}

// PUT : Mettre à jour le statut d'une cotisation
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "RESPONSABLE") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, statut } = body;

    if (!id || !statut) {
      return NextResponse.json({ error: "ID et statut requis" }, { status: 400 });
    }

    const updated = await prisma.cotisation.update({
      where: { id },
      data: { statut }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating cotisation:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
