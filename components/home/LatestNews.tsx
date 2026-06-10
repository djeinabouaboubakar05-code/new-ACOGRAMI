import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HOME_IMAGES } from "@/lib/images/home";

export async function LatestNews() {
  const actualites = await prisma.actualite.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  if (actualites.length === 0) return null;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="flex flex-wrap items-end justify-between gap-4 mb-12 pb-4" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <h2 className="text-3xl font-bold text-foreground">
            Dernières actualités
          </h2>
          <Link
            href="/actualites"
            className="font-bold text-[#D97736] hover:text-[#b86129] flex items-center gap-1"
          >
            Voir toutes
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {actualites.map((item, idx) => {
            const day = item.createdAt.toLocaleDateString("fr-FR", { day: "2-digit" });
            const month = item.createdAt.toLocaleDateString("fr-FR", { month: "short" }).replace('.', '');

            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-all hover:shadow-xl border border-border"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={item.image || HOME_IMAGES.news[idx % HOME_IMAGES.news.length]}
                    alt={item.titre}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute top-4 left-4 bg-[#D97736] text-white flex flex-col items-center justify-center w-14 h-14 rounded shadow-lg z-10">
                    <span className="text-xl font-black leading-none">{day}</span>
                    <span className="text-xs font-medium uppercase mt-0.5">{month}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-bold text-xl text-card-foreground mb-3 line-clamp-2">
                    {item.titre}
                  </h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground mb-6 flex-1">
                    {item.extrait}
                  </p>

                  <Link
                    href={`/actualites/${item.id}`}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#D97736] hover:text-[#b86129] group-hover:gap-3 transition-all"
                  >
                    Lire l'article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
