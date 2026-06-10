import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// GET : Récupérer tous les projets
export async function GET() {
    try {
        const projets = await prisma.projet.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(projets)
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        )
    }
}

// POST : Soumettre un projet (responsable village)
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { titre, description, image, soumisPar } = body

        if (!titre || !description || !soumisPar) {
            return NextResponse.json(
                { error: 'Titre, description et auteur requis' },
                { status: 400 }
            )
        }

        const projet = await prisma.projet.create({
            data: {
                titre,
                description,
                image: image || null,
                soumisPar,
                statut: 'EN_ATTENTE'
            }
        })

        return NextResponse.json(projet, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la soumission' },
            { status: 500 }
        )
    }
}

// PUT : Valider ou rejeter un projet (admin)
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, statut } = body

        if (!id || !statut) {
            return NextResponse.json(
                { error: 'ID et statut requis' },
                { status: 400 }
            )
        }

        const projet = await prisma.projet.update({
            where: { id },
            data: { statut }
        })

        return NextResponse.json(projet)
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        )
    }
}

// DELETE : Supprimer un projet
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

        await prisma.projet.delete({ where: { id } })

        return NextResponse.json({ message: 'Projet supprimé' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }
}