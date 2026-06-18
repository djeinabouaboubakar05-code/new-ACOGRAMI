import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH: Mettre à jour le statut d'une demande (Accepter ou Rejeter)
export async function PATCH(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { statut } = body; // Attendu: "VALIDEE" ou "REJETEE"

        if (!['VALIDEE', 'REJETEE'].includes(statut)) {
            return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
        }

        // 1. Mettre à jour la demande d'adhésion
        const demande = await prisma.demandeAdhesion.update({
            where: { id },
            data: { statut }
        });

        // 2. Si la demande est validée, on valide aussi l'utilisateur correspondant via son email
        if (statut === 'VALIDEE') {
            await prisma.user.updateMany({
                where: { email: demande.email },
                data: { estValide: true }
            });
        }

        return NextResponse.json({ message: `Demande ${statut} avec succès`, demande }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }
}
