import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { nom, email, montant, reference, userId } = await request.json();

    if (!nom || !email || !montant || !reference) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const parsedMontant = parseInt(montant);
    if (isNaN(parsedMontant) || parsedMontant <= 0) {
      return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
    }

    // Création du don en base de données
    const don = await prisma.don.create({
      data: {
        nom,
        email,
        montant: parsedMontant,
        reference, // La référence de transaction (ex: numéro Mobile Money, ou virement)
        userId: userId || null, // Optionnel, si le membre est connecté
        statut: "EN_ATTENTE" // Le don est en attente de validation par l'admin
      }
    });

    return NextResponse.json({ 
      message: "Votre déclaration de don a été enregistrée. Merci infiniment pour votre générosité !" 
    });
  } catch (error: any) {
    console.error("Erreur enregistrement don:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Cette référence de transaction a déjà été utilisée." }, { status: 400 });
    }
    return NextResponse.json({ error: "Une erreur est survenue lors de l'enregistrement." }, { status: 500 });
  }
}
