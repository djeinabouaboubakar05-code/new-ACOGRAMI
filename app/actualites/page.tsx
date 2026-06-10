import type { Metadata } from "next";
import ActualitesContent from "@/components/actualites/ActualitesContent";
import UpcomingEvents from "@/components/actualites/UpcomingEvents";
import PhotoGallery from "@/components/actualites/PhotoGallery";
import UpcomingProjects from "@/components/actualites/UpcomingProjects";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Restez informés des dernières nouvelles, événements et projets de l'Association de la Communauté Grand Mifi. Suivez l'actualité des 16 villages.",
  openGraph: {
    title: "Actualités ACOGRAMI",
    description: "Découvrez toute l'actualité de la communauté du Grand Mifi",
    type: "website",
  },
};

export default async function ActualitesPage() {
  const actualites = await prisma.actualite.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="bg-background">
      <div className="border-b border-acogrami-green/10 bg-acogrami-green py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-acogrami-accent">
            Actualités
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Découvrez les dernières nouvelles, événements et projets de la
            communauté du Grand Mifi. Restez connectés avec vos villages !
          </p>
        </div>
      </div>

      <main className="bg-acogrami-light min-h-screen py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ActualitesContent actualites={actualites} />
            </div>

            <div className="lg:col-span-1 space-y-8">
              <UpcomingEvents />
              <PhotoGallery />
              <UpcomingProjects />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
