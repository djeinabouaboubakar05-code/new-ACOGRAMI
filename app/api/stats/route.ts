import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [membres, villages, projets, evenements, adhesions] = await Promise.all([
      prisma.user.count(),
      prisma.village.count(),
      prisma.projet.count(),
      prisma.evenement.count(),
      prisma.demandeAdhesion.count({ where: { statut: 'EN_ATTENTE' } }),
    ])
    const projetsValides = await prisma.projet.count({ where: { statut: 'VALIDE' } })
    return NextResponse.json({ membres, villages, projets, evenements, adhesions, projetsValides })
  } catch {
    return NextResponse.json({ error: 'Erreur lors du chargement des stats' }, { status: 500 })
  }
}
