import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Digital Explorers — Découvre le monde numérique",
  description: "Plateforme éducative africaine pour les jeunes de la 6e à la Terminale. 7 mondes, aventures interactives, gamification.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark" style={{ "--font-sans": inter.variable, "--font-display": spaceGrotesk.variable } as React.CSSProperties}>
      <body className={`${inter.className} bg-[#060810] text-white antialiased`}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
