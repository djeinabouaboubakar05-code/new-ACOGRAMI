"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LogIn, Lock, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Email ou mot de passe incorrect. Vérifiez vos informations.");
      setLoading(false);
    } else {
      const sessRes = await fetch("/api/auth/session");
      const session = sessRes.ok ? await sessRes.json() : {};
      const role = session?.user?.role;
      router.push(role === "ADMIN" ? "/dashboard/admin" : role === "RESPONSABLE" ? "/dashboard/responsable" : "/dashboard/membre");
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="w-full max-w-md">

        {/* Retour accueil */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--foreground)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)"}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>

        {/* Logo + Titre */}
        <div className="text-center mb-8">
          <div
            className="inline-flex h-16 w-16 items-center justify-center rounded-full font-extrabold text-xl text-white mb-4"
            style={{ backgroundColor: "var(--acogrami-green)" }}
          >
            AC
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Connexion à ACOGRAMI
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Accédez à votre espace personnel
          </p>
        </div>

        {/* Formulaire */}
        <div
          className="rounded-2xl p-8 space-y-5"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {error && (
            <div
              className="p-4 rounded-xl text-sm font-medium"
              style={{
                backgroundColor: "var(--badge-danger-bg)",
                color: "var(--badge-danger-fg)",
                border: "1px solid color-mix(in srgb, var(--badge-danger-fg) 20%, transparent)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    color: "var(--input-text)",
                    border: "1px solid var(--input-border)",
                  }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Mot de passe
                </label>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-xs font-medium transition-colors"
                  style={{ color: "var(--acogrami-green)" }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm transition-all"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    color: "var(--input-text)",
                    border: "1px solid var(--input-border)",
                  }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60 cursor-pointer"
              style={{ backgroundColor: "var(--acogrami-green)" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Connexion en cours…
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Footer formulaire */}
          <div
            className="pt-4 text-center text-sm border-t"
            style={{ borderColor: "var(--card-border)", color: "var(--muted-foreground)" }}
          >
            Pas encore membre ?{" "}
            <Link
              href="/adhesion"
              className="font-semibold transition-colors"
              style={{ color: "var(--acogrami-green)" }}
            >
              Adhérer à ACOGRAMI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
