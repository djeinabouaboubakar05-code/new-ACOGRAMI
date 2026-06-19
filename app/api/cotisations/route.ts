import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET : Récupérer les cotisations (Paiements)
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
      where.user = {
        village: {
          OR: [
            { nom: village },
            { slug: village }
          ]
        }
      };
    }

    const payments = await prisma.paiement.findMany({
      where,
      include: {
        user: {
          select: { nom: true, prenom: true, email: true, village: true }
        }
      },
      orderBy: { datePaiement: "desc" }
    });

    const cotisations = payments.map(p => ({
      id: p.id,
      montant: p.montant,
      annee: new Date(p.datePaiement).getFullYear().toString(),
      statut: p.statut === "VALIDE" ? "PAYE" : p.statut === "REJETE" ? "IMPAYE" : "EN_ATTENTE",
      date: p.datePaiement,
      ref: p.reference,
      userId: p.userId,
      user: {
        nom: p.user.nom,
        prenom: p.user.prenom,
        email: p.user.email,
        village: p.user.village?.nom || "Non spécifié"
      }
    }));

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

    const payment = await prisma.paiement.create({
      data: {
        montant: parseFloat(montant),
        type: "REINSCRIPTION",
        methode: "MOBILE_MONEY",
        reference: ref,
        statut: statut === "PAYE" ? "VALIDE" : "EN_ATTENTE",
        userId: targetUserId,
      }
    });

    const cotisation = {
      id: payment.id,
      montant: payment.montant,
      annee,
      statut: payment.statut === "VALIDE" ? "PAYE" : "EN_ATTENTE",
      date: payment.datePaiement,
      ref: payment.reference,
      userId: payment.userId,
    };

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

    const updated = await prisma.paiement.update({
      where: { id },
      data: { 
        statut: statut === "PAYE" ? "VALIDE" : statut === "IMPAYE" ? "REJETE" : statut 
      }
    });

    const cotisation = {
      id: updated.id,
      montant: updated.montant,
      annee: new Date(updated.datePaiement).getFullYear().toString(),
      statut: updated.statut === "VALIDE" ? "PAYE" : updated.statut === "REJETE" ? "IMPAYE" : "EN_ATTENTE",
      date: updated.datePaiement,
      ref: updated.reference,
      userId: updated.userId,
    };

    return NextResponse.json(cotisation);
  } catch (error) {
    console.error("Error updating cotisation:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
