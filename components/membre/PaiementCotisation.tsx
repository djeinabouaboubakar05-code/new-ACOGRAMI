"use client";

import { useState, useEffect } from "react";
import { Loader2, CreditCard, Info } from "lucide-react";

export function PaiementCotisation({ userId }: { userId: string }) {
  const [montantAttendu, setMontantAttendu] = useState(5000);
  const [montant, setMontant] = useState("");
  const [reference, setReference] = useState("");
  const [annee, setAnnee] = useState(new Date().getFullYear().toString());
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch global cotisation config
    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.cotisationAnnuelle) {
          setMontantAttendu(data.cotisationAnnuelle);
          setMontant(data.cotisationAnnuelle.toString());
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/cotisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          montant,
          annee,
          ref: reference,
          userId,
          statut: "EN_ATTENTE" // Admin doit valider
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Votre déclaration a été soumise. L'administration va la vérifier.");
        setMontant(montantAttendu.toString());
        setReference("");
      } else {
        // Handle unique constraint error on reference
        if (data.error && data.error.includes("Unique constraint failed")) {
          setError("Cette référence de transaction a déjà été utilisée.");
        } else {
          setError(data.error || "Une erreur est survenue.");
        }
      }
    } catch {
      setError("Erreur de connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-acogrami-green/10 rounded-xl text-acogrami-green">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Payer ma cotisation</h2>
          <p className="text-sm text-muted-foreground">Cotisation annuelle fixée à {montantAttendu} FCFA</p>
        </div>
      </div>

      <div className="bg-muted rounded-xl p-4 flex gap-3 text-sm text-muted-foreground mb-6">
        <Info className="h-5 w-5 shrink-0 text-acogrami-accent" />
        <p>
          Veuillez effectuer votre paiement vers le numéro de l'association <strong>(+237 600 000 000)</strong>, 
          puis renseignez la référence de la transaction ci-dessous.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Année de cotisation</label>
            <input
              type="text"
              required
              value={annee}
              onChange={(e) => setAnnee(e.target.value)}
              className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Montant payé (FCFA)</label>
            <input
              type="number"
              required
              min={montantAttendu}
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Référence de transaction</label>
          <input
            type="text"
            required
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none font-mono"
            placeholder="Ex: TXN123456789"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-acogrami-green hover:bg-[#13382c] text-white rounded-lg px-6 py-3 font-bold transition-colors disabled:opacity-50 mt-2 cursor-pointer"
        >
          {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
          Soumettre la déclaration
        </button>

        {message && <div className="badge-success p-3 rounded-lg text-sm font-medium mt-4 text-center">{message}</div>}
        {error && <div className="badge-danger p-3 rounded-lg text-sm font-medium mt-4 text-center">{error}</div>}
      </form>
    </div>
  );
}
