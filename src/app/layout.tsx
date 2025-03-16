import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FacturePro - Gestion de facturation',
  description: 'Application de gestion de facturation pour entreprise de peinture en bâtiment',
  icons: {
    icon: { url: '/icon.png', type: 'image/png' },
    shortcut: { url: '/icon.png', type: 'image/png' },
  },
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
