import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjetQuickActions } from "@/components/admin/ProjetQuickActions";
import { Users, MapPin, FolderOpen, Calendar, Clock, ArrowUpRight, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tableau de bord | Administration ACOGRAMI" };

async function getStats() {
  const [membres, villages, projets, evenementsAVenir, adhesionsAttente, messagesNonLus, derniersInscrits, projetsAttente] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBRE" } }),
    prisma.user.findMany({ where: { village: { not: null } }, select: { village: true }, distinct: ["village"] }),
    prisma.projet.count(),
    prisma.evenement.count({ where: { date: { gte: new Date() } } }),
    prisma.demandeAdhesion.count({ where: { statut: "EN_ATTENTE" } }),
    prisma.contactMessage.count({ where: { lu: false } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, nom: true, prenom: true, email: true, role: true, village: true, createdAt: true } }),
    prisma.projet.findMany({ where: { statut: "EN_ATTENTE" }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return { membres, villagesActifs: villages.length, projets, evenementsAVenir, adhesionsAttente, messagesNonLus, derniersInscrits, projetsAttente };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const STAT_CARDS = [
    { label: "Membres", value: stats.membres, icon: Users, href: "/admin/utilisateurs", color: "var(--acogrami-green)", lightBg: "color-mix(in srgb, var(--acogrami-green) 10%, transparent)" },
    { label: "Villages actifs", value: stats.villagesActifs, icon: MapPin, href: "/admin/villages", color: "#8b5cf6", lightBg: "rgba(139,92,246,0.1)" },
    { label: "Projets", value: stats.projets, icon: FolderOpen, href: "/admin/projets", color: "var(--acogrami-accent)", lightBg: "color-mix(in srgb, var(--acogrami-accent) 10%, transparent)" },
    { label: "Événements à venir", value: stats.evenementsAVenir, icon: Calendar, href: "/admin/evenements", color: "#0ea5e9", lightBg: "rgba(14,165,233,0.1)" },
  ];

  return (
    <div className="space-y-8 animate-fadeSlideIn">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Vue d&apos;ensemble de l&apos;association ACOGRAMI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Actif
          </div>
        </div>
      </div>

      {/* Alertes */}
      {(stats.adhesionsAttente > 0 || stats.messagesNonLus > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.adhesionsAttente > 0 && (
            <Link
              href="/admin/utilisateurs"
              className="flex items-center gap-4 p-4 rounded-xl border transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--badge-warn-bg)", borderColor: "color-mix(in srgb, var(--badge-warn-fg) 25%, transparent)" }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--badge-warn-fg) 20%, transparent)" }}>
                <Clock className="h-5 w-5" style={{ color: "var(--badge-warn-fg)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--badge-warn-fg)" }}>
                  {stats.adhesionsAttente} adhésion{stats.adhesionsAttente > 1 ? "s" : ""} en attente
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--badge-warn-fg)", opacity: 0.75 }}>
                  Cliquez pour traiter
                </p>
              </div>
            </Link>
          )}
          {stats.messagesNonLus > 0 && (
            <Link
              href="/admin/messages"
              className="flex items-center gap-4 p-4 rounded-xl border transition-opacity hover:opacity-90"
              style={{ backgroundColor: "color-mix(in srgb, #3b82f6 8%, var(--card))", borderColor: "rgba(59,130,246,0.25)" }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(59,130,246,0.15)" }}>
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-blue-600">
                  {stats.messagesNonLus} message{stats.messagesNonLus > 1 ? "s" : ""} non lu{stats.messagesNonLus > 1 ? "s" : ""}
                </p>
                <p className="text-xs mt-0.5 text-blue-500 opacity-75">
                  Voir les messages contact
                </p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Cartes stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, href, color, lightBg }) => (
          <Link
            key={label}
            href={href}
            className="p-5 rounded-xl border flex items-center gap-4 transition-shadow hover:shadow-md group"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: lightBg }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</p>
              <p className="text-2xl font-extrabold mt-0.5" style={{ color: "var(--card-foreground)" }}>{value}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--muted-foreground)" }} />
          </Link>
        ))}
      </div>

      {/* Listes rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Projets à valider */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between border-b"
            style={{ borderColor: "var(--card-border)" }}
          >
            <h2 className="font-bold flex items-center gap-2 text-sm" style={{ color: "var(--card-foreground)" }}>
              <Clock className="h-4 w-4" style={{ color: "var(--acogrami-accent)" }} />
              Projets à valider
            </h2>
            <Link href="/admin/projets" className="text-xs flex items-center gap-1 transition-colors" style={{ color: "var(--acogrami-accent)" }}>
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <ProjetQuickActions initialProjets={stats.projetsAttente} />
        </div>

        {/* Derniers inscrits */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between border-b"
            style={{ borderColor: "var(--card-border)" }}
          >
            <h2 className="font-bold flex items-center gap-2 text-sm" style={{ color: "var(--card-foreground)" }}>
              <Users className="h-4 w-4" style={{ color: "var(--acogrami-green)" }} />
              Derniers inscrits
            </h2>
            <Link href="/admin/utilisateurs" className="text-xs flex items-center gap-1 transition-colors" style={{ color: "var(--acogrami-green)" }}>
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div>
            {stats.derniersInscrits.length === 0 ? (
              <p className="p-5 text-sm" style={{ color: "var(--muted-foreground)" }}>Aucun inscrit.</p>
            ) : stats.derniersInscrits.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between px-5 py-3.5 border-b last:border-b-0"
                style={{ borderColor: "var(--card-border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)",
                      color: "var(--acogrami-green)",
                    }}
                  >
                    {u.prenom[0]}{u.nom[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--card-foreground)" }}>
                      {u.prenom} {u.nom}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {u.village || "—"}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs rounded-full px-2.5 py-1 font-semibold"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--acogrami-green) 10%, transparent)",
                    color: "var(--acogrami-green)",
                  }}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
