import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import { Users, CheckCircle2, Clock, ArrowUpRight, UserPlus } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Tableau de bord | Espace Responsable" };

async function getStats(villageId: string) {
  const [membres, adhesionsAttente] = await Promise.all([
    prisma.user.count({ where: { villageId, role: "MEMBRE" } }),
    prisma.demandeAdhesion.count({ where: { villageId, statut: "EN_ATTENTE_VILLAGE" } }),
  ]);
  return { membres, adhesionsAttente };
}

export default async function ResponsableDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const villageId = (session.user as any).villageId;
  const villageName = (session.user as any).villageName;
  if (!villageId) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Tableau de bord</h1>
          <p className="mt-2 text-red-500">Aucun village attribué à votre compte. Contactez l&apos;administration.</p>
        </div>
      </div>
    );
  }

  const stats = await getStats(villageId);

  const statCards = [
    { label: "Membres du village", value: stats.membres, icon: Users, color: "#3b82f6" },
    { label: "Adhésions en attente", value: stats.adhesionsAttente, icon: Clock, color: "#f97316" },
    { label: "Demandes validées", value: "—", icon: CheckCircle2, color: "#16a34a" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Tableau de bord</h1>
        <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>
          Bienvenue, vous gérez le village de <span className="font-semibold text-acogrami-green">{villageName}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl shadow-sm flex items-center gap-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="p-3 rounded-xl" style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{label}</p>
              <p className="text-2xl font-bold" style={{ color: "var(--card-foreground)" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--card-border)" }}>
            <h2 className="font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
              <UserPlus className="h-4 w-4 text-acogrami-green" />Demandes d&apos;adhésion
            </h2>
            <Link href="/responsable/adhesions" className="text-sm text-acogrami-green hover:underline flex items-center gap-1">
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-5">
            {stats.adhesionsAttente === 0 ? (
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Aucune demande en attente.</p>
            ) : (
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {stats.adhesionsAttente} demande{stats.adhesionsAttente > 1 ? "s" : ""} en attente de validation.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--card-border)" }}>
            <h2 className="font-bold flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
              <Users className="h-4 w-4 text-acogrami-green" />Membres du village
            </h2>
            <Link href="/responsable/membres" className="text-sm text-acogrami-green hover:underline flex items-center gap-1">
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-5">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              <span className="font-bold" style={{ color: "var(--card-foreground)" }}>{stats.membres}</span> membre{stats.membres > 1 ? "s" : ""} inscrit{stats.membres > 1 ? "s" : ""} pour le village de <span className="font-semibold">{villageName}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
