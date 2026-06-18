import Link from "next/link";
import { Home, Users, Settings, LogOut, Bell, Shield } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F5F2EA] font-sans">
      {/* Sidebar - Charte Graphique Vert Forêt */}
      <aside className="w-64 bg-[#133827] text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-green-800/50">
          <h1 className="text-2xl font-bold tracking-wider">ACOGRAMI</h1>
          <p className="text-sm text-green-200/70 mt-1">Espace de gestion</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          <Link href="/dashboard/membre" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#C55B2E] transition-colors group">
            <Home className="w-5 h-5 text-green-200 group-hover:text-white" />
            <span className="font-medium">Accueil Membre</span>
          </Link>
          <Link href="/dashboard/responsable" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#C55B2E] transition-colors group">
            <Users className="w-5 h-5 text-green-200 group-hover:text-white" />
            <span className="font-medium">Mon Village</span>
          </Link>
          <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#C55B2E] transition-colors group">
            <Shield className="w-5 h-5 text-green-200 group-hover:text-white" />
            <span className="font-medium">Administration</span>
          </Link>
          <Link href="/dashboard/membre" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#C55B2E] transition-colors group">
            <Bell className="w-5 h-5 text-green-200 group-hover:text-white" />
            <span className="font-medium">Notifications</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-green-800/50">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-green-200 hover:text-white hover:bg-green-800/50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 text-gray-800">
        {children}
      </main>
    </div>
  );
}
