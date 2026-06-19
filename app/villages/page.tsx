import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowRight, Home } from "lucide-react";

export const revalidate = 3600;

const VILLAGE_COLORS = [
  "#16a34a", "#2563eb", "#dc2626", "#d97706",
  "#7c3aed", "#0891b2", "#be185d", "#15803d",
  "#1d4ed8", "#b45309", "#6d28d9", "#0e7490",
];

export default async function VillagesPage() {
  let villages: any[] = [];
  try {
    villages = await prisma.village.findMany({ orderBy: { nom: "asc" } });
  } catch (error) {
    console.error("Failed to load villages from database:", error);
  }

  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center relative overflow-hidden" style={{ backgroundColor: "var(--background-alt)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(var(--acogrami-green) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)", color: "var(--acogrami-green)" }}>
            <MapPin className="h-4 w-4" />
            Nos villages
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: "var(--foreground)" }}>
            16 villages du Grand Mifi
          </h1>
          <p className="text-lg" style={{ color: "var(--foreground-subtle)" }}>
            L&apos;ACOGRAMI regroupe les ressortissants de 16 villages bamilékés installés à Ngaoundéré. Chaque village apporte sa culture et son identité unique à notre communauté.
          </p>
        </div>
      </section>

      {/* Villages grid */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        {villages.length === 0 ? (
          <div className="text-center py-24">
            <Home className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
            <p className="text-lg font-semibold" style={{ color: "var(--muted-foreground)" }}>Les villages sont en cours d&apos;ajout.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {villages.map((village, idx) => {
              const color = VILLAGE_COLORS[idx % VILLAGE_COLORS.length];
              return (
                <Link
                  key={village.id}
                  href={`/villages/${village.slug}`}
                  className="group rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}
                >
                  {village.image ? (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={village.image}
                        alt={village.nom}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-44 flex items-center justify-center text-5xl font-extrabold text-white/90"
                      style={{ backgroundColor: color }}
                    >
                      {village.nom[0]}
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-bold text-lg" style={{ color: "var(--card-foreground)" }}>{village.nom}</h2>
                        {village.description && (
                          <p className="text-sm mt-1.5 line-clamp-3" style={{ color: "var(--muted-foreground)" }}>
                            {village.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" style={{ color }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA rejoindre */}
      <section className="py-16 px-4 text-center" style={{ backgroundColor: "var(--background-alt)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--foreground)" }}>Vous êtes ressortissant du Grand Mifi ?</h2>
          <p className="text-base mb-6" style={{ color: "var(--foreground-subtle)" }}>
            Rejoignez la communauté ACOGRAMI et participez à la vie de votre village depuis Ngaoundéré.
          </p>
          <Link
            href="/adhesion"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--acogrami-green)" }}
          >
            Demander mon adhésion
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
