import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const villageId = (session.user as any).villageId;

    if (userRole !== "RESPONSABLE" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Un responsable ne peut agir que sur les membres de son village
    if (userRole === "RESPONSABLE" && targetUser.villageId !== villageId) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    let dataToUpdate: any = {};

    switch (action) {
      case "toggle_delegue":
        dataToUpdate = { estDelegue: !targetUser.estDelegue };
        break;
      case "suspend":
        dataToUpdate = { statut: "SUSPENDU", estDelegue: false };
        break;
      case "depart":
        dataToUpdate = { statut: "PARTI", estDelegue: false };
        break;
      case "reintegrer":
        dataToUpdate = { statut: "ACTIF" };
        break;
      default:
        return NextResponse.json({ error: "Action non valide" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur action membre:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
