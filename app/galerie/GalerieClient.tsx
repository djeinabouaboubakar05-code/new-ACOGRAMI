"use client";

import { useState } from "react";
import { X, Images, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo { id: string; titre: string | null; image: string; createdAt: Date; }

export default function GalerieClient({ photos }: { photos: Photo[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  function prev() { setLightbox(i => (i === null ? null : i > 0 ? i - 1 : photos.length - 1)); }
  function next() { setLightbox(i => (i === null ? null : i < photos.length - 1 ? i + 1 : 0)); }

  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center relative overflow-hidden" style={{ backgroundColor: "var(--background-alt)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(var(--acogrami-green) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: "color-mix(in srgb, var(--acogrami-green) 12%, transparent)", color: "var(--acogrami-green)" }}>
            <Images className="h-4 w-4" />
            Galerie photos
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: "var(--foreground)" }}>
            Nos moments en images
          </h1>
          <p className="text-lg" style={{ color: "var(--foreground-subtle)" }}>
            Découvrez la vie de l&apos;ACOGRAMI à travers notre galerie photographique — événements culturels, réunions et activités communautaires.
          </p>
        </div>
      </section>

      {/* Grille */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        {photos.length === 0 ? (
          <div className="text-center py-24">
            <Images className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />
            <p className="text-lg font-semibold" style={{ color: "var(--muted-foreground)" }}>La galerie est en cours de construction.</p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>Revenez bientôt !</p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>{photos.length} photo{photos.length !== 1 ? "s" : ""}</p>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => setLightbox(idx)}
                  className="break-inside-avoid group relative cursor-pointer rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--card-border)" }}
                >
                  <img
                    src={photo.image}
                    alt={photo.titre || `Photo ${idx + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                    {photo.titre && (
                      <p className="text-white text-xs font-semibold line-clamp-2">{photo.titre}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fadeIn"
          onClick={e => { if (e.target === e.currentTarget) setLightbox(null); }}
        >
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
            <X className="h-6 w-6" />
          </button>
          <button onClick={prev} className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={next} className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="max-w-5xl max-h-[85vh] mx-16 flex flex-col items-center gap-3">
            <img
              src={photos[lightbox].image}
              alt={photos[lightbox].titre || `Photo ${lightbox + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-lg"
            />
            <div className="text-center">
              {photos[lightbox].titre && (
                <p className="text-white font-semibold">{photos[lightbox].titre}</p>
              )}
              <p className="text-white/60 text-sm">{lightbox + 1} / {photos.length}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
