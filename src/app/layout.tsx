import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FacturePro - Logiciel de facturation pour auto-entrepreneurs',
  description: 'Solution professionnelle de facturation et gestion conforme aux normes françaises pour auto-entrepreneurs',
  keywords: 'facturation, auto-entrepreneur, micro-entreprise, factures, devis, logiciel de facturation, comptabilité',
  authors: [{ name: 'FacturePro' }],
  creator: 'FacturePro',
  publisher: 'FacturePro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://facturepro.vercel.app'),
  openGraph: {
    title: 'FacturePro - Logiciel de facturation pour auto-entrepreneurs',
    description: 'Solution professionnelle de facturation et gestion conforme aux normes françaises pour auto-entrepreneurs',
    url: 'https://facturepro.vercel.app',
    siteName: 'FacturePro',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
