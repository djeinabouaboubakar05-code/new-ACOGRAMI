import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Users } from "lucide-react";
import { UtilisateursAdminList } from "@/components/admin/UtilisateursAdminList";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Utilisateurs | Administration ACOGRAMI" };

export default async function AdminUtilisateurs() {
  const session = await getServerSession(authOptions);
  const currentAdminEmail = session?.user?.email || undefined;

  const utilisateurs = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  const demandes = await prisma.demandeAdhesion.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Users className="h-7 w-7 text-acogrami-accent" />Gestion des utilisateurs</h1>
        <p className="mt-2 text-zinc-400">{utilisateurs.length} utilisateur{utilisateurs.length > 1 ? "s" : ""} inscrit{utilisateurs.length > 1 ? "s" : ""}</p>
      </div>

      <UtilisateursAdminList
        initialUsers={utilisateurs.map(u => ({
          id: u.id,
          nom: u.nom,
          prenom: u.prenom,
          email: u.email,
          role: u.role,
          village: u.village,
          estValide: u.estValide,
          createdAt: u.createdAt.toISOString()
        }))}
        initialDemandes={demandes.map(d => ({
          id: d.id,
          email: d.email,
          nom: d.nom,
          prenom: d.prenom,
          village: d.village,
          statut: d.statut,
          createdAt: d.createdAt.toISOString()
        }))}
        currentAdminEmail={currentAdminEmail}
      />
    </div>
  );
}
