import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const media = await prisma.galerieMedia.findMany({
            orderBy: { createdAt: 'desc' }
        })
        const photos = media.map(m => ({
            id: m.id,
            titre: m.titre,
            image: m.urlFichier,
            createdAt: m.createdAt
        }))
        return NextResponse.json(photos)
    } catch (error) {
        console.error("Error in GET galerie:", error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await request.json()
        const { image, titre } = body

        if (!image) {
            return NextResponse.json(
                { error: 'Image requise' },
                { status: 400 }
            )
        }

        const item = await prisma.galerieMedia.create({
            data: {
                urlFichier: image,
                titre: titre || null,
                uploadParId: (session.user as any).id
            }
        })

        return NextResponse.json({
            id: item.id,
            titre: item.titre,
            image: item.urlFichier,
            createdAt: item.createdAt
        }, { status: 201 })
    } catch (error) {
        console.error("Error in POST galerie:", error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'ajout' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
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

        await prisma.galerieMedia.delete({ where: { id } })

        return NextResponse.json({ message: 'Photo supprimée' })
    } catch (error) {
        console.error("Error in DELETE galerie:", error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }
}