import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "55coffee — Beyond Coffee",
  description:
    "Born in Oman, crafted for every cup. Traceable beans, roasted in-house at the Volcano Roastery in Khazaen, poured across 29 branches nationwide.",
  openGraph: {
    title: "55coffee — Beyond Coffee",
    description: "Espresso meets Oman. 29 branches, one roastery, zero shortcuts.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
