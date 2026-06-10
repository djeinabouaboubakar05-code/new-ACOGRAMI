'use client'

// Interface pour les props
interface NewsFiltersProps {
  active: string;           // Catégorie active (ex: "tous")
  onChange: (categorie: string) => void;  // Fonction appelée quand on clique
}

// Liste des catégories disponibles
const CATEGORIES = [
  { id: "tous", label: "Tous" },
  { id: "evenements", label: "Événements" },
  { id: "culture", label: "Culture" },
  { id: "projets", label: "Projets" },
  { id: "communaute", label: "Communauté" }
];

export default function NewsFilters({ active, onChange }: NewsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {CATEGORIES.map((categorie) => {
        const isActive = active === categorie.id;
        
        return (
          <button
            key={categorie.id}
            onClick={() => onChange(categorie.id)}
            className={`
              px-5 py-2 rounded-full font-medium transition-all duration-200
              ${isActive 
                ? "text-white"  // Actif : texte blanc
                : "border hover:bg-gray-100"  // Inactif : bordure + effet hover
              }
            `}
            style={{
              backgroundColor: isActive ? '#1B4D3E' : 'transparent',
              borderColor: isActive ? '#1B4D3E' : '#CC7722',
              borderWidth: '1px'
            }}
          >
            {categorie.label}
          </button>
        );
      })}
    </div>
  );
}