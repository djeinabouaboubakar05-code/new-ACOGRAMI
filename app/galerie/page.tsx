import { prisma } from "@/lib/prisma";
import GalerieClient from "./GalerieClient";

export const revalidate = 60;

export default async function GaleriePage() {
  let photos: any[] = [];
  try {
    const media = await prisma.galerieMedia.findMany({ orderBy: { createdAt: "desc" } });
    photos = media.map(m => ({
      id: m.id,
      titre: m.titre,
      image: m.urlFichier,
      createdAt: m.createdAt,
    }));
  } catch (error) {
    console.error("Failed to load galerie media from database:", error);
  }
  return <GalerieClient photos={photos} />;
}
