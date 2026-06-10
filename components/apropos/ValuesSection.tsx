"use client";

import { useState } from "react";
import { Heart, X } from "lucide-react";

interface Valeur { id: string; titre: string; resume: string; description: string; icone: string | null; ordre: number; }

export function ValuesSection({ valeurs }: { valeurs: Valeur[] }) {
  const [selected, setSelected] = useState<Valeur | null>(null);
  if (valeurs.length === 0) return null;

  return (
    <section className="py-16" style={{ borderBottom: "1px solid var(--card-border)" }}>
      <div className="text-center mb-12">
        <span className="text-sm font-bold tracking-widest uppercase mb-2 block" style={{ color: "var(--acogrami-accent)" }}>CE QUI NOUS GUIDE</span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Nos valeurs</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {valeurs.map(valeur => (
          <button
            key={valeur.id} type="button"
            onClick={() => setSelected(valeur)}
            className="flex flex-col items-center text-center gap-4 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform text-3xl" style={{ backgroundColor: "var(--acogrami-green)" }}>
              {valeur.icone ? valeur.icone : <Heart className="h-7 w-7 text-white" />}
            </div>
            <h3 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>{valeur.titre}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{valeur.resume}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} aria-label="Fermer" />
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <button type="button" onClick={() => setSelected(null)} className="absolute right-4 top-4 p-1.5 rounded-full cursor-pointer transition-colors" style={{ color: "var(--muted-foreground)" }}>
              <X className="h-5 w-5" />
            </button>
            <div className="text-4xl mb-4">{selected.icone || "💚"}</div>
            <h3 className="pr-8 text-xl font-bold mb-2" style={{ color: "var(--acogrami-green)" }}>{selected.titre}</h3>
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--muted-foreground)" }}>{selected.resume}</p>
            {selected.description && (
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{selected.description}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
