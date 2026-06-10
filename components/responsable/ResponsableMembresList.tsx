"use client";

import { useState } from "react";
import { Trash2, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface Membre { id: string; prenom: string; nom: string; email: string; village: string | null; createdAt: string | Date; }

export function ResponsableMembresList({ initialMembres }: { initialMembres: Membre[] }) {
  const [membres, setMembres] = useState<Membre[]>(initialMembres);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce membre ?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/responsable/membres?id=${id}`, { method: "DELETE" });
      if (res.ok) { setMembres(prev => prev.filter(m => m.id !== id)); router.refresh(); }
      else { const d = await res.json(); alert(d.error || "Une erreur est survenue."); }
    } catch { alert("Une erreur est survenue."); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "var(--muted)" }}>
            <tr>
              {["Nom", "Email", "Village", "Inscrit le", "Actions"].map((h, i) => (
                <th key={h} className={`p-4 font-semibold text-xs uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"}`} style={{ color: "var(--muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {membres.map(m => (
              <tr key={m.id} style={{ borderTop: "1px solid var(--card-border)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
              >
                <td className="p-4 font-semibold" style={{ color: "var(--card-foreground)" }}>{m.prenom} {m.nom}</td>
                <td className="p-4" style={{ color: "var(--muted-foreground)" }}>{m.email}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <MapPin className="h-3 w-3" />{m.village}
                  </span>
                </td>
                <td className="p-4 text-sm" style={{ color: "var(--muted-foreground)" }}>{new Date(m.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(m.id)} disabled={deletingId === m.id}
                    className="p-2 rounded-xl cursor-pointer transition-colors" style={{ color: "#ef4444" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                  >
                    {deletingId === m.id ? <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--muted-foreground)" }} /> : <Trash2 className="h-4 w-4" />}
                  </button>
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
