import { NextResponse } from "next/server";

// POST: s'inscrire à un événement (Simulé)
export async function POST() {
  return NextResponse.json({ success: true, message: "Inscription simulée" }, { status: 201 });
}

// DELETE: se désinscrire d'un événement (Simulé)
export async function DELETE() {
  return NextResponse.json({ success: true });
}

// GET: liste des inscrits d'un événement (Simulé)
export async function GET() {
  return NextResponse.json([]);
}
