"use client";

import { useState, useEffect } from "react";
import { Settings, Loader2, Save } from "lucide-react";

export function ConfigurationAdmin() {
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/config");
      if (res.ok) {
        const data = await res.json();
        setMontant(data.cotisationAnnuelle.toString());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cotisationAnnuelle: parseInt(montant) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || "Erreur de sauvegarde.");
      }
    } catch {
      setMessage("Erreur de sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-acogrami-accent/10 rounded-xl text-acogrami-accent">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Configuration Globale</h2>
          <p className="text-sm text-muted-foreground">Paramètres de l'association</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Montant de la cotisation annuelle (FCFA)
          </label>
          <input
            type="number"
            required
            min="0"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-acogrami-green hover:bg-[#13382c] text-white rounded-lg px-6 py-2.5 font-semibold transition-colors disabled:opacity-50 cursor-pointer w-full sm:w-auto"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer les modifications
        </button>
        {message && (
          <p className="text-sm mt-2 text-green-500 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}
