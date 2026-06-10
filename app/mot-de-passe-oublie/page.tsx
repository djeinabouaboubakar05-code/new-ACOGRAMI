"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
      }
    } catch {
      setError("Une erreur est survenue. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="w-full max-w-md">

        <Link
          href="/login"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--foreground)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)"}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>

        <div className="text-center mb-8">
          <div
            className="inline-flex h-16 w-16 items-center justify-center rounded-full mb-4"
            style={{ backgroundColor: "color-mix(in srgb, var(--acogrami-accent) 15%, var(--muted))" }}
          >
            <Mail className="h-8 w-8" style={{ color: "var(--acogrami-accent)" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Mot de passe oublié
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Entrez votre email pour recevoir un nouveau mot de passe temporaire
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {sent ? (
            <div className="text-center space-y-4">
              <div
                className="inline-flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--badge-success-bg)" }}
              >
                <CheckCircle className="h-7 w-7" style={{ color: "var(--badge-success-fg)" }} />
              </div>
              <div>
                <h2 className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>
                  Email envoyé !
                </h2>
                <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>
                  Si cet email est associé à un compte, vous recevrez un nouveau mot de passe temporaire sous peu. Pensez à le modifier après connexion.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--acogrami-green)" }}
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  className="p-4 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "var(--badge-danger-bg)", color: "var(--badge-danger-fg)", border: "1px solid color-mix(in srgb, var(--badge-danger-fg) 20%, transparent)" }}
                >
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
                  <input
                    id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="vous@exemple.com" required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all"
                    style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                  />
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60 cursor-pointer"
                style={{ backgroundColor: "var(--acogrami-accent)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Envoi en cours…
                  </span>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Envoyer le lien
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
