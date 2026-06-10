"use client";

import { useState } from "react";
import { Calendar, Plus, Trash2, X, Loader2, MapPin, CheckCircle, XCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Evenement {
  id: string;
  titre: string;
  description: string;
  date: string | Date;
  lieu: string;
  statut: string;
  createdAt: string | Date;
  nbInscrits?: number;
}

const IS = { backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)", borderRadius: "var(--radius)" };

export function EvenementsAdminList({ initialEvenements }: { initialEvenements: Evenement[] }) {
  const [evenements, setEvenements] = useState<Evenement[]>(initialEvenements);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [lieu, setLieu] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre || !description || !date || !lieu) { alert("Veuillez remplir tous les champs."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/evenements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titre, description, date, lieu, statut: "VALIDE" }) });
      if (res.ok) {
        const newEv = await res.json();
        setEvenements(prev => [newEv, ...prev]);
        setShowModal(false); setTitre(""); setDescription(""); setDate(""); setLieu("");
        router.refresh();
      } else { alert((await res.json()).error || "Une erreur est survenue."); }
    } catch { alert("Impossible de créer l'événement."); }
    finally { setLoading(false); }
  };

  const handleUpdateStatut = async (id: string, statut: "VALIDE" | "REJETE") => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/evenements", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, statut }) });
      if (res.ok) { setEvenements(prev => prev.map(e => e.id === id ? { ...e, statut } : e)); router.refresh(); }
      else alert("Erreur lors de la mise à jour du statut");
    } catch { alert("Une erreur est survenue"); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet événement ?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/evenements?id=${id}`, { method: "DELETE" });
      if (res.ok) { setEvenements(prev => prev.filter(ev => ev.id !== id)); router.refresh(); }
      else alert("Erreur lors de la suppression.");
    } catch { alert("Une erreur est survenue."); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "var(--foreground)" }}>
            <Calendar className="h-7 w-7 text-acogrami-accent" />
            Événements
          </h1>
          <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>
            {evenements.length} événement{evenements.length > 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-acogrami-green text-white rounded-xl text-sm font-semibold hover:bg-[#13382c] transition-colors cursor-pointer">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "var(--muted)" }}>
              <tr>
                {["Titre", "Date / Lieu", "Inscrits", "Statut", "Créé le", "Actions"].map((h, i) => (
                  <th key={h} className={`p-4 font-medium ${i === 5 ? "text-right" : "text-left"}`} style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {evenements.map(e => (
                <tr key={e.id} className="transition-colors"
                  onMouseEnter={el => (el.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"}
                  onMouseLeave={el => (el.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                  style={{ borderTop: "1px solid var(--card-border)" }}>
                  <td className="p-4">
                    <p className="font-semibold" style={{ color: "var(--card-foreground)" }}>{e.titre}</p>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--muted-foreground)" }}>{e.description}</p>
                  </td>
                  <td className="p-4">
                    <div className="font-medium" style={{ color: "var(--foreground)" }}>
                      {new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <MapPin className="h-3 w-3 text-acogrami-accent shrink-0" />
                      <span>{e.lieu}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
                      <Users className="h-4 w-4" /> {e.nbInscrits ?? 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${e.statut === "VALIDE" ? "badge-success" : e.statut === "REJETE" ? "badge-danger" : "badge-warn"}`}>
                      {e.statut === "EN_ATTENTE" ? "En attente" : e.statut === "VALIDE" ? "Validé" : "Rejeté"}
                    </span>
                  </td>
                  <td className="p-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(e.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {e.statut === "EN_ATTENTE" && (
                        <>
                          <button disabled={updatingId === e.id} onClick={() => handleUpdateStatut(e.id, "VALIDE")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50">
                            {updatingId === e.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                            Valider
                          </button>
                          <button disabled={updatingId === e.id} onClick={() => handleUpdateStatut(e.id, "REJETE")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50"
                            style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--card-border)" }}>
                            <XCircle className="h-3.5 w-3.5" /> Rejeter
                          </button>
                        </>
                      )}
                      <button disabled={deletingId === e.id} onClick={() => handleDelete(e.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 cursor-pointer disabled:opacity-50 transition-colors"
                        onMouseEnter={el => (el.currentTarget as HTMLElement).style.backgroundColor = "color-mix(in srgb, #ef4444 10%, transparent)"}
                        onMouseLeave={el => (el.currentTarget as HTMLElement).style.backgroundColor = "transparent"}>
                        {deletingId === e.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {evenements.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center" style={{ color: "var(--muted-foreground)" }}>Aucun événement enregistré.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="rounded-2xl w-full max-w-lg p-6 shadow-2xl relative" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 cursor-pointer" style={{ color: "var(--muted-foreground)" }}>
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
              <Calendar className="h-5 w-5 text-acogrami-accent" /> Créer un nouvel événement
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[["titre", "Titre", "text", "Ex: Réunion de rentrée", titre, setTitre], ["lieu", "Lieu", "text", "Ex: Foyer Mifi", lieu, setLieu]].map(([key, label, type, ph, val, setter]: any) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>{label}</label>
                  <input type={type} value={val} onChange={e => setter(e.target.value)} placeholder={ph}
                    className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={IS}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Détails de l'événement..."
                  className="w-full rounded-xl px-4 py-2.5 resize-none focus:outline-none" style={IS}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={IS}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
              </div>
              <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid var(--card-border)" }}>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--card-border)" }}>
                  Annuler
                </button>
                <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-acogrami-green text-white rounded-xl text-sm font-semibold hover:bg-[#13382c] disabled:opacity-50 cursor-pointer">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Création..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
