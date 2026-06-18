"use client";

import { useEffect, useState } from "react";
import { Heart, Plus, Trash2, Edit2, Loader2, X, Save } from "lucide-react";

interface Valeur {
  id: string;
  titre: string;
  resume: string;
  description: string;
  icone: string | null;
  ordre: number;
}

const EMPTY: Omit<Valeur, "id"> = { titre: "", resume: "", description: "", icone: "", ordre: 0 };
const ICONS = ["🤝", "🌿", "💪", "🏡", "📚", "🎶", "🌍", "⚖️", "🕊️", "🔥", "💡", "🌟"];

export default function AdminValeursPage() {
  const [items, setItems] = useState<Valeur[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Valeur | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/valeurs");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(v: Valeur) {
    setEditing(v);
    setForm({ titre: v.titre, resume: v.resume, description: v.description || "", icone: v.icone || "", ordre: v.ordre });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;
    const res = await fetch("/api/admin/valeurs", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { await load(); setShowForm(false); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette valeur ?")) return;
    await fetch("/api/admin/valeurs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems(prev => prev.filter(v => v.id !== id));
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
            <Heart className="h-6 w-6" style={{ color: "var(--acogrami-green)" }} />
            Valeurs de l&apos;association
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            {items.length} valeur{items.length !== 1 ? "s" : ""} affichée{items.length !== 1 ? "s" : ""} sur le site
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--acogrami-green)" }}
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border p-16 text-center" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
          <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
          <p className="font-semibold" style={{ color: "var(--muted-foreground)" }}>Aucune valeur enregistrée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.sort((a, b) => a.ordre - b.ordre).map(v => (
            <div
              key={v.id}
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
            >
              <div className="flex items-start gap-3">
                {v.icone ? (
                  <span className="text-3xl shrink-0">{v.icone}</span>
                ) : (
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)", color: "var(--acogrami-green)" }}
                  >
                    <Heart className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold" style={{ color: "var(--card-foreground)" }}>{v.titre}</p>
                  <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{v.resume}</p>
                </div>
              </div>
              {v.description && (
                <p className="text-xs line-clamp-3" style={{ color: "var(--muted-foreground)" }}>{v.description}</p>
              )}
              <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--card-border)" }}>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>
                  Ordre #{v.ordre}
                </span>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => openEdit(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                    style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                    style={{ color: "#ef4444" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>
                {editing ? "Modifier" : "Ajouter"} une valeur
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: "var(--muted-foreground)" }}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Titre *</label>
                <input
                  type="text" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                  placeholder="Solidarité" required
                  className="w-full px-4 py-2.5 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Résumé *</label>
                <input
                  type="text" value={form.resume} onChange={e => setForm(f => ({ ...f, resume: e.target.value }))}
                  placeholder="Une courte phrase résumant la valeur" required
                  className="w-full px-4 py-2.5 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Description détaillée</label>
                <textarea
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description plus complète (optionnel)" rows={3}
                  className="w-full px-4 py-2.5 rounded-lg text-sm transition-all resize-none"
                  style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Icône (emoji)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {ICONS.map(icon => (
                    <button
                      key={icon} type="button"
                      onClick={() => setForm(f => ({ ...f, icone: f.icone === icon ? "" : icon }))}
                      className="text-xl w-10 h-10 rounded-lg border-2 transition-all cursor-pointer"
                      style={{
                        borderColor: form.icone === icon ? "var(--acogrami-green)" : "var(--card-border)",
                        backgroundColor: form.icone === icon ? "color-mix(in srgb, var(--acogrami-green) 12%, transparent)" : "var(--muted)",
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text" value={form.icone || ""} onChange={e => setForm(f => ({ ...f, icone: e.target.value }))}
                  placeholder="Ou entrez un emoji personnalisé"
                  className="w-full px-4 py-2.5 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Ordre d&apos;affichage</label>
                <input
                  type="number" value={form.ordre}
                  onChange={e => setForm(f => ({ ...f, ordre: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 rounded-lg text-sm"
                  style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: "var(--acogrami-green)" }}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
