import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const villages = await prisma.village.findMany({ orderBy: { nom: 'asc' } })
    return NextResponse.json(villages)
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, slug, description, image } = body
    if (!nom || !slug) {
      return NextResponse.json({ error: 'Nom et slug requis' }, { status: 400 })
    }
    const village = await prisma.village.create({ data: { nom, slug, description, image } })
    return NextResponse.json(village, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, nom, slug, description, image } = body
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    const village = await prisma.village.update({ where: { id }, data: { nom, slug, description, image } })
    return NextResponse.json(village)
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    await prisma.village.delete({ where: { id } })
    return NextResponse.json({ message: 'Village supprimé' })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
