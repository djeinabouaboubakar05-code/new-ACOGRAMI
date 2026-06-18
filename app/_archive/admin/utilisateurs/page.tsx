import { prisma } from "@/lib/prisma";
import UtilisateursTable from "@/components/admin/UtilisateursTable";

export default async function UtilisateursPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
        <p className="mt-2 text-zinc-400">Consultez et gérez les rôles de tous les membres de la plateforme.</p>
      </div>

      <UtilisateursTable initialUsers={users} />
    </div>
  );
}
