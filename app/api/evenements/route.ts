import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const body = await request.json()
        const { titre, description, date, lieu, image } = body

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
                createurId: (session.user as any).id,
                villageId: (session.user as any).villageId || null
            }
        })

        return NextResponse.json(evenement, { status: 201 })
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        )
    }
}

// PUT : Modifier un événement (admin/responsable)
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const body = await request.json()
        const { id, titre, description, date, lieu, image } = body

        if (!id) {
            return NextResponse.json(
                { error: 'ID requis' },
                { status: 400 }
            )
        }

        const data: any = {};
        if (titre) data.titre = titre;
        if (description) data.description = description;
        if (date) data.date = new Date(date);
        if (lieu) data.lieu = lieu;
        if (image !== undefined) data.image = image;

        const evenement = await prisma.evenement.update({
            where: { id },
            data
        })

        return NextResponse.json(evenement)
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        )
    }
}

// DELETE : Supprimer un événement
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

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