import { prisma } from "@/lib/prisma";
import { Phone, Mail } from "lucide-react";

export async function BureauSection() {
  const membres = await prisma.membreBureau.findMany({ orderBy: { ordre: "asc" } });
  if (membres.length === 0) return null;

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <span className="text-sm font-bold tracking-widest uppercase mb-2 block" style={{ color: "var(--acogrami-accent)" }}>L&apos;ÉQUIPE</span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Le bureau</h2>
        <p className="mt-3 max-w-xl mx-auto" style={{ color: "var(--muted-foreground)" }}>
          L&apos;équipe dirigeante qui œuvre chaque jour pour le rayonnement de l&apos;ACOGRAMI.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {membres.map((membre, idx) => (
          <div key={membre.id} className="flex flex-col items-center text-center group">
            {membre.photo ? (
              <img src={membre.photo} alt={`${membre.prenom} ${membre.nom}`} className="w-24 h-24 rounded-full object-cover border-4 shadow-lg mb-4 group-hover:scale-105 transition-transform" style={{ borderColor: "var(--card-border)" }} />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 shadow-lg mb-4 group-hover:scale-105 transition-transform flex items-center justify-center font-bold text-2xl text-white" style={{ backgroundColor: "var(--acogrami-green)", borderColor: "var(--background)" }}>
                {membre.prenom[0]}{membre.nom[0]}
              </div>
            )}
            <h3 className="font-bold text-sm leading-tight mb-1" style={{ color: "var(--foreground)" }}>
              {membre.prenom} {membre.nom}
            </h3>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--acogrami-accent)" }}>{membre.fonction}</p>
            {membre.telephone && (
              <a href={`tel:${membre.telephone}`} className="flex items-center gap-1 text-xs transition-colors hover:underline" style={{ color: "var(--muted-foreground)" }}>
                <Phone className="h-3 w-3" />{membre.telephone}
              </a>
            )}
            {membre.email && (
              <a href={`mailto:${membre.email}`} className="flex items-center gap-1 text-xs mt-1 break-all transition-colors hover:underline" style={{ color: "var(--muted-foreground)" }}>
                <Mail className="h-3 w-3" />{membre.email}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
