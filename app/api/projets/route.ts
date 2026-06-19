import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET : Récupérer tous les projets
export async function GET() {
    try {
        const projets = await prisma.projet.findMany({
            orderBy: { createdAt: 'desc' },
            include: { admin: true }
        })
        return NextResponse.json(projets)
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        )
    }
}

// POST : Soumettre un projet
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const body = await request.json()
        const { titre, description, image } = body

        if (!titre || !description) {
            return NextResponse.json(
                { error: 'Titre et description requis' },
                { status: 400 }
            )
        }

        const projet = await prisma.projet.create({
            data: {
                titre,
                description,
                image: image || null,
                adminId: (session.user as any).id,
                avancement: 0,
                budgetAlloue: 0
            },
            include: { admin: true }
        })

        return NextResponse.json(projet, { status: 201 })
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: 'Erreur lors de la soumission' },
            { status: 500 }
        )
    }
}

// PUT : Modifier un projet (admin)
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const body = await request.json()
        const { id, titre, description, image, avancement, budgetAlloue } = body

        if (!id) {
            return NextResponse.json(
                { error: 'ID requis' },
                { status: 400 }
            )
        }

        const data: any = {};
        if (titre) data.titre = titre;
        if (description) data.description = description;
        if (image !== undefined) data.image = image;
        if (avancement !== undefined) data.avancement = parseInt(avancement);
        if (budgetAlloue !== undefined) data.budgetAlloue = parseFloat(budgetAlloue);

        const projet = await prisma.projet.update({
            where: { id },
            data,
            include: { admin: true }
        })

        return NextResponse.json(projet)
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        )
    }
}

// DELETE : Supprimer un projet
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

        await prisma.projet.delete({ where: { id } })

        return NextResponse.json({ message: 'Projet supprimé' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        )
    }
}