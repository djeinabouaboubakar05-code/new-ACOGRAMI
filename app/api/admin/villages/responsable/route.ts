import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, action, villageId } = body;

    if (!userId || !action || !villageId) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    if (action === "promote") {
      // 1. Récupérer l'ancien chef
      const village = await prisma.village.findUnique({ where: { id: villageId } });
      
      // Transaction pour s'assurer que tout se passe bien en même temps
      const queries = [];
      
      if (village?.chefId) {
        queries.push(
          prisma.user.update({
            where: { id: village.chefId },
            data: { role: "MEMBRE" },
          })
        );
      }

      queries.push(
        prisma.village.update({
          where: { id: villageId },
          data: { chefId: userId },
        })
      );

      queries.push(
        prisma.user.update({
          where: { id: userId },
          data: { role: "RESPONSABLE" },
        })
      );

      await prisma.$transaction(queries);
    } else if (action === "demote") {
      await prisma.$transaction([
        prisma.village.update({
          where: { id: villageId },
          data: { chefId: null },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { role: "MEMBRE" },
        })
      ]);
    } else {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur gestion responsable:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
