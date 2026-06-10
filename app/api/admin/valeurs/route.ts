import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const valeurs = await prisma.valeur.findMany({ orderBy: { ordre: "asc" } });
  return NextResponse.json(valeurs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { titre, resume, description, icone, ordre } = await req.json();
  if (!titre || !resume) return NextResponse.json({ error: "Titre et résumé requis" }, { status: 400 });

  const v = await prisma.valeur.create({ data: { titre, resume, description: description || "", icone: icone || null, ordre: ordre ?? 0 } });
  return NextResponse.json(v, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id, titre, resume, description, icone, ordre } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const v = await prisma.valeur.update({ where: { id }, data: { titre, resume, description: description || "", icone: icone || null, ordre: ordre ?? 0 } });
  return NextResponse.json(v);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id } = await req.json();
  await prisma.valeur.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
