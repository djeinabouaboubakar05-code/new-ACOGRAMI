import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowLeft, Users } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const villages = await prisma.village.findMany({ select: { slug: true } });
  return villages.map(v => ({ slug: v.slug }));
}

export default async function VillageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const village = await prisma.village.findUnique({ where: { slug } });
  if (!village) notFound();

  const membresCount = await prisma.user.count({ where: { villageId: village.id } });

  return (
    <>
      {/* Hero village */}
      <section className="relative min-h-[40vh] flex items-end overflow-hidden">
        {village.image ? (
          <>
            <img src={village.image} alt={village.nom} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--acogrami-green) 0%, var(--acogrami-accent) 100%)" }} />
        )}
        <div className="relative w-full max-w-5xl mx-auto px-6 py-12">
          <Link
            href="/villages"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Tous les villages
          </Link>
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-white/80" />
                <span className="text-white/80 text-sm font-medium">Village du Grand Mifi</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">{village.nom}</h1>
            </div>
            {membresCount > 0 && (
              <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white">
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">{membresCount} membre{membresCount > 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-8" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--card-foreground)" }}>À propos du village</h2>
              {village.description ? (
                <div className="prose prose-sm max-w-none">
                  <p className="leading-relaxed whitespace-pre-wrap" style={{ color: "var(--muted-foreground)" }}>
                    {village.description}
                  </p>
                </div>
              ) : (
                <p className="italic" style={{ color: "var(--muted-foreground)" }}>
                  Les informations sur ce village seront bientôt disponibles.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
              <h3 className="font-bold mb-4" style={{ color: "var(--card-foreground)" }}>Communauté</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)" }}>
                  <Users className="h-5 w-5" style={{ color: "var(--acogrami-green)" }} />
                </div>
                <div>
                  <p className="font-semibold text-lg" style={{ color: "var(--card-foreground)" }}>{membresCount}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>membre{membresCount > 1 ? "s" : ""} ACOGRAMI</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--card)", borderColor: "var(--card-border)" }}>
              <h3 className="font-bold mb-3" style={{ color: "var(--card-foreground)" }}>Vous êtes de {village.nom} ?</h3>
              <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
                Rejoignez les ressortissants de votre village au sein de l&apos;ACOGRAMI à Ngaoundéré.
              </p>
              <Link
                href="/adhesion"
                className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--acogrami-green)" }}
              >
                Rejoindre l&apos;association
              </Link>
            </div>

            <Link
              href="/villages"
              className="flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: "var(--acogrami-green)" }}
            >
              <ArrowLeft className="h-4 w-4" />
              Voir tous les villages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
