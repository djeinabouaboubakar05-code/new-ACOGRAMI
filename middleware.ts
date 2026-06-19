import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirection de sécurité si le rôle ne correspond pas au dossier demandé
    
    // Règle 1 : Seul l'Admin peut aller dans /dashboard/admin
    if (path.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/membre", req.url));
    }
    
    // Règle 2 : Le Responsable ou l'Admin peuvent aller dans /dashboard/responsable
    if (
      path.startsWith("/dashboard/responsable") && 
      token?.role !== "RESPONSABLE" && 
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard/membre", req.url));
    }
  },
  {
    callbacks: {
      // Autorise l'accès uniquement si un token existe (l'utilisateur est connecté)
      authorized: ({ token }) => !!token,
    },
    pages: {
      // Redirige vers la page de login de ta vitrine si non connecté
      signIn: "/login",
    }
  }
);

// Cette ligne indique à Next.js QUELLES pages surveiller.
// Ici : Absolument tout ce qui commence par /dashboard
export const config = {
  matcher: ["/dashboard/:path*"]
};
