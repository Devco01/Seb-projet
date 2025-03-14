"use client";

import Layout from '../components/Layout';
import Link from 'next/link';
import { FaFileInvoiceDollar, FaFileAlt, FaUsers, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';

export default function Dashboard() {
  // Données fictives pour le tableau de bord
  const stats = [
    { name: 'Devis en attente', value: '3', icon: <FaFileAlt className="w-8 h-8 text-blue-500" />, href: '/devis' },
    { name: 'Factures impayées', value: '5', icon: <FaFileInvoiceDollar className="w-8 h-8 text-red-500" />, href: '/factures' },
    { name: 'Clients actifs', value: '12', icon: <FaUsers className="w-8 h-8 text-green-500" />, href: '/clients' },
    { name: 'Paiements reçus (mois)', value: '2 850 €', icon: <FaMoneyBillWave className="w-8 h-8 text-yellow-500" />, href: '/paiements' },
    { name: 'Chiffre d\'affaires (année)', value: '32 450 €', icon: <FaChartBar className="w-8 h-8 text-purple-500" />, href: '/rapports' },
  ];

  // Données fictives pour les activités récentes
  const recentActivities = [
    { id: 1, type: 'Facture', number: 'F-2023-042', client: 'Dupont SAS', amount: '1 250 €', date: '15/03/2023', status: 'Payée' },
    { id: 2, type: 'Devis', number: 'D-2023-056', client: 'Martin Immobilier', amount: '2 780 €', date: '12/03/2023', status: 'En attente' },
    { id: 3, type: 'Facture', number: 'F-2023-041', client: 'Résidences du Parc', amount: '950 €', date: '08/03/2023', status: 'Impayée' },
    { id: 4, type: 'Devis', number: 'D-2023-055', client: 'Dubois et Fils', amount: '1 850 €', date: '05/03/2023', status: 'Accepté' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Activités récentes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Activités récentes</h2>
            <Link href="/rapports" className="text-sm text-blue-600 hover:text-blue-800">
              Voir tout
            </Link>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {activity.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${activity.status === 'Payée' ? 'bg-green-100 text-green-800' : 
                            activity.status === 'Impayée' ? 'bg-red-100 text-red-800' : 
                            activity.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Actions rapides</h3>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/devis/nouveau"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Créer un devis
              </Link>
              <Link
                href="/factures/nouveau"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Créer une facture
              </Link>
              <Link
                href="/clients/nouveau"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Ajouter un client
              </Link>
              <Link
                href="/paiements/nouveau"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Enregistrer un paiement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 