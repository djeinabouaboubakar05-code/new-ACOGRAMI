"use client";

import { useState } from "react";
import { Send, User, Mail, Landmark, Search, Clock, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

interface Village { nom: string; slug: string; }
interface ApplicationStatus { id: string; nom: string; prenom: string; village: string; statut: string; createdAt: string; }

const IS = {
  backgroundColor: "var(--input-bg)",
  color: "var(--input-text)",
  border: "1px solid var(--input-border)",
  borderRadius: "var(--radius)",
};

const FOCUS_IN  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "var(--ring)");
const FOCUS_OUT = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "var(--input-border)");

export function AdhesionForm({ villages }: { villages: Village[] }) {
  const [activeTab, setActiveTab]   = useState<"apply" | "track">("apply");
  const [step, setStep]             = useState(1);
  const [formData, setFormData]     = useState({ nom: "", prenom: "", email: "", telephone: "", village: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]   = useState(false);
  const [error, setError]           = useState("");
  const [trackEmail, setTrackEmail] = useState("");
  const [trackingResults, setTrackingResults] = useState<ApplicationStatus[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const set = (k: string, v: string) => { setFormData(f => ({ ...f, [k]: v })); setError(""); };

  /* ---- Navigation étapes ---- */
  const handleNext = () => {
    if (step === 1 && (!formData.nom.trim() || !formData.prenom.trim())) {
      setError("Veuillez renseigner votre nom et prénom."); return;
    }
    if (step === 2 && (!formData.email.trim() || !formData.telephone.trim())) {
      setError("Veuillez renseigner votre email et téléphone."); return;
    }
    setError(""); setStep(s => s + 1);
  };

  /* ---- Soumission ---- */
  const handleSubmit = async () => {
    if (!formData.village) { setError("Veuillez sélectionner votre village."); return; }
    setIsSubmitting(true); setError("");
    try {
      const res = await fetch("/api/adhesions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ nom: "", prenom: "", email: "", telephone: "", village: "", message: "" });
        setStep(1);
      } else {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- Suivi ---- */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSearching(true);
    try {
      const res = await fetch(`/api/adhesions?email=${encodeURIComponent(trackEmail.trim())}`);
      setTrackingResults(res.ok ? await res.json() : []);
    } catch { setTrackingResults([]); }
    finally { setIsSearching(false); }
  };

  return (
    <div className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
      {/* Tabs */}
      <div className="flex mb-8" style={{ borderBottom: "1px solid var(--card-border)" }}>
        {(["apply", "track"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 pb-3 text-center font-bold text-sm cursor-pointer transition-colors"
            style={{
              borderBottom: activeTab === tab ? "2px solid var(--acogrami-green)" : "2px solid transparent",
              color: activeTab === tab ? "var(--acogrami-green)" : "var(--muted-foreground)",
              marginBottom: "-1px",
            }}
          >
            {tab === "apply" ? "Nouvelle Demande" : "Suivre ma Demande"}
          </button>
        ))}
      </div>

      {/* ====== ONGLET DEMANDE ====== */}
      {activeTab === "apply" && (
        <div className="space-y-6">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center flex-1 last:flex-initial">
                <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors"
                  style={{ backgroundColor: step >= s ? "var(--acogrami-green)" : "var(--muted)", color: step >= s ? "#fff" : "var(--muted-foreground)" }}>
                  {s}
                </div>
                {s < 3 && <div className="h-0.5 flex-1 mx-2 transition-colors" style={{ backgroundColor: step > s ? "var(--acogrami-green)" : "var(--card-border)" }} />}
              </div>
            ))}
          </div>

          {/* Succès */}
          {isSuccess && (
            <div className="rounded-xl p-5 text-center space-y-3" style={{ backgroundColor: "var(--badge-success-bg)", border: "1px solid var(--badge-success-fg)" }}>
              <CheckCircle className="h-10 w-10 mx-auto" style={{ color: "var(--badge-success-fg)" }} />
              <h3 className="font-bold" style={{ color: "var(--badge-success-fg)" }}>Demande soumise avec succès !</h3>
              <p className="text-sm" style={{ color: "var(--badge-success-fg)" }}>
                Votre demande a été enregistrée. Le responsable de votre village l&apos;examinera sous peu.
              </p>
              <button onClick={() => setIsSuccess(false)} className="mt-2 text-xs font-semibold underline cursor-pointer"
                style={{ color: "var(--acogrami-green)" }}>
                Soumettre une autre demande
              </button>
            </div>
          )}

          {!isSuccess && (
            <div className="space-y-6">
              {/* Étape 1 — Identité */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-5 w-5" style={{ color: "var(--acogrami-accent)" }} />
                    <h3 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>Identité</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([["prenom", "Prénom", "Djeinabou"], ["nom", "Nom", "Diallo"]] as const).map(([k, l, p]) => (
                      <div key={k}>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                          {l} <span className="text-red-500">*</span>
                        </label>
                        <input type="text" placeholder={p} value={(formData as any)[k]}
                          onChange={e => set(k, e.target.value)}
                          className="w-full px-4 py-3 transition-all" style={IS}
                          onFocus={FOCUS_IN} onBlur={FOCUS_OUT}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Étape 2 — Coordonnées */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5" style={{ color: "var(--acogrami-accent)" }} />
                    <h3 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>Coordonnées</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([["email", "Email", "email", "djeinabou@example.com"], ["telephone", "Téléphone", "tel", "654966095"]] as const).map(([k, l, t, p]) => (
                      <div key={k}>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                          {l} <span className="text-red-500">*</span>
                        </label>
                        <input type={t} placeholder={p} value={(formData as any)[k]}
                          onChange={e => set(k, e.target.value)}
                          className="w-full px-4 py-3 transition-all" style={IS}
                          onFocus={FOCUS_IN} onBlur={FOCUS_OUT}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Étape 3 — Village */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Landmark className="h-5 w-5" style={{ color: "var(--acogrami-accent)" }} />
                    <h3 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>Village d&apos;origine</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                      Village <span className="text-red-500">*</span>
                    </label>
                    <select value={formData.village} onChange={e => set("village", e.target.value)}
                      className="w-full px-4 py-3 transition-all" style={IS}
                      onFocus={FOCUS_IN} onBlur={FOCUS_OUT}
                    >
                      <option value="">Sélectionnez votre village</option>
                      {villages.map(v => <option key={v.slug} value={v.nom}>{v.nom}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                      Motivations <span className="text-xs font-normal" style={{ color: "var(--muted-foreground)" }}>(optionnel)</span>
                    </label>
                    <textarea rows={3} placeholder="Qu'est-ce qui vous motive à adhérer ?"
                      value={formData.message} onChange={e => set("message", e.target.value)}
                      className="w-full px-4 py-3 resize-none transition-all" style={IS}
                      onFocus={FOCUS_IN} onBlur={FOCUS_OUT}
                    />
                  </div>
                </div>
              )}

              {/* Erreur inline */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm animate-fadeSlideIn"
                  style={{ backgroundColor: "var(--badge-danger-bg)", border: "1px solid var(--badge-danger-fg)", color: "var(--badge-danger-fg)" }}>
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4 pt-4" style={{ borderTop: "1px solid var(--card-border)" }}>
                {step > 1 && (
                  <button type="button" onClick={() => { setStep(s => s - 1); setError(""); }}
                    className="flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors"
                    style={{ border: "1px solid var(--card-border)", color: "var(--foreground)", backgroundColor: "var(--muted)" }}>
                    Précédent
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" onClick={handleNext}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-white cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "var(--acogrami-green)" }}>
                    Suivant
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-white cursor-pointer hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity"
                    style={{ backgroundColor: "var(--acogrami-accent)" }}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {isSubmitting ? "Envoi en cours…" : "Soumettre ma demande"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====== ONGLET SUIVI ====== */}
      {activeTab === "track" && (
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
              <input type="email" required placeholder="Votre adresse e-mail d'inscription"
                value={trackEmail} onChange={e => setTrackEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 transition-all" style={IS}
                onFocus={FOCUS_IN} onBlur={FOCUS_OUT}
              />
            </div>
            <button type="submit" disabled={isSearching}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white cursor-pointer hover:opacity-90 disabled:opacity-60 transition-opacity"
              style={{ backgroundColor: "var(--acogrami-green)" }}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rechercher"}
            </button>
          </form>

          {!isSearching && trackingResults && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                Résultats ({trackingResults.length})
              </h4>
              {trackingResults.length === 0 ? (
                <div className="p-8 text-center text-sm rounded-xl"
                  style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--card-border)" }}>
                  Aucune demande trouvée pour cette adresse e-mail.
                </div>
              ) : (
                trackingResults.map(r => (
                  <div key={r.id} className="p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    style={{ backgroundColor: "var(--muted)", border: "1px solid var(--card-border)" }}>
                    <div>
                      <p className="font-bold" style={{ color: "var(--foreground)" }}>{r.prenom} {r.nom}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        Village : <span className="font-semibold">{r.village}</span>
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                        Soumis le : {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {r.statut === "EN_ATTENTE" && (
                        <span className="badge-warn inline-flex items-center gap-1.5 px-3 py-1">
                          <Clock className="h-3 w-3" /> En attente
                        </span>
                      )}
                      {r.statut === "VALIDEE" && (
                        <span className="badge-success inline-flex items-center gap-1.5 px-3 py-1">
                          <CheckCircle className="h-3 w-3" /> Validée
                        </span>
                      )}
                      {r.statut === "REJETEE" && (
                        <span className="badge-danger inline-flex items-center gap-1.5 px-3 py-1">
                          <XCircle className="h-3 w-3" /> Rejetée
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
