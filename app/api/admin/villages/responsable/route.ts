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
    const { userId, action, village } = body;

    if (!userId || !action || !village) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    if (action === "promote") {
      // 1. Rétrograder le responsable actuel du village (s'il existe)
      await prisma.user.updateMany({
        where: {
          village: village,
          role: "RESPONSABLE",
        },
        data: {
          role: "MEMBRE",
        },
      });

      // 2. Promouvoir le nouvel utilisateur
      await prisma.user.update({
        where: { id: userId },
        data: { role: "RESPONSABLE" },
      });
    } else if (action === "demote") {
      // Rétrograder l'utilisateur
      await prisma.user.update({
        where: { id: userId },
        data: { role: "MEMBRE" },
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
