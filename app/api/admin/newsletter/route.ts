import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterNotification } from "@/lib/email";

export async function GET() {
  try {
    const abonnes = await prisma.newsletterAbonne.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(abonnes);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { subject, content } = await request.json();
    if (!subject || !content) {
      return NextResponse.json({ error: "Sujet et contenu requis." }, { status: 400 });
    }

    const abonnes = await prisma.newsletterAbonne.findMany({
      where: { actif: true }
    });

    const emails = abonnes.map(a => a.email);
    if (emails.length === 0) {
      return NextResponse.json({ error: "Aucun abonné actif." }, { status: 400 });
    }

    // Appel à la fonction d'envoi d'e-mail
    await sendNewsletterNotification(emails, subject, content);

    return NextResponse.json({ message: `Newsletter envoyée avec succès à ${emails.length} abonné(s).` });
  } catch (error) {
    console.error("Erreur envoi newsletter:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }
}
