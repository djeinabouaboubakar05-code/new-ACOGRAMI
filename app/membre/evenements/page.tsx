import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MembreEvenementsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const [inscriptions, upcoming] = await Promise.all([
    prisma.inscriptionEvenement.findMany({
      where: { userId },
      include: { evenement: true },
      orderBy: { evenement: { date: "asc" } },
    }),
    prisma.evenement.findMany({
      where: { statut: "VALIDE", date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 5,
    }),
  ]);

  const inscritIds = new Set(inscriptions.map(i => i.evenementId));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Mes Événements</h1>
        <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>
          Vos inscriptions aux événements de la communauté ACOGRAMI.
        </p>
      </div>

      {/* Mes inscriptions */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
            <CheckCircle2 className="h-5 w-5 text-acogrami-green" />
            Mes inscriptions ({inscriptions.length})
          </h2>
        </div>
        <div>
          {inscriptions.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <Calendar className="h-10 w-10 mx-auto" style={{ color: "var(--muted-foreground)" }} />
              <p style={{ color: "var(--muted-foreground)" }}>Vous n&apos;êtes inscrit à aucun événement.</p>
              <Link href="/evenements" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--acogrami-green)" }}>
                Voir les événements disponibles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            inscriptions.map(({ evenement: ev }) => (
              <div key={ev.id} className="flex items-center gap-5 p-5" style={{ borderBottom: "1px solid var(--card-border)" }}>
                <div className="h-14 w-14 rounded-xl flex flex-col items-center justify-center shrink-0 text-white" style={{ backgroundColor: "var(--acogrami-green)" }}>
                  <span className="text-xl font-black leading-none">{new Date(ev.date).getDate()}</span>
                  <span className="text-[10px] font-semibold uppercase">{new Date(ev.date).toLocaleDateString("fr-FR", { month: "short" })}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: "var(--card-foreground)" }}>{ev.titre}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(ev.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.lieu}</span>
                  </div>
                </div>
                <span className="badge-success text-xs px-2.5 py-1 rounded-full font-semibold shrink-0">Inscrit</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Événements à venir non-inscrits */}
      {upcoming.filter(e => !inscritIds.has(e.id)).length > 0 && (
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="p-5" style={{ borderBottom: "1px solid var(--card-border)" }}>
            <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
              <Calendar className="h-5 w-5 text-acogrami-accent" />
              Prochains événements
            </h2>
          </div>
          <div>
            {upcoming.filter(e => !inscritIds.has(e.id)).map(ev => (
              <div key={ev.id} className="flex items-center gap-5 p-5" style={{ borderBottom: "1px solid var(--card-border)" }}>
                <div className="h-14 w-14 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ backgroundColor: "var(--muted)" }}>
                  <span className="text-xl font-black leading-none" style={{ color: "var(--card-foreground)" }}>{new Date(ev.date).getDate()}</span>
                  <span className="text-[10px] font-semibold uppercase" style={{ color: "var(--muted-foreground)" }}>{new Date(ev.date).toLocaleDateString("fr-FR", { month: "short" })}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: "var(--card-foreground)" }}>{ev.titre}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.lieu}</span>
                  </div>
                </div>
                <Link href="/evenements" className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white cursor-pointer" style={{ backgroundColor: "var(--acogrami-green)" }}>
                  S&apos;inscrire <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
