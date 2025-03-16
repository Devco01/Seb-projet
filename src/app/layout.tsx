import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FacturePro - Facturation pour peintres en bâtiment",
  description: "Application de facturation pour peintres en bâtiment auto-entrepreneurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geist.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
