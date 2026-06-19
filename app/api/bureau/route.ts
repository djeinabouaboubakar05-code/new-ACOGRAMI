import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { roleBureau: { not: null } }
    })
    const membres = users.map(u => ({
      id: u.id,
      nom: u.nom,
      prenom: u.prenom,
      fonction: u.roleBureau,
      telephone: u.telephone,
      email: u.email,
      photo: u.photo,
      ordre: 0
    }))
    return NextResponse.json(membres)
  } catch (error) {
    console.error("Error fetching public bureau:", error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
  }
}
