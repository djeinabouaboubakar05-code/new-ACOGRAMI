"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";

interface Comment {
  id: string;
  contenu: string;
  createdAt: string | Date;
  auteur: {
    nom: string;
    prenom: string;
  };
}

export function ProjectComments({ projetId, initialComments, session }: { projetId: string, initialComments: Comment[], session: any }) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/projets/${projetId}/commentaires`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: newComment }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments([...comments, comment]);
        setNewComment("");
      } else {
        alert("Erreur lors de l'envoi du commentaire.");
      }
    } catch {
      alert("Erreur de connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mt-8">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-acogrami-accent" />
        Commentaires ({comments.length})
      </h3>

      <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-2">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-acogrami-green/10 flex items-center justify-center text-acogrami-green font-bold">
              {c.auteur.prenom[0]}{c.auteur.nom[0]}
            </div>
            <div className="flex-1 bg-muted rounded-2xl rounded-tl-none p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-foreground text-sm">{c.auteur.prenom} {c.auteur.nom}</span>
                <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{c.contenu}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-4 text-sm">Aucun commentaire. Soyez le premier à réagir !</p>
        )}
      </div>

      {session?.user ? (
        <form onSubmit={handleSubmit} className="flex items-start gap-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-acogrami-accent/10 flex items-center justify-center text-acogrami-accent font-bold">
            {(session.user as any).name?.split(' ')[0][0] || "M"}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none resize-none pr-12"
              rows={2}
              required
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="absolute bottom-2 right-2 p-2 bg-acogrami-green hover:bg-[#13382c] text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-muted rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Vous devez être connecté pour commenter ce projet.
          </p>
        </div>
      )}
    </div>
  );
}
