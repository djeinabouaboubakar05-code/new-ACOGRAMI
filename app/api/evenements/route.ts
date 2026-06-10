import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// GET : Récupérer tous les événements
export async function GET() {
    try {
        const evenements = await prisma.evenement.findMany({
            orderBy: { date: 'asc' }
        })
        return NextResponse.json(evenements)
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        )
    }
}

// POST : Créer un événement
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { titre, description, date, lieu, image, statut } = body

        if (!titre || !description || !date || !lieu) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            )
        }

        const evenement = await prisma.evenement.create({
            data: {
                titre,
                description,
                date: new Date(date),
                lieu,
                image: image || null,
                statut: statut || 'VALIDE'
            }
        })

        return NextResponse.json(evenement, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        )
    }
}

// PUT : Valider ou rejeter un événement (admin)
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

        const evenement = await prisma.evenement.update({
            where: { id },
            data: { statut }
        })

        return NextResponse.json(evenement)
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        )
    }
}

// DELETE : Supprimer un événement
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

        await prisma.evenement.delete({ where: { id } })

        return NextResponse.json({ message: 'Événement supprimé' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }
}