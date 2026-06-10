import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const membres = await prisma.membreBureau.findMany({ orderBy: { ordre: 'asc' } })
    return NextResponse.json(membres)
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
  }
}
