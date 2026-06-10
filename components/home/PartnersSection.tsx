import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function PartnersSection() {
  const partenaires = await prisma.partenaire.findMany({ orderBy: { nom: 'asc' } });

  return (
    <section className="border-t border-zinc-200 bg-background py-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-foreground">
          Nos partenaires
        </h2>
        <p className="mt-4 text-muted-foreground">
          Ils nous soutiennent dans nos actions
        </p>
        {partenaires.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {partenaires.map((p) => (
              p.url ? (
                <Link key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                  className="flex h-20 w-40 items-center justify-center rounded-xl border border-border bg-card px-4 shadow-sm transition hover:shadow-md">
                  {p.logo ? (
                    <Image src={p.logo} alt={p.nom} width={120} height={48} className="max-h-12 w-auto object-contain" />
                  ) : (
                    <span className="text-sm font-semibold text-card-foreground">{p.nom}</span>
                  )}
                </Link>
              ) : (
                <div key={p.id}
                  className="flex h-20 w-40 items-center justify-center rounded-xl border border-border bg-card px-4 shadow-sm">
                  {p.logo ? (
                    <Image src={p.logo} alt={p.nom} width={120} height={48} className="max-h-12 w-auto object-contain" />
                  ) : (
                    <span className="text-sm font-semibold text-card-foreground">{p.nom}</span>
                  )}
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex h-20 w-40 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                Partenaire {i}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
