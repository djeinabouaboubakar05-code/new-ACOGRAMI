"use client";

import Link from "next/link";
import { MapPin, Users, ChevronRight } from "lucide-react";

interface VillageData {
  id: string;
  nom: string;
  slug: string;
  _count: { membres: number };
}

interface VillagesAdminClientProps {
  initialVillages: VillageData[];
}

export function VillagesAdminClient({ initialVillages }: VillagesAdminClientProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {initialVillages.map((v) => {
        const count = v._count.membres;
        return (
          <Link
            key={v.id}
            href={`/admin/villages/${v.slug}`}
            className="bg-card-bg rounded-2xl border border-card-border p-5 hover:border-acogrami-accent/40 hover:shadow-lg hover:shadow-acogrami-accent/5 transition-all group relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-acogrami-green/20 group-hover:bg-acogrami-accent/20 transition-colors">
                <MapPin className="h-4 w-4 text-acogrami-green group-hover:text-acogrami-accent transition-colors" />
              </div>
              <h3 className="font-bold text-foreground group-hover:text-acogrami-accent transition-colors">{v.nom}</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Users className="h-3.5 w-3.5" />
                <span>{count} membre{count > 1 ? "s" : ""}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-acogrami-accent transition-all group-hover:translate-x-0.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
