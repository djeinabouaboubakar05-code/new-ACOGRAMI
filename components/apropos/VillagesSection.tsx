import Link from "next/link";
import { prisma } from "@/lib/prisma";

const COLORS = ["#16a34a","#2563eb","#dc2626","#d97706","#7c3aed","#0891b2","#be185d","#15803d","#1d4ed8","#b45309","#6d28d9","#0e7490","#b91c1c","#047857","#1e40af","#92400e"];

export async function VillagesSection() {
  let villages: any[] = [];
  try {
    villages = await prisma.village.findMany({ orderBy: { nom: "asc" } });
  } catch (error) {
    console.error("Failed to load villages for section:", error);
  }

  return (
    <section className="py-16" style={{ borderBottom: "1px solid var(--card-border)" }}>
      <div className="text-center mb-12">
        <span className="text-sm font-bold tracking-widest uppercase mb-2 block" style={{ color: "var(--acogrami-accent)" }}>NOS VILLAGES</span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Les 16 villages du Grand Mifi</h2>
        <p className="mt-3 max-w-2xl mx-auto" style={{ color: "var(--muted-foreground)" }}>
          L&apos;ACOGRAMI regroupe des membres issus de 16 villages du département de la Mifi. Chaque village est représenté au sein de l&apos;association.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 justify-center">
        {villages.map((village, idx) => (
          <Link
            key={village.id}
            href={`/villages/${village.slug}`}
            className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-1"
          >
            {village.image ? (
              <div
                className="h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-xl bg-cover bg-center shadow-sm group-hover:shadow-md transition-shadow"
                style={{ backgroundImage: `url('${village.image}')` }}
              />
            ) : (
              <div
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm group-hover:shadow-md transition-shadow"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              >
                {village.nom[0]}
              </div>
            )}
            <span className="text-xs sm:text-sm font-semibold text-center transition-colors" style={{ color: "var(--foreground)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--acogrami-accent)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--foreground)"}
            >
              {village.nom}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
