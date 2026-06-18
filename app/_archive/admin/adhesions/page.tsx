import { prisma } from "@/lib/prisma";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { revalidatePath } from "next/cache";

// --- SERVER ACTION : La fonction qui s'exécute quand on clique sur un bouton ---
async function gererAdhesion(formData: FormData) {
  "use server"; // Obligatoire pour indiquer que ce code tourne sur le serveur

  const id = formData.get("id") as string;
  const action = formData.get("action") as string; // "VALIDEE" ou "REJETEE"

  if (id && action) {
    // On met à jour le statut dans la base de données
    await prisma.demandeAdhesion.update({
      where: { id },
      data: { statut: action }
    });

    // Note : Plus tard, si l'action est "VALIDEE", nous pourrons ajouter du code ici 
    // pour créer automatiquement un compte "User" et lui envoyer un email !

    // On rafraîchit la page instantanément pour voir les changements
    revalidatePath("/admin/adhesions");
    revalidatePath("/admin");
  }
}

// --- LE COMPOSANT DE LA PAGE ---
export default async function AdhesionsPage() {
  // On va chercher toutes les demandes qui sont "EN_ATTENTE"
  const demandes = await prisma.demandeAdhesion.findMany({
    where: { statut: "EN_ATTENTE" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Gestion des Adhésions</h1>
        <p className="mt-2 text-zinc-400">Examinez et validez les nouvelles demandes pour rejoindre ACOGRAMI.</p>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            Demandes en attente ({demandes.length})
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {demandes.length === 0 ? (
            <p className="p-8 text-center text-zinc-400">Aucune demande d'adhésion en attente pour le moment.</p>
          ) : (
            demandes.map((demande) => (
              <div key={demande.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Infos du demandeur */}
                <div>
                  <h3 className="font-medium text-white text-lg">
                    {demande.prenom} {demande.nom}
                  </h3>
                  <div className="text-sm text-zinc-400 mt-1 flex flex-col sm:flex-row sm:gap-4">
                    <span>📧 {demande.email}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>🏡 Village : {demande.village}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>📅 Date : {demande.createdAt.toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Boutons d'action via formulaire */}
                <form action={gererAdhesion} className="flex gap-3">
                  <input type="hidden" name="id" value={demande.id} />

                  {/* Bouton Valider */}
                  <button
                    type="submit"
                    name="action"
                    value="VALIDEE"
                    className="flex items-center gap-2 px-4 py-2 bg-green-900/40 text-green-400 rounded-lg hover:bg-green-900/60 transition-colors font-medium text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Valider
                  </button>

                  {/* Bouton Rejeter */}
                  <button
                    type="submit"
                    name="action"
                    value="REJETEE"
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/40 text-red-400 rounded-lg hover:bg-red-900/60 transition-colors font-medium text-sm"
                  >
                    <XCircle className="h-4 w-4" />
                    Rejeter
                  </button>
                </form>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
