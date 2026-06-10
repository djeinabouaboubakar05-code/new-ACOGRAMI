import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { nom, email, message } = body

        if (!nom || !email || !message) {
            return NextResponse.json(
                { error: 'Nom, email et message requis' },
                { status: 400 }
            )
        }

        const contact = await prisma.contactMessage.create({
            data: {
                nom,
                email,
                message,
                lu: false
            }
        })

        return NextResponse.json(
            { message: 'Message envoyé avec succès' },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de l\'envoi du message' },
            { status: 500 }
        )
    }
}