"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Demande {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  statut: string;
  createdAt: string | Date;
}

interface RejectModal {
  open: boolean;
  demandeId: string;
  motif: string;
}

export function ResponsableAdhesionsList({ initialDemandes }: { initialDemandes: Demande[] }) {
  const [demandes, setDemandes] = useState<Demande[]>(initialDemandes);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<RejectModal>({ open: false, demandeId: "", motif: "" });
  const router = useRouter();

  const handleValider = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/adhesions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "VALIDEE" }),
      });
      if (res.ok) {
        setDemandes((prev) => prev.map((d) => (d.id === id ? { ...d, statut: "VALIDEE" } : d)));
        router.refresh();
      } else {
        alert("Une erreur est survenue.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setLoadingId(null);
    }
  };

  const openRejectModal = (id: string) => {
    setRejectModal({ open: true, demandeId: id, motif: "" });
  };

  const confirmReject = async () => {
    const { demandeId, motif } = rejectModal;
    setRejectModal({ open: false, demandeId: "", motif: "" });
    setLoadingId(demandeId);
    try {
      const res = await fetch(`/api/adhesions/${demandeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "REJETEE", motifRejet: motif }),
      });
      if (res.ok) {
        setDemandes((prev) => prev.map((d) => (d.id === demandeId ? { ...d, statut: "REJETEE" } : d)));
        router.refresh();
      } else {
        alert("Une erreur est survenue.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setLoadingId(null);
    }
  };

  const badgeClass = (statut: string) =>
    statut === "VALIDEE" ? "badge-success" : statut === "REJETEE" ? "badge-danger" : "badge-warn";

  return (
    <>
      {/* Modale de rejet */}
      {rejectModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setRejectModal({ open: false, demandeId: "", motif: "" }); }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 shadow-xl animate-fadeSlideIn"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Rejeter la demande</h3>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Ce motif sera envoyé par e-mail au candidat.
                </p>
              </div>
              <button
                onClick={() => setRejectModal({ open: false, demandeId: "", motif: "" })}
                className="p-1 rounded-lg cursor-pointer"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <textarea
              value={rejectModal.motif}
              onChange={(e) => setRejectModal((prev) => ({ ...prev, motif: e.target.value }))}
              placeholder="Ex: Le candidat ne réside pas dans l'un des villages membres d'ACOGRAMI."
              rows={4}
              className="input resize-none w-full mb-5"
              autoFocus
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRejectModal({ open: false, demandeId: "", motif: "" })}
                className="btn-outline text-sm px-4 py-2"
              >
                Annuler
              </button>
              <button
                onClick={confirmReject}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
                style={{ backgroundColor: "#dc2626" }}
              >
                <XCircle className="h-4 w-4" />
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "var(--muted)" }}>
              <tr>
                {["Nom", "Email", "Statut", "Date", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`p-4 font-semibold text-xs uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"}`}
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demandes.map((d) => (
                <tr
                  key={d.id}
                  style={{ borderTop: "1px solid var(--card-border)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <td className="p-4 font-semibold" style={{ color: "var(--card-foreground)" }}>{d.prenom} {d.nom}</td>
                  <td className="p-4" style={{ color: "var(--muted-foreground)" }}>{d.email}</td>
                  <td className="p-4">
                    <span className={`text-xs rounded-full px-2.5 py-1 font-semibold ${badgeClass(d.statut)}`}>
                      {d.statut === "EN_ATTENTE" ? "En attente" : d.statut === "VALIDEE" ? "Validée" : "Rejetée"}
                    </span>
                  </td>
                  <td className="p-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-4 text-right">
                    {d.statut === "EN_ATTENTE" && (
                      <div className="flex justify-end gap-2">
                        {loadingId === d.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--muted-foreground)" }} />
                        ) : (
                          <>
                            <button
                              onClick={() => handleValider(d.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Valider
                            </button>
                            <button
                              onClick={() => openRejectModal(d.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                              style={{ backgroundColor: "var(--badge-danger-bg)", color: "var(--badge-danger-fg)" }}
                            >
                              <XCircle className="h-3.5 w-3.5" /> Rejeter
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {demandes.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Aucune demande pour ce village.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
