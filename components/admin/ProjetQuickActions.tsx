"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Projet {
  id: string;
  titre: string;
  soumisPar: string;
}

export function ProjetQuickActions({ initialProjets }: { initialProjets: Projet[] }) {
  const [projets, setProjets] = useState<Projet[]>(initialProjets);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (id: string, statut: "VALIDE" | "REJETE") => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/projets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, statut }),
      });

      if (res.ok) {
        // Enlever le projet de la liste locale
        setProjets((prev) => prev.filter((p) => p.id !== id));
        // Rafraîchir les stats du serveur en arrière-plan
        router.refresh();
      } else {
        alert("Une erreur est survenue lors de la mise à jour.");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setLoadingId(null);
    }
  };

  if (projets.length === 0) {
    return <p className="p-5 text-sm text-zinc-500">Aucun projet en attente.</p>;
  }

  return (
    <div className="divide-y divide-white/5">
      {projets.map((p) => (
        <div key={p.id} className="flex items-center justify-between p-4 gap-3">
          <div>
            <p className="font-medium text-white text-sm">{p.titre}</p>
            <p className="text-xs text-zinc-400">par {p.soumisPar}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {loadingId === p.id ? (
              <Loader2 className="h-5 w-5 animate-spin text-acogrami-accent" />
            ) : (
              <>
                <button
                  onClick={() => handleAction(p.id, "VALIDE")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-900/40 text-green-400 text-xs rounded-lg hover:bg-green-900/60 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />Valider
                </button>
                <button
                  onClick={() => handleAction(p.id, "REJETE")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-900/40 text-red-400 text-xs rounded-lg hover:bg-red-900/60 cursor-pointer"
                >
                  <XCircle className="h-3.5 w-3.5" />Rejeter
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
