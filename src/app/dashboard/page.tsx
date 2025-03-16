"use client";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FacturePro</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/dashboard" className="text-gray-600 hover:text-gray-900 font-bold">Tableau de bord</a></li>
              <li><a href="/clients" className="text-gray-600 hover:text-gray-900">Clients</a></li>
              <li><a href="/devis" className="text-gray-600 hover:text-gray-900">Devis</a></li>
              <li><a href="/factures" className="text-gray-600 hover:text-gray-900">Factures</a></li>
              <li><a href="/paiements" className="text-gray-600 hover:text-gray-900">Paiements</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tableau de bord
            </h1>
            <p className="text-base text-gray-500">
              Aperçu de votre activité
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Carte Chiffre d'affaires */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Chiffre d'affaires
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    45 600 €
                  </h2>
                </div>
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
              </div>
              <p className="text-sm text-green-600">
                +12% par rapport au mois dernier
              </p>
            </div>

            {/* Carte Devis en cours */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Devis en cours
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    8
                  </h2>
                </div>
                <div className="bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Valeur totale: 15 800 €
              </p>
            </div>

            {/* Carte Factures impayées */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Factures impayées
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    5
                  </h2>
                </div>
                <div className="bg-red-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Montant dû: 8 200 €
              </p>
            </div>

            {/* Carte Clients actifs */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Clients actifs
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    24
                  </h2>
                </div>
                <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                +3 nouveaux ce mois-ci
              </p>
            </div>
          </div>

          {/* Section Activité récente */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Activité récente
            </h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        15/06/2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Facture
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Dupont Construction
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        3 200 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Payée
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        12/06/2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Devis
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Martin Immobilier
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        5 800 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          En attente
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        10/06/2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Facture
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Petit Rénovation
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        2 400 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          En retard
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section Projets en cours */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Projets en cours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Rénovation appartement</h3>
                    <p className="text-sm text-gray-500">Client: Dupont Construction</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    En cours
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm font-medium text-gray-700">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Voir les détails →
                  </a>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Peinture bureaux</h3>
                    <p className="text-sm text-gray-500">Client: Martin Immobilier</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    En cours
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm font-medium text-gray-700">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Voir les détails →
                  </a>
                </div>
              </div>
            </div>
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