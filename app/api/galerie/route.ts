import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET : Récupérer toutes les photos
export async function GET() {
    try {
        const photos = await prisma.galerie.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(photos)
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        )
    }
}

// POST : Ajouter une photo
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { image, titre } = body

        if (!image) {
            return NextResponse.json(
                { error: 'Image requise' },
                { status: 400 }
            )
        }

        const photo = await prisma.galerie.create({
            data: {
                image,
                titre: titre || null
            }
        })

        return NextResponse.json(photo, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de l\'ajout' },
            { status: 500 }
        )
    }
}

// DELETE : Supprimer une photo
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID requis' },
                { status: 400 }
            )
        }

        await prisma.galerie.delete({ where: { id } })

        return NextResponse.json({ message: 'Photo supprimée' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }
}