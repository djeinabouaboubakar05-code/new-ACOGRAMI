import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FolderHeart, Calendar } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const projet = await prisma.projet.findUnique({ where: { id } });
  if (!projet) return { title: "Projet non trouvé" };
  return { title: `${projet.titre} | Projets ACOGRAMI` };
}

export default async function ProjetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projet = await prisma.projet.findUnique({
    where: { id },
    include: {
      admin: true
    }
  });

  if (!projet) notFound();

  const session = await getServerSession(authOptions);

  return (
    <div className="bg-background min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-acogrami-green/10 rounded-2xl text-acogrami-green shrink-0">
              <FolderHeart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{projet.titre}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {new Date(projet.createdAt).toLocaleDateString("fr-FR")}
                </span>
                <span className="font-semibold text-acogrami-accent">Projet de : {projet.admin.prenom} {projet.admin.nom}</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
            {projet.description}
          </div>
        </div>
      </div>
    </div>
  );
}
