import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">FacturePro - Peinture en bâtiment</h1>
      
      <div className="mb-8">
        <p className="text-lg mb-4">
          Bienvenue sur votre espace de gestion. Cette page est une version statique sans connexion à la base de données.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Link href="/accueil" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Aller à l'accueil complet
          </Link>
          <Link href="/test-home" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Tester la connexion
          </Link>
          <Link href="/diagnostic" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Diagnostic
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Devis en cours</h2>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Factures impayées</h2>
          <p className="text-3xl font-bold text-red-600">--</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Clients actifs</h2>
          <p className="text-3xl font-bold text-green-600">--</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Chiffre d'affaires</h2>
          <p className="text-3xl font-bold text-purple-600">--</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Liens rapides</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/clients" className="text-blue-500 hover:underline">
                Gestion des clients
              </Link>
            </li>
            <li>
              <Link href="/devis" className="text-blue-500 hover:underline">
                Gestion des devis
              </Link>
            </li>
            <li>
              <Link href="/factures" className="text-blue-500 hover:underline">
                Gestion des factures
              </Link>
            </li>
            <li>
              <Link href="/paiements" className="text-blue-500 hover:underline">
                Gestion des paiements
              </Link>
            </li>
            <li>
              <Link href="/parametres" className="text-blue-500 hover:underline">
                Paramètres
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Informations</h2>
          <p className="mb-4">
            Cette page est une version statique de la page d'accueil, créée pour contourner les problèmes de connexion à la base de données.
          </p>
          <p>
            Utilisez les liens de diagnostic pour tester la connexion à la base de données et identifier les problèmes.
          </p>
        </div>
      </div>
      
      <footer className="mt-8 pt-4 border-t text-center text-gray-500">
        <p>© 2025 FacturePro - Peinture en bâtiment</p>
      </footer>
    </div>
  );
}
