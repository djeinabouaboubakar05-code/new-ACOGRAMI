"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Loader2, Users } from "lucide-react";

interface Abonne {
  id: string;
  email: string;
  actif: boolean;
  createdAt: string;
}

export function NewsletterAdmin() {
  const [abonnes, setAbonnes] = useState<Abonne[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAbonnes();
  }, []);

  const fetchAbonnes = async () => {
    try {
      const res = await fetch("/api/admin/newsletter");
      if (res.ok) {
        const data = await res.json();
        setAbonnes(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) return;
    setSending(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setSubject("");
        setContent("");
      } else {
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      setMessage("Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  };

  const actifsCount = abonnes.filter(a => a.actif).length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Liste des abonnés */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-acogrami-green/10 rounded-xl text-acogrami-green">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Abonnés Newsletter</h2>
              <p className="text-sm text-muted-foreground">{actifsCount} abonnés actifs sur {abonnes.length}</p>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : abonnes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun abonné pour le moment.</p>
            ) : (
              abonnes.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.email}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${a.actif ? 'badge-success' : 'badge-danger'}`}>
                    {a.actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Envoi de Newsletter */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-acogrami-accent/10 rounded-xl text-acogrami-accent">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Envoyer un e-mail</h2>
              <p className="text-sm text-muted-foreground">Aux abonnés actifs uniquement</p>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Sujet de l'e-mail</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                placeholder="Ex: Les dernières nouvelles d'Acogrami"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Contenu (HTML supporté)</label>
              <textarea
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-sm text-foreground h-40 focus:ring-2 focus:ring-ring outline-none resize-none"
                placeholder="<p>Bonjour...</p>"
              />
            </div>
            <button
              type="submit"
              disabled={sending || actifsCount === 0}
              className="w-full flex items-center justify-center gap-2 bg-acogrami-accent hover:bg-acogrami-earth text-white rounded-lg px-4 py-2.5 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Envoyer la newsletter
            </button>
            {message && (
              <p className="text-sm text-center mt-2 text-foreground font-medium">{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
