import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  const responsableVillage = (session.user as any).village;

  if (userRole !== "RESPONSABLE" && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!responsableVillage && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Village non spécifié pour ce responsable" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de l'utilisateur requis" }, { status: 400 });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Responsable can only delete members of their own village
    if (userRole === "RESPONSABLE") {
      if (userToDelete.village !== responsableVillage) {
        return NextResponse.json({ error: "Vous ne pouvez supprimer que les membres de votre propre village" }, { status: 403 });
      }
      if (userToDelete.role !== "MEMBRE") {
        return NextResponse.json({ error: "Vous ne pouvez pas supprimer un administrateur ou un autre responsable" }, { status: 403 });
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Membre supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
