"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setMessage(data.message);
        setEmail("");
      } else {
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setMessage("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <h3 className="font-bold text-white text-lg mb-2">Restez informé</h3>
      <p className="text-sm text-zinc-300 mb-4 max-w-sm">
        Abonnez-vous à notre newsletter pour ne rien manquer.
      </p>
      {sent ? (
        <p className="text-sm font-semibold text-green-400">
          {message || "Merci pour votre inscription !"}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre e-mail"
            disabled={loading}
            className="w-full rounded bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring border border-border"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-acogrami-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-acogrami-earth transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {loading ? "Envoi..." : "S'abonner"}
          </button>
        </form>
      )}
      {message && !sent && (
        <p className="text-sm text-red-400 mt-2">{message}</p>
      )}
    </div>
  );
}
