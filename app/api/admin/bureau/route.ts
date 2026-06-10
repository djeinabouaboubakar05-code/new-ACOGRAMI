import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const membres = await prisma.membreBureau.findMany({ orderBy: { ordre: "asc" } });
  return NextResponse.json(membres);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { nom, prenom, fonction, telephone, email, photo, ordre } = await req.json();
  if (!nom || !prenom || !fonction)
    return NextResponse.json({ error: "Nom, prénom et fonction sont requis" }, { status: 400 });

  const membre = await prisma.membreBureau.create({
    data: { nom, prenom, fonction, telephone: telephone || null, email: email || null, photo: photo || null, ordre: ordre ?? 0 },
  });
  return NextResponse.json(membre, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id, nom, prenom, fonction, telephone, email, photo, ordre } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const membre = await prisma.membreBureau.update({
    where: { id },
    data: { nom, prenom, fonction, telephone: telephone || null, email: email || null, photo: photo || null, ordre: ordre ?? 0 },
  });
  return NextResponse.json(membre);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id } = await req.json();
  await prisma.membreBureau.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
