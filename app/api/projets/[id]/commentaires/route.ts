import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé. Connectez-vous pour commenter." }, { status: 401 });
  }

  try {
    const { contenu } = await request.json();
    if (!contenu || contenu.trim() === "") {
      return NextResponse.json({ error: "Le commentaire ne peut pas être vide" }, { status: 400 });
    }

    const commentaire = await prisma.projetCommentaire.create({
      data: {
        contenu,
        projetId: params.id,
        auteurId: (session.user as any).id,
      },
      include: {
        auteur: {
          select: { nom: true, prenom: true }
        }
      }
    });

    return NextResponse.json(commentaire, { status: 201 });
  } catch (error) {
    console.error("Erreur ajout commentaire:", error);
    return NextResponse.json({ error: "Erreur lors de l'ajout du commentaire" }, { status: 500 });
  }
}
