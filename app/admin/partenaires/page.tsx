"use client";

import { useEffect, useState } from "react";
import { Handshake, Plus, Trash2, Edit2, Loader2, X, Save, ExternalLink } from "lucide-react";

interface Partenaire { id: string; nom: string; logo: string | null; url: string | null; }
const EMPTY = { nom: "", logo: "", url: "" };

export default function AdminPartenairesPage() {
  const [items, setItems] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partenaire | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/partenaires");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(p: Partenaire) { setEditing(p); setForm({ nom: p.nom, logo: p.logo || "", url: p.url || "" }); setShowForm(true); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;
    const res = await fetch("/api/admin/partenaires", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { await load(); setShowForm(false); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    await fetch("/api/admin/partenaires", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--acogrami-green)" }} /></div>;

  return (
    <div className="space-y-6 animate-fadeSlideIn">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: "var(--foreground)" }}>
            <Handshake className="h-6 w-6" style={{ color: "var(--acogrami-green)" }} />
            Partenaires
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{items.length} partenaire{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--acogrami-green)" }}>
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(p => (
          <div key={p.id} className="rounded-xl border p-5 flex flex-col items-center gap-3 group text-center" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
            {p.logo ? (
              <img src={p.logo} alt={p.nom} className="h-14 w-32 object-contain" />
            ) : (
              <div className="h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: "color-mix(in srgb, var(--acogrami-green) 10%, transparent)", color: "var(--acogrami-green)" }}>
                {p.nom[0]}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: "var(--card-foreground)" }}>{p.nom}</p>
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 justify-center mt-1 hover:underline" style={{ color: "var(--acogrami-green)" }}>
                  <ExternalLink className="h-3 w-3" /> Site web
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg cursor-pointer transition-colors" style={{ color: "var(--muted-foreground)", backgroundColor: "var(--muted)" }}>
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg cursor-pointer transition-colors" style={{ color: "#ef4444" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border p-16 text-center" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
          <Handshake className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
          <p className="font-semibold" style={{ color: "var(--muted-foreground)" }}>Aucun partenaire enregistré</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>{editing ? "Modifier" : "Ajouter"} un partenaire</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: "var(--muted-foreground)" }}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { name: "nom",  label: "Nom *",      placeholder: "Mairie de Bafoussam", req: true },
                { name: "logo", label: "Logo URL",    placeholder: "https://..." },
                { name: "url",  label: "Site web",    placeholder: "https://..." },
              ].map(({ name, label, placeholder, req }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>{label}</label>
                  <input type="url" value={(form as any)[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                    placeholder={placeholder} required={req}
                    style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)", borderRadius: "var(--radius)" }}
                    className="w-full px-4 py-2.5 text-sm transition-all"
                    {...(name === "nom" ? { type: "text" } : {})}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>Annuler</button>
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
