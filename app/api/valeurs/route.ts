import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const valeurs = await prisma.valeur.findMany({ orderBy: { ordre: 'asc' } })
    return NextResponse.json(valeurs)
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
  }
}
