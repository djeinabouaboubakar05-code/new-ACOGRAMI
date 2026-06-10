'use client'

interface Actualite {
  id: string;
  titre: string;
  extrait: string | null;
  categorie: string;
  image: string | null;
  createdAt: Date;
}

interface NewsGridProps {
  activeCategory: string;
  actualites: Actualite[];
}

const CATEGORIE_LABELS: Record<string, string> = {
  evenements: "Événement",
  culture: "Culture",
  projets: "Projet",
  communaute: "Communauté",
  actualite: "Actualité",
};

const PLACEHOLDER_GRADIENT: Record<string, string> = {
  culture: "from-acogrami-green to-acogrami-earth",
  projets: "from-acogrami-accent to-acogrami-earth",
  evenements: "from-acogrami-earth to-acogrami-green",
};

export default function NewsGrid({ activeCategory, actualites }: NewsGridProps) {
  const filteredNews = actualites.filter((item) => {
    if (activeCategory === "tous") return true;
    return item.categorie === activeCategory;
  });

  if (filteredNews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucune actualité trouvée pour cette catégorie.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredNews.map((item) => (
        <article
          key={item.id}
          className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow duration-300"
        >
          {item.image ? (
            <img src={item.image} alt={item.titre} className="h-48 w-full object-cover" />
          ) : (
            <div className={`h-48 w-full bg-linear-to-br ${PLACEHOLDER_GRADIENT[item.categorie] ?? "from-zinc-300 to-zinc-400"} flex items-center justify-center`}>
              <span className="text-white/80 font-medium uppercase tracking-wider text-sm">
                Image à venir
              </span>
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-acogrami-accent uppercase tracking-wider">
                {CATEGORIE_LABELS[item.categorie] || item.categorie}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            </div>

            <h3 className="text-xl font-bold text-card-foreground mb-2 leading-tight hover:text-acogrami-green transition-colors cursor-pointer">
              {item.titre}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
              {item.extrait || (item as any).contenu}
            </p>

            <button className="text-sm font-medium text-acogrami-green hover:text-acogrami-earth transition-colors flex items-center gap-1 cursor-pointer">
              Lire la suite
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
