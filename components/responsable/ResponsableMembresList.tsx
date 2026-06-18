"use client";

import { useState } from "react";
import { Trash2, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import { Shield, ShieldOff, UserX, UserMinus, UserCheck } from "lucide-react";

interface Membre { 
  id: string; 
  prenom: string; 
  nom: string; 
  email: string; 
  villageId: string | null; 
  statut: string;
  estDelegue: boolean;
  role: string;
  createdAt: string | Date; 
}

export function ResponsableMembresList({ initialMembres }: { initialMembres: Membre[] }) {
  const [membres, setMembres] = useState<Membre[]>(initialMembres);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (id: string, actionType: "toggle_delegue" | "suspend" | "depart" | "reintegrer") => {
    // If it's toggle_delegue and they want to make them delegate, check max delegates
    if (actionType === "toggle_delegue") {
      const isCurrentlyDelegue = membres.find(m => m.id === id)?.estDelegue;
      const currentDelegueCount = membres.filter(m => m.estDelegue).length;
      if (!isCurrentlyDelegue && currentDelegueCount >= 5) {
        alert("Vous avez déjà atteint le nombre maximum de 5 délégués pour votre village.");
        return;
      }
    } else {
      if (!confirm("Voulez-vous vraiment changer le statut de ce membre ?")) return;
    }

    setLoadingId(id);
    try {
      const res = await fetch(`/api/responsable/membres/action`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, action: actionType }),
      });
      if (res.ok) { 
        router.refresh(); 
        // We could manually update local state, but router.refresh() will re-fetch Server Components
        // Let's also update local state just to be snappy
        setMembres(prev => prev.map(m => {
          if (m.id !== id) return m;
          if (actionType === "toggle_delegue") return { ...m, estDelegue: !m.estDelegue };
          if (actionType === "suspend") return { ...m, statut: "SUSPENDU", estDelegue: false };
          if (actionType === "depart") return { ...m, statut: "PARTI", estDelegue: false };
          if (actionType === "reintegrer") return { ...m, statut: "ACTIF" };
          return m;
        }));
      }
      else { const d = await res.json(); alert(d.error || "Une erreur est survenue."); }
    } catch { alert("Une erreur est survenue."); }
    finally { setLoadingId(null); }
  };

  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "var(--muted)" }}>
            <tr>
              {["Nom", "Email", "Rôle & Statut", "Inscrit le", "Actions"].map((h, i) => (
                <th key={h} className={`p-4 font-semibold text-xs uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"}`} style={{ color: "var(--muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {membres.map(m => (
              <tr key={m.id} style={{ borderTop: "1px solid var(--card-border)", opacity: m.statut === "PARTI" ? 0.6 : 1 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
              >
                <td className="p-4 font-semibold" style={{ color: "var(--card-foreground)" }}>{m.prenom} {m.nom}</td>
                <td className="p-4" style={{ color: "var(--muted-foreground)" }}>{m.email}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {m.role === "RESPONSABLE" ? (
                      <span className="text-xs font-bold text-amber-500">Chef de village</span>
                    ) : m.estDelegue ? (
                      <span className="text-xs font-bold text-blue-500">Délégué</span>
                    ) : (
                      <span className="text-xs text-zinc-500">Membre</span>
                    )}

                    {m.statut === "ACTIF" && <span className="text-[10px] text-green-500 flex items-center gap-1"><UserCheck className="w-3 h-3"/> Actif</span>}
                    {m.statut === "SUSPENDU" && <span className="text-[10px] text-amber-500 flex items-center gap-1"><UserX className="w-3 h-3"/> Suspendu</span>}
                    {m.statut === "PARTI" && <span className="text-[10px] text-red-500 flex items-center gap-1"><UserMinus className="w-3 h-3"/> Parti</span>}
                  </div>
                </td>
                <td className="p-4 text-sm" style={{ color: "var(--muted-foreground)" }}>{new Date(m.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="p-4 text-right flex justify-end gap-2 items-center">
                  
                  {m.role !== "RESPONSABLE" && m.statut === "ACTIF" && (
                    <button onClick={() => handleAction(m.id, "toggle_delegue")} disabled={loadingId === m.id}
                      className="p-2 rounded-xl cursor-pointer transition-colors" title={m.estDelegue ? "Retirer Délégué" : "Nommer Délégué"} style={{ color: "#3b82f6" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(59,130,246,0.08)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                    >
                      {loadingId === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : m.estDelegue ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                    </button>
                  )}

                  {m.role !== "RESPONSABLE" && m.statut === "ACTIF" && (
                     <button onClick={() => handleAction(m.id, "suspend")} disabled={loadingId === m.id}
                      className="p-2 rounded-xl cursor-pointer transition-colors" title="Suspendre (Départ temporaire)" style={{ color: "#f59e0b" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(245,158,11,0.08)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  )}

                  {m.role !== "RESPONSABLE" && (m.statut === "ACTIF" || m.statut === "SUSPENDU") && (
                     <button onClick={() => handleAction(m.id, "depart")} disabled={loadingId === m.id}
                      className="p-2 rounded-xl cursor-pointer transition-colors" title="Déclarer Départ définitif" style={{ color: "#ef4444" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}

                  {m.statut === "SUSPENDU" && (
                    <button onClick={() => handleAction(m.id, "reintegrer")} disabled={loadingId === m.id}
                      className="p-2 rounded-xl cursor-pointer transition-colors" title="Réintégrer (Paiement 5000 FCFA requis en principe)" style={{ color: "#10b981" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(16,185,129,0.08)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                    >
                      <UserCheck className="h-4 w-4" />
                    </button>
                  )}
                  
                </td>
              </tr>
            ))}
            {membres.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>Aucun membre pour ce village.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
