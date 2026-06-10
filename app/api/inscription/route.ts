import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, nom, prenom, village } = body

        // Vérifier que tous les champs sont présents
        if (!email || !password || !nom || !prenom || !village) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            )
        }

        // Vérifier si l'email existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Cet email est déjà utilisé' },
                { status: 400 }
            )
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10)

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                nom,
                prenom,
                role: 'MEMBRE',
                estValide: false  // En attente de validation par un responsable
            }
        })

        // Créer une demande d'adhésion
        await prisma.demandeAdhesion.create({
            data: {
                email,
                nom,
                prenom,
                village,
                statut: 'EN_ATTENTE'
            }
        })

        return NextResponse.json(
            { message: 'Demande envoyée avec succès' },
            { status: 201 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Erreur lors de l\'inscription' },
            { status: 500 }
        )
    }
}