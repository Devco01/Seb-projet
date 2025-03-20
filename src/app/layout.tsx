import "./globals.css";
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'FacturePro - Gestion de facturation',
  description: 'Application de gestion de facturation pour entreprise de peinture en bâtiment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
