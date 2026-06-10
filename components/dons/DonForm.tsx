"use client";

import { useState } from "react";
import { Loader2, Heart, Info } from "lucide-react";

export function DonForm() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [montant, setMontant] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/dons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, montant, reference }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        setNom("");
        setEmail("");
        setMontant("");
        setReference("");
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur de connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted rounded-xl p-4 flex gap-3 text-sm text-muted-foreground mb-6">
        <Info className="h-5 w-5 shrink-0 text-acogrami-accent" />
        <p>
          Pour faire un don, veuillez effectuer un transfert (Orange Money, MTN Mobile Money, ou virement bancaire)
          vers le compte de l'association <strong>(+237 600 000 000)</strong>, puis renseignez ici la référence de la transaction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet</label>
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
            placeholder="Ex: Jean Dupont"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Adresse e-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
            placeholder="jean@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Montant envoyé (FCFA)</label>
          <input
            type="number"
            required
            min="100"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
            placeholder="Ex: 10000"
          />
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
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-acogrami-accent hover:bg-acogrami-earth text-white rounded-lg px-6 py-3.5 font-bold transition-colors disabled:opacity-50 mt-4 cursor-pointer"
      >
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5" />}
        Déclarer mon don
      </button>

      {message && <div className="badge-success p-4 rounded-lg text-center font-medium">{message}</div>}
      {error && <div className="badge-danger p-4 rounded-lg text-center font-medium">{error}</div>}
    </form>
  );
}
