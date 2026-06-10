import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const body = await request.json();
    const { type } = body;

    if (type === "profil") {
      const { nom, prenom } = body;
      if (!nom || !prenom) {
        return NextResponse.json({ error: "Nom et prénom requis" }, { status: 400 });
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { nom, prenom },
      });

      return NextResponse.json({
        success: true,
        user: { nom: updated.nom, prenom: updated.prenom },
      });
    }

    if (type === "password") {
      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Mots de passe requis" }, { status: 400 });
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!dbUser) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Type de requête inconnu" }, { status: 400 });
  } catch (error) {
    console.error("Error updating profile/password:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
