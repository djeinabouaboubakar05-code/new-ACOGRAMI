import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let users;
    if (email) {
      users = await prisma.user.findMany({
        where: { email: { equals: email, mode: "insensitive" } },
        include: { village: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      users = await prisma.user.findMany({
        where: { statut: "EN_ATTENTE_VALIDATION" },
        include: { village: true },
        orderBy: { createdAt: "desc" },
      });
    }

    const mapped = users.map(u => ({
      id: u.id,
      nom: u.nom,
      prenom: u.prenom,
      village: u.village?.nom || "Non spécifié",
      statut: u.statut === "EN_ATTENTE_VALIDATION" ? "EN_ATTENTE" : u.statut === "EN_REGLE" ? "VALIDEE" : "REJETEE",
      createdAt: u.createdAt
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error in GET adhesions:", error);
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

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const message409 =
        existingUser.statut === "EN_ATTENTE_VALIDATION"
          ? "Une demande d'adhésion est déjà en cours de traitement pour cette adresse e-mail."
          : existingUser.statut === "EN_REGLE"
          ? "Votre demande d'adhésion a déjà été validée. Utilisez vos identifiants pour vous connecter."
          : "Cette adresse e-mail est déjà associée à un compte membre. Connectez-vous directement.";
      return NextResponse.json({ error: message409 }, { status: 409 });
    }

    const dbVillage = await prisma.village.findFirst({
      where: {
        OR: [
          { nom: village },
          { slug: village }
        ]
      }
    });

    const defaultPassword = await bcrypt.hash("acogrami123", 10);
    const user = await prisma.user.create({
      data: {
        email,
        nom,
        prenom,
        password: defaultPassword,
        roleSysteme: "MEMBRE",
        statut: "EN_ATTENTE_VALIDATION",
        villageId: dbVillage ? dbVillage.id : null
      },
      include: { village: true }
    });

    const mapped = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      village: user.village?.nom || "Non spécifié",
      statut: "EN_ATTENTE",
      createdAt: user.createdAt
    };

    return NextResponse.json(mapped, { status: 201 });
  } catch (error) {
    console.error("Error in POST adhesions:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la demande." }, { status: 500 });
  }
}
