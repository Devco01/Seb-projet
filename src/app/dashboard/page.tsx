"use client";

import Link from "next/link";
import { useEffect } from "react";
import { 
  FaFileInvoiceDollar, 
  FaFileAlt, 
  FaUsers, 
  FaMoneyBillWave,
  FaRegCalendarAlt,
  FaArrowRight,
  FaHandshake
} from "react-icons/fa";
import { RiMoneyEuroCircleLine } from "react-icons/ri";

// Composant simple sans hydratation côté client
export default function Dashboard() {
  // Ajouter un effet pour vérifier le rendu
  useEffect(() => {
    console.log("Dashboard rendu");
  }, []);

  // Données statiques pour éviter les problèmes d'hydratation
  const stats = {
    clients: 12,
    clientsNouveaux: 4,
    factures: 26,
    facturesEnAttente: 8,
    devis: 32,
    devisAcceptes: 22,
    tauxConversion: "69%",
    totalFactures: "24 650 €",
    totalPaiements: "16 325 €",
    paiementsRecents: 3
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">Tableau de bord</h1>
          <p className="text-gray-500">
            Bienvenue dans votre application de facturation
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            <FaRegCalendarAlt className="mr-1 h-3 w-3" />
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Carte statistiques clients */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FaUsers className="h-6 w-6 text-blue-500" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              +{stats.clientsNouveaux} nouveaux
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase">Clients</p>
          <p className="text-3xl font-bold text-gray-800 mt-1 mb-2">{stats.clients}</p>
          <div className="mt-auto">
            <Link href="/clients" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              Voir tous les clients
              <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Carte statistiques factures */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FaFileInvoiceDollar className="h-6 w-6 text-blue-500" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {stats.facturesEnAttente} en attente
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase">Factures</p>
          <p className="text-3xl font-bold text-gray-800 mt-1 mb-2">{stats.totalFactures}</p>
          <div className="mt-auto">
            <Link href="/factures" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              Voir toutes les factures
              <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
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

        <div className="bg-white rounded-lg shadow p-6">
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
    </div>
  );
} 