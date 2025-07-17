import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

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
        <Script id="chromebook-scroll-fix" strategy="afterInteractive">
          {`
            // Détection et correction du scroll pour Chromebook
            function fixChromebookScroll() {
              const isChromebook = navigator.userAgent.includes('CrOS');
              const isChrome = navigator.userAgent.includes('Chrome');
              
              if (isChromebook || isChrome) {
                // Force les propriétés de scroll sur les éléments principaux
                document.documentElement.style.overflowY = 'auto';
                document.documentElement.style.height = 'auto';
                document.documentElement.style.minHeight = '100%';
                
                document.body.style.overflowY = 'auto';
                document.body.style.height = 'auto';
                document.body.style.minHeight = '100vh';
                document.body.style.position = 'relative';
                
                // Correction pour les conteneurs Next.js
                const nextRoot = document.getElementById('__next');
                if (nextRoot) {
                  nextRoot.style.overflowY = 'auto';
                  nextRoot.style.height = 'auto';
                  nextRoot.style.minHeight = '100vh';
                }
                
                // Correction pour les éléments main
                const mains = document.querySelectorAll('main');
                mains.forEach(main => {
                  main.style.overflowY = 'auto';
                  main.style.height = 'auto';
                  main.style.minHeight = '100vh';
                });
                
                console.log('Corrections scroll Chromebook appliquées');
              }
            }
            
            // Appliquer les corrections
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', fixChromebookScroll);
            } else {
              fixChromebookScroll();
            }
            
            // Réappliquer après navigation (pour Next.js)
            if (typeof window !== 'undefined') {
              window.addEventListener('popstate', fixChromebookScroll);
              
              // Observer les changements de DOM pour Next.js
              const observer = new MutationObserver(function(mutations) {
                let shouldFix = false;
                mutations.forEach(function(mutation) {
                  if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldFix = true;
                  }
                });
                if (shouldFix) {
                  setTimeout(fixChromebookScroll, 100);
                }
              });
              
              observer.observe(document.body, {
                childList: true,
                subtree: true
              });
            }
          `}
        </Script>
        <Script id="print-handler" strategy="afterInteractive">
          {`
            window.preparePrint = function() {
              const printStyle = document.createElement('style');
              printStyle.id = 'print-style-fix';
              printStyle.innerHTML = \`
                @media print {
                  body > *:not(#printable-document) {
                    display: none !important;
                  }
                  #printable-document {
                    display: block !important;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                  }
                  @page {
                    size: A4;
                    margin: 0mm;
                  }
                  #printable-document .printOnly {
                    padding: 15mm;
                  }
                }
              \`;
              document.head.appendChild(printStyle);
              
              // Suppression de l'entête et du pied de page du navigateur
              const originalTitle = document.title;
              document.title = ' ';
              
              // Appliquer window.print
              window.print();
              
              // Nettoyer après l'impression
              setTimeout(function() {
                document.title = originalTitle;
                const style = document.getElementById('print-style-fix');
                if (style) style.remove();
              }, 1000);
            }
          `}
        </Script>
      </body>
    </html>
  )
}
