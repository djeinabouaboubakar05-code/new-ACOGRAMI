"use client";

import { useState } from "react";
import { Search, Trash2, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  village: string | null;
  estValide: boolean;
  createdAt: string | Date;
}

interface DemandeAdhesion {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  village: string;
  statut: string;
  createdAt: string | Date;
}

interface RejectModal {
  open: boolean;
  demandeId: string;
  motif: string;
}

export function UtilisateursAdminList({
  initialUsers,
  initialDemandes,
  currentAdminEmail,
}: {
  initialUsers: User[];
  initialDemandes: DemandeAdhesion[];
  currentAdminEmail?: string;
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [demandes, setDemandes] = useState<DemandeAdhesion[]>(initialDemandes);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [updatingDemandeId, setUpdatingDemandeId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<RejectModal>({ open: false, demandeId: "", motif: "" });
  const router = useRouter();

  const filteredUsers = users.filter((u) => {
    const term = searchQuery.toLowerCase();
    return (
      u.prenom.toLowerCase().includes(term) ||
      u.nom.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.village && u.village.toLowerCase().includes(term))
    );
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch("/api/admin/utilisateurs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        router.refresh();
      } else {
        alert("Erreur lors de la mise à jour du rôle.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleValidation = async (userId: string, currentValide: boolean) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch("/api/admin/utilisateurs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, estValide: !currentValide }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, estValide: !currentValide } : u)));
        router.refresh();
      } else {
        alert("Erreur lors de la validation.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    setUpdatingUserId(userId);
    try {
      const res = await fetch(`/api/admin/utilisateurs?id=${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la suppression.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const openRejectModal = (demandeId: string) => {
    setRejectModal({ open: true, demandeId, motif: "" });
  };

  const confirmReject = async () => {
    const { demandeId, motif } = rejectModal;
    setRejectModal({ open: false, demandeId: "", motif: "" });
    setUpdatingDemandeId(demandeId);
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
        alert("Erreur lors du rejet de la demande.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setUpdatingDemandeId(null);
    }
  };

  const handleValider = async (demandeId: string) => {
    setUpdatingDemandeId(demandeId);
    try {
      const res = await fetch(`/api/adhesions/${demandeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "VALIDEE" }),
      });
      if (res.ok) {
        setDemandes((prev) => prev.map((d) => (d.id === demandeId ? { ...d, statut: "VALIDEE" } : d)));
        router.refresh();
      } else {
        alert("Erreur lors de la validation de la demande.");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setUpdatingDemandeId(null);
    }
  };

  return (
    <div className="space-y-8">
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
                className="p-1 rounded-lg transition-colors cursor-pointer"
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity cursor-pointer"
                style={{ backgroundColor: "#dc2626" }}
              >
                <XCircle className="h-4 w-4" />
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des utilisateurs */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Rechercher un utilisateur (nom, prénom, email, village)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              flex: 1,
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "var(--muted)" }}>
              <tr>
                {["Nom", "Email", "Village", "Rôle", "Statut", "Inscription", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`p-4 font-semibold text-xs uppercase tracking-wider ${i === 6 ? "text-right" : "text-left"}`}
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  style={{ borderTop: "1px solid var(--card-border)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <td className="p-4 font-semibold" style={{ color: "var(--foreground)" }}>{u.prenom} {u.nom}</td>
                  <td className="p-4" style={{ color: "var(--muted-foreground)" }}>{u.email}</td>
                  <td className="p-4" style={{ color: "var(--muted-foreground)" }}>{u.village || "—"}</td>
                  <td className="p-4">
                    {updatingUserId === u.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--muted-foreground)" }} />
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={u.email === currentAdminEmail}
                        className="text-xs px-2 py-1 rounded-lg"
                        style={{
                          backgroundColor: "var(--muted)",
                          color: "var(--foreground)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <option value="MEMBRE">MEMBRE</option>
                        <option value="RESPONSABLE">RESPONSABLE</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleValidation(u.id, u.estValide)}
                      disabled={u.email === currentAdminEmail || updatingUserId === u.id}
                      className="text-xs rounded-full px-2.5 py-1 font-semibold cursor-pointer transition-opacity"
                      style={{
                        backgroundColor: u.estValide ? "var(--badge-success-bg)" : "var(--badge-warn-bg)",
                        color: u.estValide ? "var(--badge-success-fg)" : "var(--badge-warn-fg)",
                      }}
                    >
                      {u.estValide ? "Validé" : "En attente"}
                    </button>
                  </td>
                  <td className="p-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-4 text-right">
                    {u.email !== currentAdminEmail && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={updatingUserId === u.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg cursor-pointer transition-colors"
                        style={{ backgroundColor: "var(--badge-danger-bg)", color: "var(--badge-danger-fg)" }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demandes d'adhésion */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="p-5" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <h2 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
            Demandes d&apos;adhésion ({demandes.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "var(--muted)" }}>
              <tr>
                {["Nom", "Email", "Village", "Statut", "Date", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`p-4 font-semibold text-xs uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
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
                  <td className="p-4 font-semibold" style={{ color: "var(--foreground)" }}>{d.prenom} {d.nom}</td>
                  <td className="p-4" style={{ color: "var(--muted-foreground)" }}>{d.email}</td>
                  <td className="p-4" style={{ color: "var(--muted-foreground)" }}>{d.village}</td>
                  <td className="p-4">
                    <span
                      className="text-xs rounded-full px-2.5 py-1 font-semibold"
                      style={{
                        backgroundColor:
                          d.statut === "VALIDEE" ? "var(--badge-success-bg)"
                          : d.statut === "REJETEE" ? "var(--badge-danger-bg)"
                          : "var(--badge-warn-bg)",
                        color:
                          d.statut === "VALIDEE" ? "var(--badge-success-fg)"
                          : d.statut === "REJETEE" ? "var(--badge-danger-fg)"
                          : "var(--badge-warn-fg)",
                      }}
                    >
                      {d.statut === "EN_ATTENTE" ? "En attente" : d.statut === "VALIDEE" ? "Validée" : "Rejetée"}
                    </span>
                  </td>
                  <td className="p-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-4 text-right">
                    {d.statut === "EN_ATTENTE" && (
                      <div className="flex justify-end gap-2">
                        {updatingDemandeId === d.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--muted-foreground)" }} />
                        ) : (
                          <>
                            <button
                              onClick={() => handleValider(d.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            >
                              <CheckCircle className="h-3.5 w-3.5" /> Valider
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
                  <td colSpan={6} className="p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Aucune demande d&apos;adhésion.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
