import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const partenaires = await prisma.partenaire.findMany({ orderBy: { nom: 'asc' } })
    return NextResponse.json(partenaires)
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, logo, url } = body
    if (!nom) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    const partenaire = await prisma.partenaire.create({ data: { nom, logo, url } })
    return NextResponse.json(partenaire, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, nom, logo, url } = body
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    const partenaire = await prisma.partenaire.update({ where: { id }, data: { nom, logo, url } })
    return NextResponse.json(partenaire)
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    await prisma.partenaire.delete({ where: { id } })
    return NextResponse.json({ message: 'Partenaire supprimé' })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
