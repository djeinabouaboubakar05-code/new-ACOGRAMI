import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FolderOpen } from "lucide-react";
import { ProjetsAdminList } from "@/components/admin/ProjetsAdminList";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Projets | Administration ACOGRAMI" };

export default async function AdminProjets() {
  const projets = await prisma.projet.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3"><FolderOpen className="h-7 w-7 text-acogrami-accent" />Projets soumis</h1>
        <p className="mt-2 text-zinc-400">{projets.length} projet{projets.length > 1 ? "s" : ""}</p>
      </div>

      <ProjetsAdminList initialProjets={projets.map(p => ({
        id: p.id,
        titre: p.titre,
        description: p.description,
        statut: p.statut,
        soumisPar: p.soumisPar,
        createdAt: p.createdAt.toISOString()
      }))} />
    </div>
  );
}
