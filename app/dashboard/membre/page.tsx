import { AlertCircle, FileText, CheckCircle } from "lucide-react";

export default function MembreDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-[#133827]">Tableau de bord Membre</h1>
        <p className="text-gray-600 mt-2">Bienvenue dans votre espace personnel ACOGRAMI.</p>
      </header>

      {/* Stats / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-3 rounded-xl text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Statut</h3>
            <p className="text-2xl font-bold text-gray-900">En Règle</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="bg-orange-100 p-3 rounded-xl text-[#C55B2E]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Amendes à payer</h3>
            <p className="text-2xl font-bold text-gray-900">0 FCFA</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Dernière AG</h3>
            <p className="text-2xl font-bold text-gray-900">Présent</p>
          </div>
        </div>
      </div>

      {/* Section Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#133827]">Dernières notifications</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <p>Vous n'avez aucune notification récente.</p>
        </div>
      </div>
    </div>
  );
}
