"use client";

import Layout from '../components/Layout';
import Link from 'next/link';
import { FaDownload, FaChartBar, FaChartPie, FaChartLine, FaFileExport, FaCalendarAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function Rapports() {
  const [period, setPeriod] = useState('month');
  
  // Données fictives pour les statistiques
  const stats = [
    { name: 'Chiffre d\'affaires', value: '8 750 €', period: 'ce mois-ci', change: '+12%', trend: 'up' },
    { name: 'Factures émises', value: '15', period: 'ce mois-ci', change: '+5', trend: 'up' },
    { name: 'Taux de conversion devis', value: '68%', period: 'ce mois-ci', change: '+3%', trend: 'up' },
    { name: 'Délai de paiement moyen', value: '12 jours', period: 'ce mois-ci', change: '-2 jours', trend: 'up' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Rapports et analyses</h1>
          <div className="flex space-x-2">
            <select
              id="period"
              name="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="month">Ce mois-ci</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
              <option value="custom">Période personnalisée</option>
            </select>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaDownload className="mr-2" /> Exporter
            </button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.trend === 'up' ? (
                            <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className="sr-only">{stat.trend === 'up' ? 'Augmentation' : 'Diminution'} de</span>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">
                    {stat.period}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Chiffre d'affaires */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Évolution du chiffre d'affaires</h2>
              <FaChartLine className="h-5 w-5 text-gray-400" />
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Graphique d'évolution du chiffre d'affaires</p>
              </div>
            </div>
          </div>

          {/* Répartition des clients */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Répartition des clients</h2>
              <FaChartPie className="h-5 w-5 text-gray-400" />
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Graphique de répartition des clients</p>
              </div>
            </div>
          </div>

          {/* Taux de conversion des devis */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Taux de conversion des devis</h2>
              <FaChartBar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Graphique de taux de conversion des devis</p>
              </div>
            </div>
          </div>

          {/* Délais de paiement */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Délais de paiement</h2>
              <FaCalendarAlt className="h-5 w-5 text-gray-400" />
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Graphique des délais de paiement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rapports disponibles */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Rapports disponibles</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Générez et téléchargez des rapports détaillés pour votre activité.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaFileExport className="h-5 w-5 text-gray-400 mr-3" />
                      <p className="text-sm font-medium text-indigo-600 truncate">Rapport de chiffre d'affaires</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Générer
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Détail du chiffre d'affaires par période et par client
                      </p>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaFileExport className="h-5 w-5 text-gray-400 mr-3" />
                      <p className="text-sm font-medium text-indigo-600 truncate">Rapport des factures impayées</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Générer
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Liste des factures impayées avec détail des retards
                      </p>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaFileExport className="h-5 w-5 text-gray-400 mr-3" />
                      <p className="text-sm font-medium text-indigo-600 truncate">Rapport des clients</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Générer
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Analyse détaillée des clients et de leur activité
                      </p>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaFileExport className="h-5 w-5 text-gray-400 mr-3" />
                      <p className="text-sm font-medium text-indigo-600 truncate">Rapport pour comptable</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Générer
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Synthèse financière pour votre comptable
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
} 