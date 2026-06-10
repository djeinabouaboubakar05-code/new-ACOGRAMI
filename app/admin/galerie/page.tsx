"use client";

import { useEffect, useState } from "react";
import { Images, Plus, Trash2, Loader2, X } from "lucide-react";

interface GalerieItem {
  id: string;
  titre: string | null;
  image: string;
  createdAt: string;
}

export default function AdminGaleriePage() {
  const [items, setItems] = useState<GalerieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/galerie");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/galerie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre: titre || null, image }),
    });
    if (res.ok) {
      const newItem = await res.json();
      setItems(prev => [newItem, ...prev]);
      setShowForm(false);
      setTitre("");
      setImage("");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette image ?")) return;
    await fetch("/api/admin/galerie", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--acogrami-green)" }} />
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeSlideIn">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: "var(--foreground)" }}>
            <Images className="h-6 w-6" style={{ color: "var(--acogrami-green)" }} />
            Galerie photos
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            {items.length} photo{items.length !== 1 ? "s" : ""} dans la galerie
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "var(--acogrami-green)" }}
        >
          <Plus className="h-4 w-4" />
          Ajouter une photo
        </button>
      </div>

      {/* Grille galerie */}
      {items.length === 0 ? (
        <div
          className="rounded-xl border p-16 text-center"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <Images className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
          <p className="font-semibold" style={{ color: "var(--muted-foreground)" }}>Aucune photo dans la galerie</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-sm font-semibold cursor-pointer" style={{ color: "var(--acogrami-green)" }}>
            + Ajouter une photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border aspect-square"
              style={{ borderColor: "var(--card-border)" }}
            >
              <img
                src={item.image}
                alt={item.titre || "Photo galerie"}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                {item.titre && (
                  <p className="text-white text-xs font-semibold text-center line-clamp-2">{item.titre}</p>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ajout */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="rounded-2xl p-6 w-full max-w-md shadow-2xl"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>Ajouter une photo</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg cursor-pointer transition-colors" style={{ color: "var(--muted-foreground)" }}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                  URL de l&apos;image *
                </label>
                <input
                  type="url" value={image} onChange={e => setImage(e.target.value)}
                  placeholder="https://..." required
                  className="w-full px-4 py-2.5 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                  Titre (optionnel)
                </label>
                <input
                  type="text" value={titre} onChange={e => setTitre(e.target.value)}
                  placeholder="Description de la photo"
                  className="w-full px-4 py-2.5 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                />
              </div>
              {image && (
                <div className="rounded-lg overflow-hidden aspect-video">
                  <img src={image} alt="Aperçu" className="w-full h-full object-cover" onError={e => (e.currentTarget as HTMLImageElement).src = ""} />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: "var(--acogrami-green)" }}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {saving ? "Ajout…" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
