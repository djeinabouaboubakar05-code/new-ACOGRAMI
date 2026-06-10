import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Providers } from "./providers";
import { LayoutShell } from "@/components/layout/LayoutShell";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ACOGRAMI — Association Communauté Grand Mifi",
    template: "%s | ACOGRAMI",
  },
  description:
    "Association culturelle apolitique à Ngaoundéré. Promotion de la culture bamiléké, solidarité et vivre-ensemble entre 16 villages de la Mifi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={montserrat.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
