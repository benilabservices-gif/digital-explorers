import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://digital-explorers-sand.vercel.app"),
  title: {
    default: "Digital Explorers — Découvre le monde numérique",
    template: "%s · Digital Explorers",
  },
  description:
    "Plateforme éducative panafricaine pour les 12-18 ans : des mondes à explorer (Web, IA, Code, Blockchain, Création…), des aventures interactives, un coach IA et un suivi parental. De la 6e à la Terminale.",
  keywords: [
    "éducation numérique",
    "Afrique",
    "jeunes",
    "apprendre à coder",
    "intelligence artificielle",
    "cybersécurité",
    "gamification",
    "collège",
    "lycée",
  ],
  openGraph: {
    type: "website",
    siteName: "Digital Explorers",
    locale: "fr_FR",
    title: "Digital Explorers — Découvre le monde numérique",
    description:
      "7 mondes, des guides compagnons, des aventures interactives et un coach IA : trouve ta voie, imagine ton futur.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${bricolage.variable} ${jetbrains.variable}`}
    >
      <body className="bg-night-950 text-ink font-sans antialiased">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
