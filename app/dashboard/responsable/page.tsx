import { Users, FilePlus, UserCheck } from "lucide-react";

export default function ResponsableDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#133827]">Gestion du Village</h1>
          <p className="text-gray-600 mt-2">Espace exclusif au Responsable (Chef/Président).</p>
        </div>
        <button className="bg-[#C55B2E] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#a84d26] transition-colors shadow-sm font-medium">
          <FilePlus className="w-5 h-5" />
          Valider une adhésion
        </button>
      </header>

      {/* Liste des membres */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="text-[#133827] w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">Membres du village</h2>
          </div>
          <span className="bg-orange-100 text-[#C55B2E] text-xs font-bold px-3 py-1 rounded-full">
            2 en attente
          </span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {/* Faux membre en attente (Placeholder) */}
          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                JD
              </div>
              <div>
                <p className="font-semibold text-gray-900">Jean Dupont</p>
                <p className="text-sm text-gray-500">Demande d'adhésion reçue hier</p>
              </div>
            </div>
            <button className="text-[#133827] hover:text-[#C55B2E] transition-colors p-2" title="Examiner le dossier">
              <UserCheck className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
