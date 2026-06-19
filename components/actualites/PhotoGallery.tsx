import { prisma } from "@/lib/prisma";

export default async function PhotoGallery() {
  const media = await prisma.galerieMedia.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
  const photos = media.map(m => ({
    id: m.id,
    titre: m.titre,
    image: m.urlFichier,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4" style={{ backgroundColor: '#1B4D3E' }}>
        <h2 className="text-xl font-bold" style={{ color: '#CC7722' }}>
          Galerie photos
        </h2>
        <p className="text-gray-300 text-sm mt-1">
          Nos moments forts en images
        </p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.length > 0 ? photos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square rounded-lg overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer bg-cover bg-center"
              style={{ backgroundImage: `url('${photo.image}')` }}
              title={photo.titre || undefined}
            />
          )) : Array.from({ length: 8 }, (_, i) => (
            <div
              key={`placeholder-${i}`}
              className="aspect-square rounded-lg overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)' }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="text-gray-600 text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                  Photo à venir
                </span>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-6">
            Plus de photos à venir prochainement...
          </p>
        )}
      </div>
    </div>
  );
}
