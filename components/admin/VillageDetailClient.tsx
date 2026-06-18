"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, Mail, ShieldCheck, Calendar, Search, CreditCard, UserCheck, UserX, Shield, ShieldOff, Loader2 } from "lucide-react";

interface Member {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  villageId: string | null;
  statut: string;
  estEnRegle: boolean;
  estDelegue: boolean;
  createdAt: string | Date;
}

interface VillageDetailClientProps {
  villageId: string;
  villageName: string;
  chefId: string | null;
  members: Member[];
  cotisationsCount: number;
}

export function VillageDetailClient({ villageId, villageName, chefId, members, cotisationsCount }: VillageDetailClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, action: "promote" | "demote") => {
    try {
      setLoadingAction(userId);
      const res = await fetch(`/api/admin/villages/responsable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, villageId }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Une erreur est survenue.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau.");
    } finally {
      setLoadingAction(null);
    }
  };

  const filtered = members.filter(
    (m) =>
      `${m.prenom} ${m.nom}`.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = members.filter((m) => m.statut === "ACTIF").length;
  const responsableCount = chefId ? 1 : 0;

  return (
    <div className="space-y-8 animate-fadeSlideIn">
      {/* Back link + Title */}
      <div>
        <Link
          href="/admin/villages"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux villages
        </Link>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-acogrami-green/20">
            <MapPin className="h-6 w-6 text-acogrami-accent" />
          </div>
          {villageName}
        </h1>
        <p className="mt-2 text-text-muted">
          Informations et membres du village de {villageName}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-2">
            <Users className="h-4 w-4" />
            Total Membres
          </div>
          <p className="text-2xl font-bold text-foreground">{members.length}</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-2">
            <UserCheck className="h-4 w-4 text-green-400" />
            Actifs
          </div>
          <p className="text-2xl font-bold text-green-400">{activeCount}</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-2">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            Responsables
          </div>
          <p className="text-2xl font-bold text-amber-400">{responsableCount}</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-2">
            <CreditCard className="h-4 w-4 text-sky-400" />
            Cotisations
          </div>
          <p className="text-2xl font-bold text-sky-400">{cotisationsCount}</p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-card-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-acogrami-accent" />
            Liste des membres ({members.length})
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-input-bg border border-input-border rounded-xl text-sm text-foreground placeholder-text-muted focus:outline-none focus:border-acogrami-accent w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-acogrami-light/50 border-b border-card-border">
              <tr>
                <th className="text-left p-4 text-text-muted font-medium">Nom complet</th>
                <th className="text-left p-4 text-text-muted font-medium">Email</th>
                <th className="text-left p-4 text-text-muted font-medium">Rôle</th>
                <th className="text-left p-4 text-text-muted font-medium">Statut</th>
                <th className="text-left p-4 text-text-muted font-medium">Inscrit le</th>
                <th className="text-right p-4 text-text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-acogrami-light/30 transition-colors">
                  <td className="p-4 text-foreground font-medium">
                    {m.prenom} <span className="uppercase">{m.nom}</span>
                  </td>
                  <td className="p-4 text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      {m.email}
                    </div>
                  </td>
                  <td className="p-4">
                    {m.id === chefId ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3.5 w-3.5" /> Chef / Resp.
                      </span>
                    ) : m.estDelegue ? (
                       <span className="inline-flex items-center gap-1 text-xs text-blue-400 font-bold bg-blue-950/40 px-2 py-0.5 rounded-full">
                         <Users className="h-3.5 w-3.5" /> Délégué
                       </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                         Membre
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {m.statut === "ACTIF" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-400">
                          <UserCheck className="h-3.5 w-3.5" /> Actif
                        </span>
                      ) : m.statut === "SUSPENDU" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                          <UserX className="h-3.5 w-3.5" /> Suspendu
                        </span>
                      ) : m.statut === "PARTI" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-400">
                          <UserX className="h-3.5 w-3.5" /> Parti
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                          <UserX className="h-3.5 w-3.5" /> En attente
                        </span>
                      )}
                      
                      {m.estEnRegle ? (
                        <span className="text-[10px] text-green-500">En règle</span>
                      ) : (
                        <span className="text-[10px] text-red-500">Pas en règle</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-text-muted">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3.5 w-3.5 text-text-muted" />
                      {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {m.id === chefId ? (
                      <button
                        onClick={() => handleRoleChange(m.id, "demote")}
                        disabled={loadingAction === m.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                        title="Retirer la responsabilité"
                      >
                        {loadingAction === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldOff className="h-3.5 w-3.5" />}
                        Destituer
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(m.id, "promote")}
                        disabled={loadingAction === m.id || m.role === "ADMIN" || !!chefId} // Disable if there is already a chef
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors disabled:opacity-50"
                        title={chefId ? "Un village a déjà un chef" : "Nommer Responsable"}
                      >
                        {loadingAction === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Shield className="h-3.5 w-3.5" />}
                        Nommer Chef
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">
                    {members.length === 0
                      ? "Aucun membre inscrit dans ce village."
                      : "Aucun résultat pour votre recherche."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
