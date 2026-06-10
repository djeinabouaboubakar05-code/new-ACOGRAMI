import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (email) {
      const demandes = await prisma.demandeAdhesion.findMany({
        where: { email: { equals: email, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(demandes);
    }

    const demandes = await prisma.demandeAdhesion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(demandes);
  } catch {
    return NextResponse.json({ error: "Erreur lors du chargement" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, nom, prenom, village } = body;

    if (!email || !nom || !prenom || !village) {
      return NextResponse.json({ error: "Tous les champs obligatoires sont requis." }, { status: 400 });
    }

    // Vérification : compte membre actif existant
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Cette adresse e-mail est déjà associée à un compte membre. Connectez-vous directement." },
        { status: 409 }
      );
    }

    // Vérification : demande déjà soumise
    const existingDemande = await prisma.demandeAdhesion.findFirst({
      where: { email: { equals: email, mode: "insensitive" }, statut: { in: ["EN_ATTENTE", "VALIDEE"] } },
    });
    if (existingDemande) {
      const message409 =
        existingDemande.statut === "EN_ATTENTE"
          ? "Une demande d'adhésion est déjà en cours de traitement pour cette adresse e-mail."
          : "Votre demande d'adhésion a déjà été validée. Utilisez vos identifiants pour vous connecter.";
      return NextResponse.json({ error: message409 }, { status: 409 });
    }

    const demande = await prisma.demandeAdhesion.create({
      data: { email, nom, prenom, village },
    });

    return NextResponse.json(demande, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la création de la demande." }, { status: 500 });
  }
}
