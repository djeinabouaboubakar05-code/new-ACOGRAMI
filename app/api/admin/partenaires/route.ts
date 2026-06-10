import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const partenaires = await prisma.partenaire.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(partenaires);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { nom, logo, url } = await req.json();
  if (!nom) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

  const p = await prisma.partenaire.create({ data: { nom, logo: logo || null, url: url || null } });
  return NextResponse.json(p, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id, nom, logo, url } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const p = await prisma.partenaire.update({ where: { id }, data: { nom, logo: logo || null, url: url || null } });
  return NextResponse.json(p);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id } = await req.json();
  await prisma.partenaire.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
