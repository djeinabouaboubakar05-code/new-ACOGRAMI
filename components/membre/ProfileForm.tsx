"use client";

import { useState } from "react";
import { Loader2, Save, User, Lock } from "lucide-react";

export function ProfileForm({ user }: { user: any }) {
  const [nom, setNom] = useState(user.nom || "");
  const [prenom, setPrenom] = useState(user.prenom || "");
  const [email, setEmail] = useState(user.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Votre profil a été mis à jour avec succès.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-acogrami-green/10 rounded-xl text-acogrami-green">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Informations personnelles</h2>
            <p className="text-sm text-muted-foreground">Mettez à jour vos informations de base</p>
          </div>
        </div>

        <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nom</label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Prénom</label>
              <input
                type="text"
                required
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Adresse e-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
            />
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-acogrami-accent/10 rounded-xl text-acogrami-accent">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Sécurité</h2>
            <p className="text-sm text-muted-foreground">Modifiez votre mot de passe</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
              placeholder="Requis pour changer de mot de passe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
              placeholder="Laisser vide pour ne pas modifier"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg bg-input border border-border px-4 py-2.5 text-foreground focus:ring-2 focus:ring-ring outline-none"
            />
          </div>
        </div>

        <button
          form="profile-form"
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-acogrami-green hover:bg-[#13382c] text-white rounded-lg px-6 py-3 font-bold transition-colors disabled:opacity-50 mt-6 cursor-pointer"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Enregistrer les modifications
        </button>

        {message && <div className="badge-success p-3 rounded-lg text-sm font-medium mt-4 text-center">{message}</div>}
        {error && <div className="badge-danger p-3 rounded-lg text-sm font-medium mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
}
