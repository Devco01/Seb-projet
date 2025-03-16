import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FacturePro - Gestion de facturation',
  description: 'Application de gestion de devis, factures et clients pour entreprise de peinture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
