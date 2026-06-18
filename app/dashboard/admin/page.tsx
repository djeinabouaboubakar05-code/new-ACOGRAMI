import { Shield, Megaphone, Calendar, History } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#C55B2E]" />
          <h1 className="text-3xl font-bold text-[#133827]">Supervision Globale</h1>
        </div>
        <p className="text-gray-600 mt-2">Bureau Exécutif - Assemblées Générales, Événements et Audit.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Module AG */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <Calendar className="text-[#133827] w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Assemblées Générales</h2>
          <p className="text-gray-500 text-sm mb-6 h-10">Planifiez et convoquez les 16 villages pour la prochaine AG.</p>
          <button className="w-full bg-[#133827] text-white px-4 py-2.5 rounded-xl hover:bg-[#0c2319] transition-colors font-medium">
            Préparer l'AG
          </button>
        </div>

        {/* Module Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
            <Megaphone className="text-[#C55B2E] w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Notifications Massives</h2>
          <p className="text-gray-500 text-sm mb-6 h-10">Envoyez des alertes ou des rappels à tout ou partie des membres.</p>
          <button className="w-full bg-[#C55B2E] text-white px-4 py-2.5 rounded-xl hover:bg-[#a84d26] transition-colors font-medium">
            Créer une notification
          </button>
        </div>

        {/* Module Audit */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
            <History className="text-gray-600 w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Journal d'Audit</h2>
          <p className="text-gray-500 text-sm mb-6 h-10">Consultez l'historique de toutes les actions (Qui a fait quoi ?).</p>
          <button className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-medium">
            Voir le journal (Logs)
          </button>
        </div>
      </div>
    </div>
  );
}
