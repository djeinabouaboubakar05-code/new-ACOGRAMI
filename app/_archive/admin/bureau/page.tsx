"use client";

import { useEffect, useState } from "react";
import { Award, Plus, Trash2, Edit2, Loader2, X, Save } from "lucide-react";

interface MembreBureau {
  id: string;
  nom: string;
  prenom: string;
  fonction: string;
  telephone: string | null;
  email: string | null;
  photo: string | null;
  ordre: number;
}

const EMPTY: Omit<MembreBureau, "id"> = { nom: "", prenom: "", fonction: "", telephone: "", email: "", photo: "", ordre: 0 };

export default function AdminBureauPage() {
  const [membres, setMembres] = useState<MembreBureau[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MembreBureau | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/bureau");
    if (res.ok) setMembres(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(m: MembreBureau) { setEditing(m); setForm({ nom: m.nom, prenom: m.prenom, fonction: m.fonction, telephone: m.telephone || "", email: m.email || "", photo: m.photo || "", ordre: m.ordre }); setShowForm(true); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;
    const res = await fetch("/api/admin/bureau", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { await load(); setShowForm(false); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce membre du bureau ?")) return;
    await fetch("/api/admin/bureau", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMembres(prev => prev.filter(m => m.id !== id));
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--acogrami-green)" }} /></div>;

  return (
    <div className="space-y-6 animate-fadeSlideIn">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: "var(--foreground)" }}>
            <Award className="h-6 w-6" style={{ color: "var(--acogrami-green)" }} />
            Bureau exécutif
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{membres.length} membre{membres.length !== 1 ? "s" : ""} du bureau</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--acogrami-green)" }}>
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {membres.map(m => (
          <div key={m.id} className="rounded-xl border p-5 flex flex-col gap-3 group" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
            <div className="flex items-start gap-3">
              {m.photo ? (
                <img src={m.photo} alt={m.prenom} className="h-12 w-12 rounded-full object-cover shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)", color: "var(--acogrami-green)" }}>
                  {m.prenom[0]}{m.nom[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "var(--card-foreground)" }}>{m.prenom} {m.nom}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "var(--acogrami-accent)" }}>{m.fonction}</p>
                {m.email && <p className="text-xs mt-1 truncate" style={{ color: "var(--muted-foreground)" }}>{m.email}</p>}
                {m.telephone && <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{m.telephone}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--card-border)" }}>
              <button onClick={() => openEdit(m)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>
                <Edit2 className="h-3.5 w-3.5" /> Modifier
              </button>
              <button onClick={() => handleDelete(m.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors" style={{ color: "#ef4444" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}>
                <Trash2 className="h-3.5 w-3.5" /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {membres.length === 0 && (
        <div className="rounded-xl border p-16 text-center" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
          <Award className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
          <p className="font-semibold" style={{ color: "var(--muted-foreground)" }}>Aucun membre du bureau</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>{editing ? "Modifier" : "Ajouter"} un membre</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: "var(--muted-foreground)" }}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { name: "prenom", label: "Prénom *", placeholder: "Jean" },
                { name: "nom",    label: "Nom *",    placeholder: "Nkomo" },
                { name: "fonction", label: "Fonction *", placeholder: "Président" },
                { name: "telephone", label: "Téléphone", placeholder: "+237 6..." },
                { name: "email",  label: "Email",    placeholder: "jean@exemple.com" },
                { name: "photo",  label: "Photo URL", placeholder: "https://..." },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>{label}</label>
                  <input
                    type={name === "email" ? "email" : name === "photo" ? "url" : "text"}
                    value={(form as any)[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                    placeholder={placeholder} required={["prenom", "nom", "fonction"].includes(name)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm transition-all"
                    style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Ordre d&apos;affichage</label>
                <input type="number" value={form.ordre} onChange={e => setForm(f => ({ ...f, ordre: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)" }} />
              </div>
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
