import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Middleware checks if user is ADMIN
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return null;
  }
  return session;
}

// PUT: Mettre à jour le rôle, la validation ou le village d'un utilisateur
export async function PUT(request: Request) {
  const adminSession = await verifyAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, role, estValide, village } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de l'utilisateur requis" }, { status: 400 });
    }

    const updatedData: any = {};
    if (role !== undefined) updatedData.role = role;
    if (estValide !== undefined) updatedData.estValide = estValide;
    if (village !== undefined) updatedData.village = village;

    const user = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Erreur lors de la modification de l'utilisateur" }, { status: 500 });
  }
}

// DELETE: Supprimer un utilisateur
export async function DELETE(request: Request) {
  const adminSession = await verifyAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de l'utilisateur requis" }, { status: 400 });
    }

    // Protection: Ne pas se supprimer soi-même
    const currentAdminId = (adminSession.user as any).id;
    if (id === currentAdminId) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte administrateur" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de l'utilisateur" }, { status: 500 });
  }
}
