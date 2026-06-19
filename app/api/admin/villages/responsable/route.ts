import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, action, villageId } = body;

    if (!userId || !action || !villageId) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    if (action === "promote") {
      // Trouver les anciens responsables de ce village pour les repasser en MEMBRE simple
      const oldResponsables = await prisma.user.findMany({
        where: { villageId, roleSysteme: "RESPONSABLE" }
      });
      
      const queries = [];
      
      for (const oldResp of oldResponsables) {
        queries.push(
          prisma.user.update({
            where: { id: oldResp.id },
            data: { roleSysteme: "MEMBRE" },
          })
        );
      }

      // Promouvoir le nouvel utilisateur et le lier au village
      queries.push(
        prisma.user.update({
          where: { id: userId },
          data: { roleSysteme: "RESPONSABLE", villageId: villageId },
        })
      );

      await prisma.$transaction(queries);
    } else if (action === "demote") {
      // Déchoir le responsable de ses droits (il redevient simple membre du village)
      await prisma.user.update({
        where: { id: userId },
        data: { roleSysteme: "MEMBRE" },
      });
    } else {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur gestion responsable:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
