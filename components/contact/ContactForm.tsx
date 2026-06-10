"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const body = {
      nom: formData.get("nom") as string,
      email: formData.get("email") as string,
      message: `[${formData.get("sujet")}] ${formData.get("message")}`,
    };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { setIsSuccess(true); form.reset(); setTimeout(() => setIsSuccess(false), 5000); }
      else alert("Erreur lors de l'envoi. Réessayez.");
    } catch { alert("Problème de connexion. Réessayez."); }
    finally { setIsSubmitting(false); }
  };

  const inputStyle = {
    backgroundColor: "var(--input-bg)",
    color: "var(--input-text)",
    border: "1px solid var(--input-border)",
    borderRadius: "var(--radius)",
  };

  return (
    <div className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--card-foreground)" }}>Envoyez-nous un message</h2>

      {isSuccess && (
        <div className="mb-5 flex items-center gap-3 rounded-xl p-4" style={{ backgroundColor: "color-mix(in srgb, #16a34a 10%, transparent)", border: "1px solid #16a34a" }}>
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium text-green-700">Message envoyé ! Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            { id: "nom",   label: "Nom complet",   type: "text",  placeholder: "Jean Nkomo" },
            { id: "email", label: "Adresse email", type: "email", placeholder: "jean@exemple.com" },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="mb-2 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type={type} id={id} name={id} required placeholder={placeholder}
                className="w-full px-4 py-3 text-sm transition-all"
                style={inputStyle}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="sujet" className="mb-2 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Sujet <span className="text-red-500">*</span>
          </label>
          <input
            type="text" id="sujet" name="sujet" required placeholder="Demande d'informations"
            className="w-full px-4 py-3 text-sm transition-all"
            style={inputStyle}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message" name="message" required rows={5} placeholder="Comment pouvons-nous vous aider ?"
            className="w-full resize-none px-4 py-3 text-sm transition-all"
            style={inputStyle}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
          />
        </div>

        <button
          type="submit" disabled={isSubmitting || isSuccess}
          className="group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70 cursor-pointer"
          style={{ backgroundColor: isSuccess ? "#16a34a" : "var(--acogrami-green)" }}
        >
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…</>
          ) : isSuccess ? (
            <><CheckCircle className="h-4 w-4" /> Message envoyé !</>
          ) : (
            <><Send className="h-4 w-4 transition-transform group-hover:translate-x-1" /> Envoyer le message</>
          )}
        </button>
      </form>
    </div>
  );
}
