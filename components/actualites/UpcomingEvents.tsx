import { prisma } from "@/lib/prisma";

export default async function UpcomingEvents() {
  const evenements = await prisma.evenement.findMany({
    where: { statut: "VALIDE" },
    orderBy: { date: 'asc' },
    take: 5,
  });

  if (evenements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Aucun événement à venir pour le moment.</p>
        <p className="text-gray-400 text-sm mt-2">Revenez bientôt !</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4" style={{ backgroundColor: '#1B4D3E' }}>
        <h2 className="text-xl font-bold" style={{ color: '#CC7722' }}>
          Événements à venir
        </h2>
        <p className="text-gray-300 text-sm mt-1">
          Ne manquez pas nos prochains rendez-vous
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {evenements.map((event) => {
          const dateStr = event.date.toLocaleDateString("fr-FR", {
            day: "numeric", month: "long", year: "numeric"
          });
          return (
            <div key={event.id} className="p-5 hover:bg-gray-50 transition-colors duration-200">
              <h3 className="font-bold text-lg mb-2" style={{ color: '#1B4D3E' }}>
                {event.titre}
              </h3>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-3 text-sm">
                <div className="flex items-center" style={{ color: '#A0522D' }}>
                  <span>{dateStr}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span>{event.lieu}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#F8F9FA', color: '#1B4D3E', border: '1px solid #CC7722' }}
                  >
                    Confirmé
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-gray-100" style={{ backgroundColor: '#F8F9FA' }}>
        <a href="/evenements" className="text-sm font-medium hover:underline flex items-center" style={{ color: '#CC7722' }}>
          Voir tous les événements
          <span className="ml-1">→</span>
        </a>
      </div>
    </div>
  );
}
