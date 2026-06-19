import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAdhesionAccepted, sendAdhesionRejected } from "@/lib/email";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { statut, motifRejet } = body; // Attendu: "VALIDEE" ou "REJETEE"

    if (!["VALIDEE", "REJETEE"].includes(statut)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { village: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Si la demande est validée, on passe son statut à EN_REGLE
    if (statut === "VALIDEE") {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          statut: "EN_REGLE",
        },
        include: { village: true }
      });

      // Envoi de l'email d'acceptation avec indication du mot de passe par défaut
      await sendAdhesionAccepted(updatedUser.email, "acogrami123");

      return NextResponse.json({
        id: updatedUser.id,
        email: updatedUser.email,
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        village: updatedUser.village?.nom || "Non spécifié",
        statut: "VALIDEE",
        createdAt: updatedUser.createdAt
      });
    } else {
      // Si la demande est rejetée, on supprime l'utilisateur temporaire pour libérer son email
      await prisma.user.delete({
        where: { id }
      });

      // Envoi de l'email de rejet avec le motif
      const motif = motifRejet || "Ne respecte pas les critères d'adhésion.";
      await sendAdhesionRejected(user.email, motif);

      return NextResponse.json({
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        village: user.village?.nom || "Non spécifié",
        statut: "REJETEE",
        createdAt: user.createdAt
      });
    }
  } catch (error) {
    console.error("Error patching adhesion:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
