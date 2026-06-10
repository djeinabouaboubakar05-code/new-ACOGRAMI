"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, CheckCircle, Loader2, LogIn } from "lucide-react";
import Link from "next/link";

interface Evenement {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  image: string | null;
  nbInscrits: number;
  isInscrit: boolean;
}

export function EvenementsClient({ evenements: initial, isLoggedIn }: { evenements: Evenement[]; isLoggedIn: boolean }) {
  const [evenements, setEvenements] = useState(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleInscription = async (ev: Evenement) => {
    setLoadingId(ev.id);
    try {
      if (ev.isInscrit) {
        const res = await fetch(`/api/evenements/inscription?evenementId=${ev.id}`, { method: "DELETE" });
        if (res.ok) {
          setEvenements(prev => prev.map(e => e.id === ev.id ? { ...e, isInscrit: false, nbInscrits: e.nbInscrits - 1 } : e));
        } else {
          const data = await res.json();
          alert(data.error || "Une erreur est survenue.");
        }
      } else {
        const res = await fetch("/api/evenements/inscription", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ evenementId: ev.id }) });
        if (res.ok) {
          setEvenements(prev => prev.map(e => e.id === ev.id ? { ...e, isInscrit: true, nbInscrits: e.nbInscrits + 1 } : e));
        } else {
          const data = await res.json();
          alert(data.error || "Une erreur est survenue.");
        }
      }
    } catch {
      alert("Erreur de connexion.");
    } finally {
      setLoadingId(null);
    }
  };

  const isPast = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div style={{ backgroundColor: "var(--background)" }}>
      {/* Hero */}
      <div className="py-16 text-center" style={{ backgroundColor: "var(--acogrami-green)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl mb-5 mx-auto" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Événements</h1>
          <p className="text-white/80 text-lg">Les prochains événements de la communauté ACOGRAMI</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        {evenements.length === 0 && (
          <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <Calendar className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-lg font-semibold" style={{ color: "var(--muted-foreground)" }}>Aucun événement à venir pour le moment.</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Revenez bientôt pour découvrir nos prochains événements.</p>
          </div>
        )}

        {evenements.map(ev => {
          const past = isPast(ev.date);
          return (
            <div key={ev.id} className="rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)", opacity: past ? 0.7 : 1 }}>
              {ev.image ? (
                <img src={ev.image} alt={ev.titre} className="w-full md:w-56 h-52 md:h-auto object-cover shrink-0" />
              ) : (
                <div className="w-full md:w-56 h-52 md:h-auto shrink-0 flex flex-col items-center justify-center" style={{ backgroundColor: "var(--acogrami-green)" }}>
                  <Calendar className="h-10 w-10 text-white/60 mb-2" />
                  <div className="text-center text-white">
                    <p className="text-3xl font-black">{new Date(ev.date).toLocaleDateString("fr-FR", { day: "2-digit" })}</p>
                    <p className="text-sm font-semibold uppercase">{new Date(ev.date).toLocaleDateString("fr-FR", { month: "short" })}</p>
                    <p className="text-xs opacity-70">{new Date(ev.date).getFullYear()}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col justify-between p-6 flex-1">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-xl font-bold" style={{ color: "var(--card-foreground)" }}>{ev.titre}</h2>
                    {past && <span className="shrink-0 badge-muted text-xs px-2 py-0.5 rounded-full font-semibold">Passé</span>}
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: "var(--muted-foreground)" }}>{ev.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" style={{ color: "var(--acogrami-green)" }} />
                      {new Date(ev.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" style={{ color: "var(--acogrami-accent)" }} />
                      {ev.lieu}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {ev.nbInscrits} inscrit{ev.nbInscrits !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="pt-3 flex items-center gap-3" style={{ borderTop: "1px solid var(--card-border)" }}>
                    {!past && (
                      isLoggedIn ? (
                        <button
                          onClick={() => handleInscription(ev)}
                          disabled={loadingId === ev.id}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all disabled:opacity-50`}
                          style={ev.isInscrit
                            ? { backgroundColor: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--card-border)" }
                            : { backgroundColor: "var(--acogrami-green)", color: "#fff" }
                          }
                        >
                          {loadingId === ev.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : ev.isInscrit ? (
                            <><CheckCircle className="h-4 w-4 text-green-500" /> Inscrit — Se désinscrire</>
                          ) : (
                            <><Calendar className="h-4 w-4" /> S&apos;inscrire à l&apos;événement</>
                          )}
                        </button>
                      ) : (
                        <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--card-border)" }}>
                          <LogIn className="h-4 w-4" /> Connectez-vous pour vous inscrire
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
