"use client";

import { useState, useEffect } from "react";
import { Send, Trash2, Mail, MailOpen, Loader2, X } from "lucide-react";

interface Message { id: string; expediteur: string; objet: string; date: string; lu: boolean; contenu: string; }

const DEFAULTS: Message[] = [
  { id: "1", expediteur: "Admin ACOGRAMI", objet: "Bienvenue dans l'espace membre !", date: "10/01/2026", lu: false, contenu: "Bonjour et bienvenue dans l'espace membre ACOGRAMI. Vous pouvez ici consulter vos cotisations, les actualités de l'association et contacter l'administration." },
  { id: "2", expediteur: "Admin ACOGRAMI", objet: "Rappel : cotisation annuelle 2026", date: "01/03/2026", lu: false, contenu: "Cher(e) membre, nous vous rappelons que la cotisation annuelle 2026 est disponible. Rendez-vous dans la section Cotisations pour effectuer votre règlement." },
];

export default function MessageriePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(false);
  const [destinataire, setDestinataire] = useState("");
  const [objet, setObjet] = useState("");
  const [contenu, setContenu] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("acogrami_messages_v2");
    setMessages(stored ? JSON.parse(stored) : DEFAULTS);
  }, []);

  function save(msgs: Message[]) {
    setMessages(msgs);
    localStorage.setItem("acogrami_messages_v2", JSON.stringify(msgs));
  }

  function selectMsg(id: string) {
    setSelected(id);
    save(messages.map(m => m.id === id ? { ...m, lu: true } : m));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      expediteur: `À : ${destinataire}`,
      objet,
      date: new Date().toLocaleDateString("fr-FR"),
      lu: true,
      contenu,
    };
    save([newMsg, ...messages]);
    setShowCompose(false);
    setDestinataire(""); setObjet(""); setContenu("");
    setLoading(false);
  }

  function deleteMsg(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    save(messages.filter(m => m.id !== id));
    if (selected === id) setSelected(null);
  }

  const selectedMsg = messages.find(m => m.id === selected);
  const nonLus = messages.filter(m => !m.lu).length;

  const inputStyle = { backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)", borderRadius: "var(--radius)" };

  return (
    <div className="space-y-6 animate-fadeSlideIn">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Mail className="h-6 w-6" style={{ color: "var(--acogrami-green)" }} />
            Messagerie
            {nonLus > 0 && <span className="badge-danger text-xs ml-1">{nonLus} non lu{nonLus > 1 ? "s" : ""}</span>}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Messages de l&apos;ACOGRAMI et communications internes</p>
        </div>
        <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--acogrami-green)" }}>
          <Send className="h-4 w-4" /> Nouveau
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 min-h-[400px]">
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
          <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </div>
          <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
            {messages.map(msg => (
              <button key={msg.id} onClick={() => selectMsg(msg.id)} className="w-full text-left p-4 transition-colors cursor-pointer"
                style={{
                  backgroundColor: selected === msg.id ? "color-mix(in srgb, var(--acogrami-green) 8%, var(--card))" : "transparent",
                  borderLeft: selected === msg.id ? "3px solid var(--acogrami-green)" : "3px solid transparent",
                }}
                onMouseEnter={e => { if (selected !== msg.id) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"; }}
                onMouseLeave={e => { if (selected !== msg.id) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: !msg.lu ? "var(--foreground)" : "var(--muted-foreground)" }}>{msg.expediteur}</p>
                  {!msg.lu && <span className="h-2 w-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: "var(--acogrami-accent)" }} />}
                </div>
                <p className="text-xs mt-0.5 truncate font-medium" style={{ color: "var(--foreground-subtle)" }}>{msg.objet}</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--muted-foreground)" }}>{msg.date}</p>
              </button>
            ))}
            {messages.length === 0 && (
              <div className="p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>Boîte vide.</div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
          {selectedMsg ? (
            <>
              <div className="px-6 py-4 border-b flex items-start justify-between gap-4" style={{ borderColor: "var(--card-border)" }}>
                <div>
                  <h2 className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>{selectedMsg.objet}</h2>
                  <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>De : {selectedMsg.expediteur} — {selectedMsg.date}</p>
                </div>
                <button onClick={() => deleteMsg(selectedMsg.id)} className="p-2 rounded-lg cursor-pointer" style={{ color: "#ef4444" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6">
                <p className="leading-relaxed whitespace-pre-wrap text-sm" style={{ color: "var(--card-foreground)" }}>{selectedMsg.contenu}</p>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[250px] flex flex-col items-center justify-center gap-3">
              <MailOpen className="h-12 w-12" style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Sélectionnez un message</p>
            </div>
          )}
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="rounded-2xl p-6 w-full max-w-lg shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>Nouveau message</h2>
              <button onClick={() => setShowCompose(false)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: "var(--muted-foreground)" }}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSend} className="space-y-4">
              {[
                { label: "Destinataire", value: destinataire, set: setDestinataire, placeholder: "Admin ACOGRAMI" },
                { label: "Objet",        value: objet,        set: setObjet,        placeholder: "Votre sujet" },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>{label}</label>
                  <input type="text" value={value} onChange={e => set(e.target.value)} placeholder={placeholder} required
                    className="w-full px-4 py-2.5 text-sm transition-all" style={inputStyle}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Message</label>
                <textarea rows={5} value={contenu} onChange={e => setContenu(e.target.value)} placeholder="Votre message…" required
                  className="w-full px-4 py-2.5 text-sm resize-none transition-all" style={inputStyle}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCompose(false)} className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>Annuler</button>
                <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: "var(--acogrami-green)" }}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? "Envoi…" : "Envoyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
