import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const media = await prisma.galerieMedia.findMany({ orderBy: { createdAt: "desc" } });
    const images = media.map(m => ({
      id: m.id,
      titre: m.titre,
      image: m.urlFichier,
      createdAt: m.createdAt
    }));
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error in GET admin galerie:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  if ((session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  try {
    const { titre, image } = await req.json();
    if (!image) return NextResponse.json({ error: "Image requise" }, { status: 400 });

    const item = await prisma.galerieMedia.create({
      data: {
        titre: titre || null,
        urlFichier: image,
        uploadParId: (session.user as any).id
      }
    });

    return NextResponse.json({
      id: item.id,
      titre: item.titre,
      image: item.urlFichier,
      createdAt: item.createdAt
    }, { status: 201 });
  } catch (error) {
    console.error("Error in POST admin galerie:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  if ((session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  try {
    const { id } = await req.json();
    await prisma.galerieMedia.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in DELETE admin galerie:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
