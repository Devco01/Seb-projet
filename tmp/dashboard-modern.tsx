"use client";

import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaFileInvoiceDollar,
  FaFileAlt,
  FaUsers
} from "react-icons/fa";

// Tableau de bord moderne avec le design de l'interface sur le port 3001
export default function DashboardModern() {
  // Données statiques pour le tableau de bord
  const stats = {
    chiffreAffaires: "45 600 €",
    progression: "+12% par rapport au mois dernier",
    devisEnCours: 8,
    valeurTotaleDevis: "15 800 €",
    facturesImpayees: 5,
    montantDu: "8 200 €",
    clientsActifs: 24,
    nouveauxClients: 3
  };

  // Données pour l'activité récente
  const activites = [
    {
      date: "15/06/2023",
      type: "Facture",
      client: "Dupont Construction",
      montant: "3 200 €",
      statut: "Payée",
      statutClasse: "text-green-600 bg-green-100"
    },
    {
      date: "12/06/2023",
      type: "Devis",
      client: "Martin Immobilier",
      montant: "5 800 €",
      statut: "En attente",
      statutClasse: "text-yellow-600 bg-yellow-100"
    },
    {
      date: "10/06/2023",
      type: "Facture",
      client: "Petit Rénovation",
      montant: "2 400 €",
      statut: "En retard",
      statutClasse: "text-red-600 bg-red-100"
    }
  ];

  // Données pour les projets en cours
  const projets = [
    {
      nom: "Rénovation appartement",
      client: "Dupont Construction",
      progression: "75%",
      statut: "En cours"
    },
    {
      nom: "Peinture bureaux",
      client: "Martin Immobilier",
      progression: "40%",
      statut: "En cours"
    }
  ];

  // État pour suivre si le composant est monté
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("DashboardModern rendu");
  }, []);

  if (!mounted) {
    return <div className="text-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Aperçu de votre activité</p>
      </header>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Chiffre d'affaires */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Chiffre d&apos;affaires</p>
              <p className="text-2xl font-bold text-gray-800">{stats.chiffreAffaires}</p>
              <p className="text-xs text-green-600 mt-1">{stats.progression}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FaChartLine className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Devis en cours */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Devis en cours</p>
              <p className="text-2xl font-bold text-gray-800">{stats.devisEnCours}</p>
              <p className="text-xs text-gray-500 mt-1">Valeur totale: {stats.valeurTotaleDevis}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaFileAlt className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Factures impayées */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Factures impayées</p>
              <p className="text-2xl font-bold text-gray-800">{stats.facturesImpayees}</p>
              <p className="text-xs text-gray-500 mt-1">Montant dû: {stats.montantDu}</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-full">
              <FaFileInvoiceDollar className="h-6 w-6 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Clients actifs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Clients actifs</p>
              <p className="text-2xl font-bold text-gray-800">{stats.clientsActifs}</p>
              <p className="text-xs text-gray-500 mt-1">+{stats.nouveauxClients} nouveaux ce mois-ci</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaUsers className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Activité récente</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activites.map((activite, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activite.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activite.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activite.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activite.montant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activite.statutClasse}`}>
                      {activite.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Projets en cours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projets.map((projet, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{projet.nom}</h3>
                <p className="text-sm text-gray-500">Client: {projet.client}</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                {projet.statut}
              </span>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium">
                <span>Progression</span>
                <span>{projet.progression}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: projet.progression }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 