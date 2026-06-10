import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET : Récupérer toutes les actualités
export async function GET() {
    try {
        const actualites = await prisma.actualite.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(actualites)
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        )
    }
}

// POST : Créer une actualité (admin seulement)
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { titre, contenu, image, auteurId } = body

        if (!titre || !contenu || !auteurId) {
            return NextResponse.json(
                { error: 'Titre, contenu et auteur requis' },
                { status: 400 }
            )
        }

        const actualite = await prisma.actualite.create({
            data: {
                titre,
                contenu,
                image: image || null,
                auteurId
            }
        })

        return NextResponse.json(actualite, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        )
    }
}

// PUT : Modifier une actualité
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, titre, contenu, image } = body

        if (!id) {
            return NextResponse.json(
                { error: 'ID requis' },
                { status: 400 }
            )
        }

        const actualite = await prisma.actualite.update({
            where: { id },
            data: { titre, contenu, image }
        })

        return NextResponse.json(actualite)
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la modification' },
            { status: 500 }
        )
    }
}

// DELETE : Supprimer une actualité
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

        await prisma.actualite.delete({ where: { id } })

        return NextResponse.json({ message: 'Actualité supprimée' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }
}