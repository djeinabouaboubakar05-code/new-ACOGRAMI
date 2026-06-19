import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Une adresse e-mail valide est requise." }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.statut === "DESABONNE") {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { statut: "ACTIF" },
        });
        return NextResponse.json({ message: "Votre abonnement a été réactivé avec succès !" });
      }
      return NextResponse.json({ message: "Vous êtes déjà abonné(e) à notre newsletter." });
    }

    await prisma.newsletterSubscriber.create({
      data: { email, statut: "ACTIF" },
    });

    return NextResponse.json({ message: "Abonnement réussi ! Merci de nous avoir rejoints." });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'abonnement." }, { status: 500 });
  }
}
