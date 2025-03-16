import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FacturePro</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/dashboard" className="text-gray-600 hover:text-gray-900">Tableau de bord</a></li>
              <li><a href="/clients" className="text-gray-600 hover:text-gray-900">Clients</a></li>
              <li><a href="/devis" className="text-gray-600 hover:text-gray-900">Devis</a></li>
              <li><a href="/factures" className="text-gray-600 hover:text-gray-900">Factures</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Bienvenue sur FacturePro
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Votre solution de gestion de facturation pour entreprise de peinture en bâtiment
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Gestion des clients</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Gérez facilement vos clients et leurs informations de contact.
                  </p>
                  <div className="mt-4">
                    <a href="/clients" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Voir les clients →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Création de devis</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Créez et gérez des devis professionnels pour vos clients.
                  </p>
                  <div className="mt-4">
                    <a href="/devis" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Voir les devis →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Facturation</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Générez des factures à partir de vos devis et suivez les paiements.
                  </p>
                  <div className="mt-4">
                    <a href="/factures" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Voir les factures →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="/dashboard" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Accéder au tableau de bord
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2025 FacturePro - Tous droits réservés
        </div>
      </footer>
    </div>
  );
}
