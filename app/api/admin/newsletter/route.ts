import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterNotification } from "@/lib/email";

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { dateAbonnement: 'desc' }
    });
    // Mapper pour compatibilité frontend (statut === ACTIF -> actif: true)
    const abonnes = subscribers.map(s => ({
      id: s.id,
      email: s.email,
      nom: s.nom,
      actif: s.statut === 'ACTIF',
      createdAt: s.dateAbonnement
    }));
    return NextResponse.json(abonnes);
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { subject, content } = await request.json();
    if (!subject || !content) {
      return NextResponse.json({ error: "Sujet et contenu requis." }, { status: 400 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { statut: 'ACTIF' }
    });

    const emails = subscribers.map(s => s.email);
    if (emails.length === 0) {
      return NextResponse.json({ error: "Aucun abonné actif." }, { status: 400 });
    }

    // Envoi des emails de notification
    await sendNewsletterNotification(emails, subject, content);

    return NextResponse.json({ message: `Newsletter envoyée avec succès à ${emails.length} abonné(s).` });
  } catch (error) {
    console.error("Erreur envoi newsletter:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }
}
