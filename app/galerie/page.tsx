import { prisma } from "@/lib/prisma";
import GalerieClient from "./GalerieClient";

export const revalidate = 60;

export default async function GaleriePage() {
  const media = await prisma.galerieMedia.findMany({ orderBy: { createdAt: "desc" } });
  const photos = media.map(m => ({
    id: m.id,
    titre: m.titre,
    image: m.urlFichier,
    createdAt: m.createdAt,
  }));
  return <GalerieClient photos={photos} />;
}
