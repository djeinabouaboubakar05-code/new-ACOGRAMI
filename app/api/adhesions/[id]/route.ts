import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendAdhesionAccepted, sendAdhesionRejected } from "@/lib/email";

// Helper function to generate a random password
function generateRandomPassword(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { statut, motifRejet } = body;

    if (!["EN_ATTENTE", "VALIDEE", "REJETEE"].includes(statut)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    // Mettre à jour la demande d'adhésion
    const demande = await prisma.demandeAdhesion.update({
      where: { id },
      data: { 
        statut,
        ...(motifRejet && { motifRejet })
      },
    });

    // Si validée, créer ou activer l'utilisateur associé
    if (statut === "VALIDEE") {
      const generatedPassword = generateRandomPassword(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const user = await prisma.user.findUnique({
        where: { email: demande.email },
      });

      if (user) {
        // L'utilisateur existe déjà, on le valide et on met à jour son mot de passe
        await prisma.user.update({
          where: { id: user.id },
          data: {
            estValide: true,
            village: demande.village,
            password: hashedPassword,
          },
        });
      } else {
        // Création du nouveau membre
        await prisma.user.create({
          data: {
            email: demande.email,
            password: hashedPassword,
            nom: demande.nom,
            prenom: demande.prenom,
            village: demande.village,
            role: "MEMBRE",
            estValide: true,
          },
        });
      }

      // Envoi de l'email d'acceptation avec le mot de passe
      await sendAdhesionAccepted(demande.email, generatedPassword);

    } else if (statut === "REJETEE") {
      // Envoi de l'email de rejet avec le motif
      const motif = motifRejet || "Ne respecte pas les critères d'adhésion.";
      await sendAdhesionRejected(demande.email, motif);
    }

    return NextResponse.json(demande);
  } catch (error) {
    console.error("Error patching adhesion:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
