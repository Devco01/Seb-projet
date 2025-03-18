"use client";

import Link from "next/link";
import { useEffect } from "react";
import { 
  FaFileInvoiceDollar, 
  FaFileAlt, 
  FaUsers, 
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaLongArrowAltUp,
  FaRegCalendarAlt,
  FaPaintRoller,
  FaPlus,
  FaArrowRight,
  FaHandshake
} from "react-icons/fa";
import { RiPaintBrushFill, RiMoneyEuroCircleLine } from "react-icons/ri";

// Composant simple sans hydratation côté client
export default function Dashboard() {
  // Ajouter un effet pour vérifier le rendu
  useEffect(() => {
    console.log("Dashboard rendu");
  }, []);

  // Données statiques pour éviter les problèmes d'hydratation
  const stats = {
    clients: 12,
    devis: 24,
    factures: 18,
    paiementsRecents: 5,
    totalFactures: "24 560,50 €",
    totalFacturesNonPayees: "8 750,25 €",
    totalPaiements: "15 810,25 €",
    facturesEnRetard: 3,
    nouveauxClients: 2,
    tauxConversion: "65%",
    croissanceMensuelle: "+12%"
  };

  const projetsEnCours = [
    { id: 1, client: "Dupont Immobilier", adresse: "12 rue des Lilas, 75001 Paris", statut: "En cours", progression: 60 },
    { id: 2, client: "Martin Résidences", adresse: "8 avenue Victor Hugo, 69002 Lyon", statut: "En attente", progression: 25 },
    { id: 3, client: "Dubois & Fils", adresse: "45 rue du Commerce, 33000 Bordeaux", statut: "En cours", progression: 80 },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et date */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue dans votre espace de gestion</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center">
            <FaRegCalendarAlt className="mr-2" size={14} /> 
            Mars 2024
          </span>
        </div>
      </div>

      {/* Cartes principales KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl text-gray-800 p-6 shadow-lg flex flex-col border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FaChartLine className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">
              {stats.croissanceMensuelle}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase">Chiffre d&apos;affaires</p>
          <p className="text-3xl font-bold mt-1 mb-2">{stats.totalFactures}</p>
          <div className="mt-auto text-xs font-medium text-gray-500 flex items-center">
            <FaLongArrowAltUp className="mr-1 text-green-500" />
            <span>+ 12% par rapport au mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <FaExclamationTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium bg-red-50 text-red-600 px-2 py-1 rounded-full">
              {stats.facturesEnRetard} en retard
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase">À recouvrer</p>
          <p className="text-3xl font-bold text-gray-800 mt-1 mb-2">{stats.totalFacturesNonPayees}</p>
          <div className="mt-auto">
            <Link href="/factures?statut=en_retard" className="text-sm text-red-600 hover:text-red-800 flex items-center">
              Voir les factures en retard
              <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <FaMoneyBillWave className="h-6 w-6 text-green-500" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">
              {stats.paiementsRecents} récents
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase">Encaissé ce mois-ci</p>
          <p className="text-3xl font-bold text-gray-800 mt-1 mb-2">{stats.totalPaiements}</p>
          <div className="mt-auto">
            <Link href="/paiements" className="text-sm text-green-600 hover:text-green-800 flex items-center">
              Voir tous les paiements
              <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-lg">
              <FaHandshake className="h-6 w-6 text-amber-500" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium bg-amber-50 text-amber-600 px-2 py-1 rounded-full">
              {stats.tauxConversion}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase">Taux de conversion</p>
          <p className="text-3xl font-bold text-gray-800 mt-1 mb-2">{stats.devis} devis</p>
          <div className="mt-auto">
            <Link href="/devis" className="text-sm text-amber-600 hover:text-amber-800 flex items-center">
              Voir tous les devis
              <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="font-semibold text-gray-800">Actions rapides</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-200">
          <Link href="/devis/nouveau/" className="group p-6 hover:bg-blue-50 transition-colors duration-150 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-amber-100 group-hover:bg-amber-200 rounded-full flex items-center justify-center mb-3 transition-colors">
              <FaFileAlt className="h-5 w-5 text-amber-600" />
            </div>
            <span className="font-medium text-gray-800">Nouveau devis</span>
          </Link>
          
          <Link href="/factures/nouveau/" className="group p-6 hover:bg-blue-50 transition-colors duration-150 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center mb-3 transition-colors">
              <FaFileInvoiceDollar className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-800">Nouvelle facture</span>
          </Link>
          
          <Link href="/clients/nouveau/" className="group p-6 hover:bg-blue-50 transition-colors duration-150 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center mb-3 transition-colors">
              <FaUsers className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-800">Nouveau client</span>
          </Link>
          
          <Link href="/paiements/nouveau/" className="group p-6 hover:bg-blue-50 transition-colors duration-150 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-full flex items-center justify-center mb-3 transition-colors">
              <RiMoneyEuroCircleLine className="h-5 w-5 text-purple-600" />
            </div>
            <span className="font-medium text-gray-800">Nouveau paiement</span>
          </Link>
        </div>
      </div>

      {/* Projets en cours */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <RiPaintBrushFill className="h-4 w-4 text-blue-600 mr-2" />
            <h2 className="font-semibold text-gray-800">Projets en cours</h2>
          </div>
          <Link href="/projets/" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            <FaPlus className="h-3 w-3 mr-1" />
            Nouveau projet
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projetsEnCours.map((projet) => (
                <tr key={projet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-700">
                        <FaPaintRoller className="h-4 w-4" />
                      </div>
                      {projet.client}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {projet.adresse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      projet.statut === 'En cours' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {projet.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            projet.progression > 60 
                              ? 'bg-green-600' 
                              : projet.progression > 30 
                                ? 'bg-blue-600' 
                                : 'bg-amber-500'
                          }`}
                          style={{ width: `${projet.progression}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{projet.progression}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 