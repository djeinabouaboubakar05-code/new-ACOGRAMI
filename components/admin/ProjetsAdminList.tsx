"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Trash2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface Projet {
  id: string;
  titre: string;
  description: string;
  statut: string;
  soumisPar: string;
  createdAt: string | Date;
}

export function ProjetsAdminList({ initialProjets }: { initialProjets: Projet[] }) {
  const [projets, setProjets] = useState<Projet[]>(initialProjets);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdateStatut = async (id: string, statut: "VALIDE" | "REJETE") => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/projets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, statut }),
      });

      if (res.ok) {
        setProjets((prev) =>
          prev.map((p) => (p.id === id ? { ...p, statut } : p))
        );
        router.refresh();
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/projets?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjets((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setLoadingId(null);
    }
  };

  const handleNotify = async (p: Projet) => {
    if (!confirm(`Voulez-vous notifier tous les abonnés de la newsletter pour le projet : ${p.titre} ?`)) return;
    
    setLoadingId(`notify-${p.id}`);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Nouveau projet publié : ${p.titre}`,
          content: `<p>Bonjour,</p>
          <p>L'association a validé un nouveau projet : <strong>${p.titre}</strong>.</p>
          <p>${p.description.substring(0, 150)}...</p>
          <p><a href="https://acogrami.com/projets/${p.id}">Cliquez ici pour découvrir le projet et laisser un commentaire</a></p>
          <br/><p>Merci pour votre soutien !</p>`
        })
      });
      if (res.ok) {
        alert("Les abonnés ont été notifiés avec succès !");
      } else {
        alert("Erreur lors de l'envoi de la notification.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {projets.map((p) => (
        <div key={p.id} className="bg-zinc-900 rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-white text-lg">{p.titre}</h3>
              <span className={`shrink-0 text-xs rounded-full px-2.5 py-1 font-medium ${
                p.statut === "VALIDE" ? "bg-green-900/30 text-green-400" :
                p.statut === "REJETE" ? "bg-red-900/30 text-red-400" :
                "bg-amber-900/30 text-amber-400"
              }`}>
                {p.statut === "EN_ATTENTE" ? "En attente" : p.statut === "VALIDE" ? "Validé" : "Rejeté"}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-400 whitespace-pre-wrap">{p.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-3">
              <span>Par {p.soumisPar}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(p.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
          
          <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {p.statut === "EN_ATTENTE" && (
                <>
                  <button
                    disabled={loadingId === p.id}
                    onClick={() => handleUpdateStatut(p.id, "VALIDE")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Valider
                  </button>
                  <button
                    disabled={loadingId === p.id}
                    onClick={() => handleUpdateStatut(p.id, "REJETE")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Rejeter
                  </button>
                </>
              )}
              {p.statut === "VALIDE" && (
                <button
                  disabled={loadingId === `notify-${p.id}`}
                  onClick={() => handleNotify(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  🔔 Notifier
                </button>
              )}
            </div>

            <button
              disabled={loadingId === p.id}
              onClick={() => handleDelete(p.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-900/50 disabled:opacity-50 cursor-pointer ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Supprimer
            </button>
          </div>
        </div>
      ))}
      {projets.length === 0 && (
        <div className="col-span-full bg-zinc-900 rounded-2xl border border-white/10 p-8 text-center text-zinc-500">
          Aucun projet soumis.
        </div>
      )}
    </div>
  );
}
