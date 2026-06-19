"use client";

import { useState } from "react";
import { PlusCircle, Loader2, Trash2, Calendar, Edit3, FolderHeart, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";

interface Actualite { id: string; titre: string; contenu: string; categorie?: string; image: string | null; createdAt: string | Date; }
interface Projet { id: string; titre: string; description: string; statut: string; soumisPar: string; createdAt: string | Date; }
interface Evenement { id: string; titre: string; description: string; date: string | Date; lieu: string; statut: string; createdAt: string | Date; }

interface PublicationsResponsableProps {
  initialActualites: Actualite[];
  initialProjets: Projet[];
  initialEvenements: Evenement[];
  auteurId: string;
  village: string;
}

const IS = { backgroundColor: "var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--input-border)", borderRadius: "var(--radius)" };

function statusBadge(statut: string) {
  if (statut === "VALIDE") return "badge-success";
  if (statut === "REJETE") return "badge-danger";
  return "badge-warn";
}

function statusLabel(statut: string) {
  if (statut === "EN_ATTENTE") return "En attente";
  if (statut === "VALIDE") return "Validé";
  return "Rejeté";
}

export function PublicationsResponsable({ initialActualites, initialProjets, initialEvenements, auteurId, village }: PublicationsResponsableProps) {
  const [activeTab, setActiveTab] = useState<"news" | "projects" | "events">("news");
  const router = useRouter();

  const [actualites, setActualites] = useState<Actualite[]>(initialActualites);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [newsCategory, setNewsCategory] = useState("actualite");
  const [isPublishingNews, setIsPublishingNews] = useState(false);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);

  const [projets, setProjets] = useState<Projet[]>(initialProjets);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  const [evenements, setEvenements] = useState<Evenement[]>(initialEvenements);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLieu, setEventLieu] = useState("");
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;
    setIsPublishingNews(true);
    try {
      const res = await fetch("/api/actualites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titre: newsTitle, contenu: newsContent, categorie: newsCategory, image: newsImage || null, auteurId }) });
      if (res.ok) { 
        const data = await res.json();
        setActualites(prev => [data, ...prev]); 
        setNewsTitle(""); 
        setNewsContent(""); 
        setNewsImage(""); 
        alert("Actualité publiée !"); 
        router.refresh(); 
      }
      else alert("Erreur lors de la publication.");
    } catch { alert("Une erreur est survenue."); }
    finally { setIsPublishingNews(false); }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;
    setDeletingNewsId(id);
    try {
      const res = await fetch(`/api/actualites?id=${id}`, { method: "DELETE" });
      if (res.ok) { setActualites(prev => prev.filter(a => a.id !== id)); router.refresh(); }
      else alert("Erreur lors de la suppression.");
    } catch { alert("Une erreur est survenue."); }
    finally { setDeletingNewsId(null); }
  };

  const handleNotifyNews = async (act: Actualite) => {
    if (!confirm(`Notifier tous les abonnés pour : ${act.titre} ?`)) return;
    setDeletingNewsId(`notify-${act.id}`);
    try {
      const res = await fetch("/api/admin/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject: `Nouvelle actualité : ${act.titre}`, content: `<p>Bonjour,</p><p>Nouvelle actualité : <strong>${act.titre}</strong>.</p><p>${act.contenu.substring(0, 200)}...</p>` }) });
      if (res.ok) alert("Les abonnés ont été notifiés !");
      else alert("Erreur lors de l'envoi.");
    } catch { alert("Une erreur est survenue."); }
    finally { setDeletingNewsId(null); }
  };

  const handleSubmittingProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim()) return;
    setIsSubmittingProject(true);
    try {
      const res = await fetch("/api/projets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titre: projectTitle, description: projectDesc, image: projectImage || null, soumisPar: village }) });
      if (res.ok) { 
        const data = await res.json();
        setProjets(prev => [data, ...prev]); 
        setProjectTitle(""); 
        setProjectDesc(""); 
        setProjectImage(""); 
        alert("Projet soumis pour validation !"); 
        router.refresh(); 
      }
      else alert("Erreur lors de la soumission.");
    } catch { alert("Une erreur est survenue."); }
    finally { setIsSubmittingProject(false); }
  };

  const handleSubmittingEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDesc.trim() || !eventDate || !eventLieu.trim()) return;
    setIsSubmittingEvent(true);
    try {
      const res = await fetch("/api/evenements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titre: eventTitle, description: eventDesc, date: eventDate, lieu: eventLieu, statut: "EN_ATTENTE" }) });
      if (res.ok) { 
        const data = await res.json();
        setEvenements(prev => [data, ...prev]); 
        setEventTitle(""); 
        setEventDesc(""); 
        setEventDate(""); 
        setEventLieu(""); 
        alert("Événement proposé pour validation !"); 
        router.refresh(); 
      }
      else alert("Erreur lors de la soumission.");
    } catch { alert("Une erreur est survenue."); }
    finally { setIsSubmittingEvent(false); }
  };

  const tabs = [["news", "Actualités du village"], ["projects", "Proposer un Projet"], ["events", "Proposer un Événement"]] as const;

  const inputRow = (label: string, key: string, value: string, setter: (v: string) => void, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>{label}</label>
      <input type={type} required={type !== "url"} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={IS}
        onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
        onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--card-border)" }}>
        {tabs.map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 md:flex-initial px-6 pb-3 text-center font-bold text-sm border-b-2 transition-colors cursor-pointer"
            style={{ borderBottomColor: activeTab === tab ? "var(--acogrami-green)" : "transparent", color: activeTab === tab ? "var(--acogrami-green)" : "var(--muted-foreground)", marginBottom: "-1px" }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "news" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handlePublishNews} className="p-6 rounded-2xl shadow-sm space-y-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
                <PlusCircle className="h-5 w-5 text-acogrami-green" /> Nouvelle actualité
              </h2>
              {inputRow("Titre", "newsTitle", newsTitle, setNewsTitle, "text", "Ex: Assemblée générale villageoise")}
              {inputRow("Image (URL optionnelle)", "newsImage", newsImage, setNewsImage, "url", "https://example.com/image.jpg")}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Catégorie</label>
                <select value={newsCategory} onChange={e => setNewsCategory(e.target.value)} className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={IS}>
                  <option value="actualite">Actualité générale</option>
                  <option value="projet">Projet</option>
                  <option value="evenement">Événement</option>
                  <option value="annonce">Annonce importante</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Contenu</label>
                <textarea required rows={5} value={newsContent} onChange={e => setNewsContent(e.target.value)} placeholder="Rédigez votre actualité ici..."
                  className="w-full rounded-xl px-4 py-2.5 resize-none focus:outline-none" style={IS}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
              </div>
              <button type="submit" disabled={isPublishingNews} className="w-full bg-acogrami-green hover:bg-[#13382c] text-white font-bold py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                {isPublishingNews && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPublishingNews ? "Publication..." : "Publier"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
              <Edit3 className="h-5 w-5 text-acogrami-accent" /> Mes actualités ({actualites.length})
            </h2>
            <div className="space-y-4">
              {actualites.map(act => (
                <div key={act.id} className="p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-5 items-start relative hover:shadow-md transition-shadow" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
                  {act.image && <img src={act.image} alt={act.titre} className="w-full md:w-32 h-24 object-cover rounded-xl shrink-0" onError={e => (e.target as HTMLElement).style.display = "none"} />}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-acogrami-accent/10 text-acogrami-accent mb-1">{act.categorie || "Actualité"}</span>
                        <h3 className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>{act.titre}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleNotifyNews(act)} disabled={deletingNewsId === `notify-${act.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer shrink-0">
                          🔔 Notifier
                        </button>
                        <button onClick={() => handleDeleteNews(act.id)} disabled={deletingNewsId === act.id}
                          className="text-red-500 hover:text-red-700 p-2 rounded-xl transition-colors cursor-pointer shrink-0"
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "color-mix(in srgb, #ef4444 10%, transparent)"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}>
                          {deletingNewsId === act.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(act.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--muted-foreground)" }}>{act.contenu}</p>
                  </div>
                </div>
              ))}
              {actualites.length === 0 && (
                <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: "var(--muted)", border: "1px solid var(--card-border)", color: "var(--muted-foreground)" }}>Aucune actualité publiée pour le moment.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmittingProject} className="p-6 rounded-2xl shadow-sm space-y-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
                <FolderHeart className="h-5 w-5 text-acogrami-green" /> Nouveau projet
              </h2>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Les projets soumis sont examinés par l&apos;administration avant d&apos;être publiés.</p>
              {inputRow("Titre du Projet", "projectTitle", projectTitle, setProjectTitle, "text", "Ex: Rénovation du foyer communautaire")}
              {inputRow("Image d'illustration (URL)", "projectImage", projectImage, setProjectImage, "url", "https://example.com/project.jpg")}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Description et objectifs</label>
                <textarea required rows={5} value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Décrivez le projet, le budget prévisionnel..."
                  className="w-full rounded-xl px-4 py-2.5 resize-none focus:outline-none" style={IS}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
              </div>
              <button type="submit" disabled={isSubmittingProject} className="w-full bg-acogrami-green hover:bg-[#13382c] text-white font-bold py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmittingProject && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmittingProject ? "Soumission..." : "Soumettre le Projet"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
              <FolderHeart className="h-5 w-5 text-acogrami-accent" /> Projets du village ({projets.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projets.map(p => (
                <div key={p.id} className="p-5 rounded-2xl shadow-sm flex flex-col justify-between" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold" style={{ color: "var(--card-foreground)" }}>{p.titre}</h3>
                      <span className={`${statusBadge(p.statut)} shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold`}>{statusLabel(p.statut)}</span>
                    </div>
                    <p className="text-xs mt-2 line-clamp-4 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{p.description}</p>
                  </div>
                  <div className="mt-4 pt-3 text-[10px]" style={{ borderTop: "1px solid var(--card-border)", color: "var(--muted-foreground)" }}>
                    Soumis le {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              ))}
              {projets.length === 0 && (
                <div className="col-span-full text-center p-8 rounded-2xl" style={{ backgroundColor: "var(--muted)", border: "1px solid var(--card-border)", color: "var(--muted-foreground)" }}>Aucun projet soumis pour le moment.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmittingEvent} className="p-6 rounded-2xl shadow-sm space-y-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
                <Landmark className="h-5 w-5 text-acogrami-green" /> Proposer un événement
              </h2>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Les événements doivent être validés par l&apos;administration avant d&apos;apparaître dans l&apos;agenda.</p>
              {inputRow("Titre de l'événement", "eventTitle", eventTitle, setEventTitle, "text", "Ex: Fête de la récolte")}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Date</label>
                  <input type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={IS}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Lieu</label>
                  <input type="text" required value={eventLieu} onChange={e => setEventLieu(e.target.value)} placeholder="Ex: Foyer Mifi" className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={IS}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>Description</label>
                <textarea required rows={4} value={eventDesc} onChange={e => setEventDesc(e.target.value)} placeholder="Détails du programme, intervenants..."
                  className="w-full rounded-xl px-4 py-2.5 resize-none focus:outline-none" style={IS}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ring)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--input-border)"} />
              </div>
              <button type="submit" disabled={isSubmittingEvent} className="w-full bg-acogrami-green hover:bg-[#13382c] text-white font-bold py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmittingEvent && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmittingEvent ? "Soumission..." : "Proposer l'Événement"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
              <Calendar className="h-5 w-5 text-acogrami-accent" /> Événements de la communauté ({evenements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evenements.map(ev => (
                <div key={ev.id} className="p-5 rounded-2xl shadow-sm flex flex-col justify-between" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold" style={{ color: "var(--card-foreground)" }}>{ev.titre}</h3>
                      <span className={`${statusBadge(ev.statut)} shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold`}>{statusLabel(ev.statut)}</span>
                    </div>
                    <p className="text-xs mt-2 line-clamp-3 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{ev.description}</p>
                    <div className="mt-3 flex flex-col gap-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                      <div>Date : <span className="font-semibold">{new Date(ev.date).toLocaleDateString("fr-FR")}</span></div>
                      <div>Lieu : <span className="font-semibold">{ev.lieu}</span></div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 text-[10px]" style={{ borderTop: "1px solid var(--card-border)", color: "var(--muted-foreground)" }}>
                    Proposé le {new Date(ev.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              ))}
              {evenements.length === 0 && (
                <div className="col-span-full text-center p-8 rounded-2xl" style={{ backgroundColor: "var(--muted)", border: "1px solid var(--card-border)", color: "var(--muted-foreground)" }}>Aucun événement proposé pour le moment.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
