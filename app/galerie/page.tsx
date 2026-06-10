import { prisma } from "@/lib/prisma";
import GalerieClient from "./GalerieClient";

export const revalidate = 60;

export default async function GaleriePage() {
  const photos = await prisma.galerie.findMany({ orderBy: { createdAt: "desc" } });
  return <GalerieClient photos={photos} />;
}
