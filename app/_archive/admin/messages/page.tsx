"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Trash2, MailOpen, Mail, Loader2, ChevronDown } from "lucide-react";

interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  message: string;
  lu: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/messages");
    if (res.ok) setMessages(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string, lu: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lu }),
    });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, lu } : m));
  }

  async function deleteMessage(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected === id) setSelected(null);
  }

  const nonLus = messages.filter(m => !m.lu).length;
  const selectedMsg = messages.find(m => m.id === selected);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--acogrami-green)" }} />
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeSlideIn">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: "var(--foreground)" }}>
          <MessageSquare className="h-6 w-6" style={{ color: "var(--acogrami-green)" }} />
          Messages de contact
          {nonLus > 0 && (
            <span className="badge-danger text-xs">{nonLus} non lu{nonLus > 1 ? "s" : ""}</span>
          )}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Messages reçus depuis le formulaire de contact du site
        </p>
      </div>

      {messages.length === 0 ? (
        <div
          className="rounded-xl border p-16 text-center"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <MailOpen className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
          <p className="font-semibold" style={{ color: "var(--muted-foreground)" }}>Aucun message reçu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Liste */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <div
              className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider"
              style={{ borderColor: "var(--card-border)", color: "var(--muted-foreground)", backgroundColor: "var(--muted)" }}
            >
              {messages.length} message{messages.length > 1 ? "s" : ""}
            </div>
            <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {messages.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setSelected(m.id); if (!m.lu) markRead(m.id, true); }}
                  className="w-full text-left p-4 transition-colors"
                  style={{
                    backgroundColor: selected === m.id ? "color-mix(in srgb, var(--acogrami-green) 8%, var(--card))" : "transparent",
                    borderLeft: selected === m.id ? "3px solid var(--acogrami-green)" : "3px solid transparent",
                  }}
                  onMouseEnter={e => { if (selected !== m.id) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"; }}
                  onMouseLeave={e => { if (selected !== m.id) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold truncate" style={{ color: !m.lu ? "var(--foreground)" : "var(--muted-foreground)" }}>
                      {m.nom}
                    </p>
                    {!m.lu && <span className="h-2 w-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: "var(--acogrami-accent)" }} />}
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>{m.email}</p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{m.message}</p>
                  <p className="text-[11px] mt-2" style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>
                    {new Date(m.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Détail */}
          <div
            className="lg:col-span-2 rounded-xl border overflow-hidden"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
          >
            {selectedMsg ? (
              <>
                <div
                  className="px-6 py-4 border-b flex items-start justify-between gap-4"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  <div>
                    <p className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>{selectedMsg.nom}</p>
                    <a href={`mailto:${selectedMsg.email}`} className="text-sm hover:underline" style={{ color: "var(--acogrami-green)" }}>
                      {selectedMsg.email}
                    </a>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      {new Date(selectedMsg.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markRead(selectedMsg.id, !selectedMsg.lu)}
                      className="p-2 rounded-lg text-xs transition-colors cursor-pointer"
                      style={{ color: "var(--muted-foreground)", backgroundColor: "var(--muted)" }}
                      title={selectedMsg.lu ? "Marquer non lu" : "Marquer lu"}
                    >
                      {selectedMsg.lu ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMsg.id)}
                      className="p-2 rounded-lg transition-colors cursor-pointer"
                      style={{ color: "#ef4444" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="leading-relaxed whitespace-pre-wrap text-sm" style={{ color: "var(--card-foreground)" }}>
                    {selectedMsg.message}
                  </p>
                  <a
                    href={`mailto:${selectedMsg.email}?subject=Réponse à votre message - ACOGRAMI`}
                    className="mt-6 inline-flex items-center gap-2 py-2.5 px-5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--acogrami-green)" }}
                  >
                    <Mail className="h-4 w-4" />
                    Répondre par email
                  </a>
                </div>
              </>
            ) : (
              <div className="h-full min-h-64 flex flex-col items-center justify-center gap-3">
                <MailOpen className="h-12 w-12" style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  Sélectionnez un message pour le lire
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
