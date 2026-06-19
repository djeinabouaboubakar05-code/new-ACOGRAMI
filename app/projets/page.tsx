import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, FolderHeart } from "lucide-react";

export const metadata: Metadata = {
  title: "Projets | ACOGRAMI",
};

export default async function ProjetsPage() {
  let projets: any[] = [];
  try {
    projets = await prisma.projet.findMany({
      orderBy: { createdAt: "desc" },
      include: { admin: true }
    });
  } catch (error) {
    console.error("Failed to load projets from database:", error);
  }

  return (
    <div className="bg-background min-h-[calc(100vh-64px)] py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold" style={{ color: "var(--acogrami-green)" }}>Projets Communautaires</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez tous les projets portés par l'association pour le développement socio-culturel et économique des 16 villages du Grand Mifi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projets.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-12">Aucun projet publié pour le moment.</p>
          ) : (
            projets.map(p => (
              <div key={p.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-acogrami-accent/10 rounded-xl text-acogrami-accent shrink-0">
                      <FolderHeart className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground line-clamp-2">{p.titre}</h2>
                  </div>
                  <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">{p.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                  <span className="text-xs font-semibold text-muted-foreground">Projet de : {p.admin.prenom} {p.admin.nom}</span>
                  <Link href={`/projets/${p.id}`} className="text-sm font-bold text-acogrami-green hover:text-acogrami-earth transition-colors flex items-center gap-1">
                    Détails <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
