import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { HOME_IMAGES } from "@/lib/images/home";
import { ArrowRight } from "lucide-react";

export async function VillagesGrid() {
  let villages: any[] = [];
  try {
    villages = await prisma.village.findMany({ orderBy: { nom: 'asc' } });
  } catch (error) {
    console.error("Failed to load villages for grid:", error);
  }

  return (
    <section className="bg-acogrami-light py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-10">
          Les 16 villages du Grand Mifi
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 justify-center">
          {villages.map((village, idx) => (
            <Link
              key={village.id}
              href={`/apropos#${village.slug}`}
              className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-1"
            >
              <div className="rounded-xl border-[3px] border-acogrami-green bg-acogrami-green/5 p-1 shadow-sm transition-shadow group-hover:shadow-md group-hover:border-acogrami-green">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-lg">
                  <Image
                    src={village.image || HOME_IMAGES.villages[idx % HOME_IMAGES.villages.length]}
                    alt={`Village ${village.nom}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 80px"
                  />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-acogrami-accent">
                {village.nom}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/apropos"
            className="inline-flex items-center gap-2 rounded bg-[#D97736] px-6 py-3 font-bold text-white transition hover:bg-[#b86129]"
          >
            Parcourir nos villages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
