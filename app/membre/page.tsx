import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreditCard, Calendar, User, MapPin, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Espace Membre | ACOGRAMI",
  description: "Tableau de bord de votre espace membre ACOGRAMI",
};

export default async function MembreDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const prenom = user.name?.split(" ")[0] || "Membre";
  const nom = user.name || "";
  const village = user.village;
  const userId = user.id;

  const [nextEvent, lastCotisation, totalCotisations] = await Promise.all([
    prisma.evenement.findFirst({
      where: { statut: "VALIDE", date: { gte: new Date() } },
      orderBy: { date: "asc" },
    }),
    prisma.cotisation.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.cotisation.count({ where: { userId } }),
  ]);

  const cotisationStatus = lastCotisation?.statut === "PAYE" ? "À jour" : lastCotisation?.statut === "EN_RETARD" ? "En retard" : "Non payé";
  const cotisationColor = lastCotisation?.statut === "PAYE" ? "var(--badge-success-fg)" : lastCotisation?.statut === "EN_RETARD" ? "var(--badge-warn-fg)" : "var(--badge-danger-fg)";
  const cotisationBg = lastCotisation?.statut === "PAYE" ? "var(--badge-success-bg)" : lastCotisation?.statut === "EN_RETARD" ? "var(--badge-warn-bg)" : "var(--badge-danger-bg)";

  return (
    <div className="space-y-8 animate-fadeSlideIn">

      {/* Bienvenue */}
      <div
        className="rounded-2xl p-6 flex items-center gap-5"
        style={{
          background: "linear-gradient(135deg, var(--acogrami-green), var(--acogrami-green-light))",
        }}
      >
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center font-extrabold text-xl text-white shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          {prenom[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">Bienvenue dans votre espace</p>
          <h1 className="text-xl font-bold text-white">{nom}</h1>
          {village && (
            <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {village}
            </p>
          )}
        </div>
      </div>

      {/* Cartes info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Village */}
        <div
          className="p-5 rounded-xl border flex items-start gap-4"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--acogrami-green) 10%, transparent)" }}>
            <MapPin className="h-5 w-5" style={{ color: "var(--acogrami-green)" }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Village</p>
            <p className="font-bold text-base mt-1" style={{ color: "var(--card-foreground)" }}>
              {village || "Non défini"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Communauté Grand Mifi</p>
          </div>
        </div>

        {/* Cotisation */}
        <Link
          href="/membre/cotisations"
          className="p-5 rounded-xl border flex items-start gap-4 transition-shadow hover:shadow-md group"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: cotisationBg }}>
            <CreditCard className="h-5 w-5" style={{ color: cotisationColor }} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Cotisation</p>
            <p className="font-bold text-base mt-1" style={{ color: cotisationColor }}>{cotisationStatus}</p>
            <p className="text-xs mt-0.5 flex items-center gap-1 group-hover:underline" style={{ color: "var(--muted-foreground)" }}>
              {totalCotisations} versement{totalCotisations > 1 ? "s" : ""} <ArrowUpRight className="h-3 w-3" />
            </p>
          </div>
        </Link>

        {/* Prochain événement */}
        <div
          className="p-5 rounded-xl border flex items-start gap-4"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: "rgba(249,115,22,0.1)" }}>
            <Calendar className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Prochain événement</p>
            {nextEvent ? (
              <>
                <p className="font-bold text-sm mt-1" style={{ color: "var(--card-foreground)" }}>
                  {new Date(nextEvent.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                </p>
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--muted-foreground)" }}>{nextEvent.titre}</p>
              </>
            ) : (
              <p className="font-bold text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Aucun</p>
            )}
          </div>
        </div>
      </div>

      {/* Profil résumé */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between border-b"
          style={{ borderColor: "var(--card-border)" }}
        >
          <h2 className="font-bold flex items-center gap-2 text-sm" style={{ color: "var(--card-foreground)" }}>
            <User className="h-4 w-4" style={{ color: "var(--acogrami-green)" }} />
            Mon profil
          </h2>
          <Link href="/membre/profil" className="text-xs flex items-center gap-1" style={{ color: "var(--acogrami-green)" }}>
            Modifier <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            ["Prénom", prenom],
            ["Email", session.user.email || "—"],
            ["Village", village || "Non défini"],
            ["Statut", "Membre actif"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</p>
              <p className="font-semibold text-sm mt-1 truncate" style={{ color: "var(--card-foreground)" }}>{value}</p>
              {label === "Statut" && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs font-medium" style={{ color: "var(--acogrami-green)" }}>Validé</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/membre/cotisations", label: "Mes cotisations", icon: CreditCard, color: "var(--acogrami-green)" },
          { href: "/membre/messagerie",  label: "Messagerie",      icon: Clock,       color: "#8b5cf6" },
          { href: "/actualites",         label: "Actualités",      icon: CheckCircle2,color: "#0ea5e9" },
          { href: "/projets",            label: "Nos projets",     icon: MapPin,      color: "var(--acogrami-accent)" },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-shadow hover:shadow-md"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
