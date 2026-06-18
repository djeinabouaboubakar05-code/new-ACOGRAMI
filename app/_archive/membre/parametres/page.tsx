"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { User, Lock, Loader2 } from "lucide-react";

const IS = { backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)", borderRadius: "var(--radius)" };
const IS_RO = { backgroundColor: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--input-border)", borderRadius: "var(--radius)", cursor: "not-allowed" };

export default function ParametresPage() {
  const { data: session, status, update } = useSession();
  const [updating, setUpdating] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-acogrami-green" /></div>;
  }

  const user = session?.user;
  const prenom = user?.name?.split(" ")[0] || "";
  const nom = user?.name?.split(" ").slice(1).join(" ") || "";
  const village = (user as any)?.village || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    const form = e.target as HTMLFormElement;
    const data = {
      type: "profil",
      nom: (form.elements.namedItem("nom") as HTMLInputElement).value,
      prenom: (form.elements.namedItem("prenom") as HTMLInputElement).value,
    };
    try {
      const res = await fetch("/api/membre/profil", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { alert("Profil mis à jour avec succès !"); update(); }
      else { const err = await res.json(); alert(err.error || "Erreur lors de la mise à jour"); }
    } catch { alert("Une erreur est survenue"); }
    finally { setUpdating(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const currentPassword = (form.elements.namedItem("current_password") as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem("new_password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirm_password") as HTMLInputElement).value;

    if (newPassword !== confirmPassword) { alert("Les nouveaux mots de passe ne correspondent pas."); return; }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/membre/profil", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "password", currentPassword, newPassword }) });
      if (res.ok) { alert("Mot de passe mis à jour avec succès !"); form.reset(); }
      else { const err = await res.json(); alert(err.error || "Erreur lors de la mise à jour"); }
    } catch { alert("Une erreur est survenue"); }
    finally { setUpdatingPassword(false); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Profil & Paramètres</h1>
        <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>Modifiez vos informations personnelles.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-sm space-y-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
          <User className="h-5 w-5 text-acogrami-green" />
          Informations personnelles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["nom", "Nom", nom, false], ["prenom", "Prénom", prenom, false], ["email", "Email", user?.email || "", true]].map(([name, label, value, ro]) => (
            <div key={name as string}>
              <label htmlFor={name as string} className="mb-1.5 block text-sm font-medium" style={{ color: "var(--foreground)" }}>{label as string}</label>
              <input id={name as string} name={name as string} type={name === "email" ? "email" : "text"}
                defaultValue={value as string} readOnly={ro as boolean}
                className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
                style={ro ? IS_RO : IS}
                onFocus={!ro ? e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)" : undefined}
                onBlur={!ro ? e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)" : undefined}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--foreground)" }}>Village d&apos;origine</label>
            <input type="text" value={village} readOnly className="w-full rounded-lg px-4 py-2.5" style={IS_RO} />
          </div>
        </div>
        <button type="submit" disabled={updating} className="bg-acogrami-green text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#13382c] transition-colors disabled:opacity-70 cursor-pointer">
          {updating ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="p-6 rounded-2xl shadow-sm space-y-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
          <Lock className="h-5 w-5 text-acogrami-accent" />
          Changer de mot de passe
        </h2>
        {[["current_password", "Mot de passe actuel"], ["new_password", "Nouveau mot de passe"], ["confirm_password", "Confirmer le nouveau mot de passe"]].map(([name, label]) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1.5 block text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</label>
            <input id={name} name={name} type="password" required className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={IS}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
          </div>
        ))}
        <button type="submit" disabled={updatingPassword} className="bg-acogrami-accent text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-acogrami-earth transition-colors disabled:opacity-75 cursor-pointer">
          {updatingPassword ? "Mise à jour..." : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </div>
  );
}
