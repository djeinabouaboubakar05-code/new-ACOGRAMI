import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { roleBureau: { not: null } }
    });
    const membres = users.map(u => ({
      id: u.id,
      nom: u.nom,
      prenom: u.prenom,
      fonction: u.roleBureau,
      telephone: u.telephone,
      email: u.email,
      photo: u.photo,
      ordre: 0
    }));
    return NextResponse.json(membres);
  } catch (error) {
    console.error("Error in GET admin bureau:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  try {
    const { nom, prenom, fonction, telephone, email, photo } = await req.json();
    if (!nom || !prenom || !fonction)
      return NextResponse.json({ error: "Nom, prénom et fonction sont requis" }, { status: 400 });

    const targetEmail = email || `${prenom.toLowerCase()}.${nom.toLowerCase()}@acogrami.org`;

    // Si l'utilisateur existe déjà, on le met à jour
    const existing = await prisma.user.findUnique({ where: { email: targetEmail } });
    if (existing) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          roleBureau: fonction,
          telephone: telephone || existing.telephone,
          photo: photo || existing.photo,
          roleSysteme: "RESPONSABLE",
          statut: "EN_REGLE"
        }
      });
      return NextResponse.json({
        id: updated.id,
        nom: updated.nom,
        prenom: updated.prenom,
        fonction: updated.roleBureau,
        telephone: updated.telephone,
        email: updated.email,
        photo: updated.photo,
        ordre: 0
      }, { status: 201 });
    }

    const defaultPassword = await bcrypt.hash("acogrami123", 10);
    const user = await prisma.user.create({
      data: {
        email: targetEmail,
        password: defaultPassword,
        nom,
        prenom,
        roleBureau: fonction,
        telephone: telephone || null,
        photo: photo || null,
        roleSysteme: "RESPONSABLE",
        statut: "EN_REGLE"
      }
    });

    return NextResponse.json({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      fonction: user.roleBureau,
      telephone: user.telephone,
      email: user.email,
      photo: user.photo,
      ordre: 0
    }, { status: 201 });
  } catch (error) {
    console.error("Error in POST admin bureau:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  try {
    const { id, nom, prenom, fonction, telephone, email, photo } = await req.json();
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const user = await prisma.user.update({
      where: { id },
      data: {
        nom,
        prenom,
        roleBureau: fonction,
        telephone: telephone || null,
        email,
        photo: photo || null,
        roleSysteme: "RESPONSABLE"
      },
    });

    return NextResponse.json({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      fonction: user.roleBureau,
      telephone: user.telephone,
      email: user.email,
      photo: user.photo,
      ordre: 0
    });
  } catch (error) {
    console.error("Error in PUT admin bureau:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  try {
    const { id } = await req.json();
    // Au lieu de supprimer l'utilisateur, on lui retire son rôle de bureau
    await prisma.user.update({
      where: { id },
      data: {
        roleBureau: null,
        roleSysteme: "MEMBRE"
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in DELETE admin bureau:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
