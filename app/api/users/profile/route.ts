import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { nom, prenom, email, currentPassword, newPassword } = await request.json();

    const dataToUpdate: any = {};
    if (nom) dataToUpdate.nom = nom;
    if (prenom) dataToUpdate.prenom = prenom;
    if (email) dataToUpdate.email = email;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Mot de passe actuel requis" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return NextResponse.json({ 
      message: "Profil mis à jour avec succès", 
      user: { id: updatedUser.id, nom: updatedUser.nom, prenom: updatedUser.prenom, email: updatedUser.email } 
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Cet e-mail est déjà utilisé." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
