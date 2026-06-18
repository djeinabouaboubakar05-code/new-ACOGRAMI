import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PaiementCotisation } from "@/components/membre/PaiementCotisation";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Mes Cotisations | Espace Membre" };

export default async function CotisationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/connexion");
  }

  const userId = (session.user as any).id;

  // Récupérer les cotisations réelles de l'utilisateur
  const cotisations = await prisma.cotisation.findMany({
    where: { userId },
    orderBy: { date: "desc" }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mes cotisations</h1>
        <p className="mt-2 text-muted-foreground">
          Payez votre cotisation annuelle et consultez votre historique.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PaiementCotisation userId={userId} />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Historique des paiements</h2>
          
          <div className="space-y-4">
            {cotisations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune cotisation enregistrée.</p>
            ) : (
              cotisations.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div>
                    <p className="font-bold text-foreground">Année {c.annee}</p>
                    <p className="text-xs text-muted-foreground">
                      Le {new Date(c.createdAt || c.date).toLocaleDateString("fr-FR")} • Réf: {c.ref}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{c.montant} FCFA</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                      c.statut === "PAYE" || c.statut === "VALIDE" ? "badge-success" :
                      c.statut === "EN_ATTENTE" ? "badge-warn" : "badge-danger"
                    }`}>
                      {c.statut === "PAYE" || c.statut === "VALIDE" ? "Validé" : c.statut === "EN_ATTENTE" ? "En attente" : "Rejeté"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
