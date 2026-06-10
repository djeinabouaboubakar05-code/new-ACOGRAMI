import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let conf = await prisma.configuration.findUnique({
      where: { cle: "cotisationAnnuelle" },
    });
    
    if (!conf) {
      conf = await prisma.configuration.create({
        data: { cle: "cotisationAnnuelle", valeur: "5000" }, // Valeur par défaut
      });
    }
    
    return NextResponse.json({ cotisationAnnuelle: parseInt(conf.valeur) });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération de la configuration" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { cotisationAnnuelle } = await request.json();
    
    if (!cotisationAnnuelle || isNaN(parseInt(cotisationAnnuelle))) {
      return NextResponse.json({ error: "Montant valide requis" }, { status: 400 });
    }

    await prisma.configuration.upsert({
      where: { cle: "cotisationAnnuelle" },
      update: { valeur: cotisationAnnuelle.toString() },
      create: { cle: "cotisationAnnuelle", valeur: cotisationAnnuelle.toString() },
    });
    
    return NextResponse.json({ message: "Configuration mise à jour avec succès." });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la configuration" }, { status: 500 });
  }
}
