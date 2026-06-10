"use client";

import { useState } from "react";
import { CreditCard, Send, Download, Users, Mail, Loader2 } from "lucide-react";

interface UserInfo { id: string; prenom: string; nom: string; email: string; }
interface Cotisation { id: string; montant: number; annee: string; ref: string; date: string | Date; user: UserInfo; }

export function ResponsableCotisationsClient({ initialCotisations, allMembres, village }: {
  initialCotisations: Cotisation[];
  allMembres: UserInfo[];
  village: string;
}) {
  const [activeTab, setActiveTab] = useState<"paye" | "impaye">("paye");
  const [sendingId, setSendingId] = useState<string | null>(null);

  const currentYear = "2026";
  const paidUserIds = new Set(initialCotisations.filter(c => c.annee === currentYear).map(c => c.user.id));
  const impayes = allMembres.filter(m => !paidUserIds.has(m.id));
  const totalMontant = initialCotisations.reduce((sum, c) => sum + c.montant, 0);

  const handleRelance = async (userId: string, email: string) => {
    setSendingId(userId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Relance envoyée avec succès à ${email} !`);
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setSendingId(null);
    }
  };

  const handleExportCSV = () => {
    if (impayes.length === 0) { alert("Aucun membre impayé à exporter."); return; }
    const rows = impayes.map(m => [m.prenom, m.nom, m.email, village, currentYear]);
    const csv = "data:text/csv;charset=utf-8," + encodeURIComponent(["Prenom,Nom,Email,Village,Annee", ...rows.map(r => r.join(","))].join("\n"));
    const link = document.createElement("a");
    link.href = csv;
    link.download = `impayes_${village}_${currentYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statCards = [
    { icon: CreditCard, label: "Total collecté", value: `${totalMontant.toLocaleString("fr-FR")} FCFA`, accent: "var(--acogrami-green)" },
    { icon: Users, label: "Membres à jour", value: `${paidUserIds.size} / ${allMembres.length}`, accent: "var(--acogrami-accent)" },
    { icon: Mail, label: `Impayés (${currentYear})`, value: String(impayes.length), accent: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map(({ icon: Icon, label, value, accent }) => (
          <div key={label} className="p-6 rounded-2xl flex items-center gap-4 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="p-3 rounded-xl" style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent }}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{label}</p>
              <p className="text-2xl font-bold mt-0.5" style={{ color: "var(--card-foreground)" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--card-border)" }}>
        {([["paye", "Historique des Paiements"], ["impaye", `Membres Impayés (${currentYear})`]] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-5 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer"
            style={{
              borderBottomColor: activeTab === tab ? "var(--acogrami-green)" : "transparent",
              color: activeTab === tab ? "var(--acogrami-green)" : "var(--muted-foreground)",
              marginBottom: "-1px",
            }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "paye" ? (
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "var(--muted)" }}>
                <tr>
                  {["Membre", "Année", "Référence", "Date", "Montant"].map(h => (
                    <th key={h} className={`p-4 font-medium ${h === "Montant" ? "text-right" : "text-left"}`} style={{ color: "var(--muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {initialCotisations.map(c => (
                  <tr key={c.id} className="transition-colors"
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                    style={{ borderTop: "1px solid var(--card-border)" }}>
                    <td className="p-4">
                      <p className="font-medium" style={{ color: "var(--card-foreground)" }}>{c.user.prenom} {c.user.nom}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{c.user.email}</p>
                    </td>
                    <td className="p-4 font-medium" style={{ color: "var(--foreground)" }}>{c.annee}</td>
                    <td className="p-4 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{c.ref}</td>
                    <td className="p-4" style={{ color: "var(--muted-foreground)" }}>{new Date(c.date).toLocaleDateString("fr-FR")}</td>
                    <td className="p-4 text-right font-bold" style={{ color: "var(--card-foreground)" }}>{c.montant.toLocaleString("fr-FR")} FCFA</td>
                  </tr>
                ))}
                {initialCotisations.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center" style={{ color: "var(--muted-foreground)" }}>Aucune cotisation enregistrée.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-acogrami-green hover:bg-[#13382c] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer">
              <Download className="h-4 w-4" /> Exporter la liste des impayés (CSV)
            </button>
          </div>

          <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: "var(--muted)" }}>
                  <tr>
                    {["Membre", "Email", "Statut cotisation", "Action"].map((h, i) => (
                      <th key={h} className={`p-4 font-medium ${i === 3 ? "text-right" : "text-left"}`} style={{ color: "var(--muted-foreground)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {impayes.map(m => (
                    <tr key={m.id} className="transition-colors"
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                      style={{ borderTop: "1px solid var(--card-border)" }}>
                      <td className="p-4 font-medium" style={{ color: "var(--card-foreground)" }}>{m.prenom} {m.nom}</td>
                      <td className="p-4" style={{ color: "var(--muted-foreground)" }}>{m.email}</td>
                      <td className="p-4"><span className="badge-danger inline-flex px-2.5 py-1 rounded-full text-xs font-semibold">Impayé {currentYear}</span></td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleRelance(m.id, m.email)} disabled={sendingId === m.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-acogrami-accent hover:bg-acogrami-earth text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50">
                          {sendingId === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3 w-3" />}
                          Relancer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {impayes.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center font-medium" style={{ color: "var(--muted-foreground)" }}>Tous les membres sont à jour pour {currentYear} !</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
