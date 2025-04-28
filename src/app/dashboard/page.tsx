"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

// Types pour les données venant des API
interface Client {
  id: number;
  nom: string;
  email: string;
  createdAt: string;
}

interface Facture {
  id: number;
  numero: string;
  statut: string;
  totalTTC: number;
}

interface Devis {
  id: number;
  numero: string;
  statut: string;
}

interface Paiement {
  id: number;
  date: string;
  montant: number;
  methode: string;
}

// Types pour les données du dashboard
interface DashboardStats {
  clients: number;
  clientsNouveaux: number;
  factures: number;
  facturesEnAttente: number;
  devis: number;
  devisAcceptes: number;
  tauxConversion: string;
  totalFactures: string;
  totalPaiements: string;
  paiementsRecents: number;
}

// Composant Dashboard avec récupération des données
export default function Dashboard() {
  // État pour stocker les statistiques
  const [stats, setStats] = useState<DashboardStats>({
    clients: 0,
    clientsNouveaux: 0,
    factures: 0,
    facturesEnAttente: 0,
    devis: 0,
    devisAcceptes: 0,
    tauxConversion: "0%",
    totalFactures: "0,00 €",
    totalPaiements: "0,00 €",
    paiementsRecents: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour formater les montants en euros
  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(montant);
  };

  // Récupération des données
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Utiliser Promise.all pour récupérer toutes les données en parallèle
        const apiResponses = await Promise.allSettled([
          fetch('/api/clients'),
          fetch('/api/factures'),
          fetch('/api/devis'),
          fetch('/api/paiements')
        ]);
        
        // Analyser les réponses et gérer les erreurs individuellement
        const clients = await processApiResponse(apiResponses[0], 'clients', []);
        const factures = await processApiResponse(apiResponses[1], 'factures', []);
        const devis = await processApiResponse(apiResponses[2], 'devis', []);
        const paiements = await processApiResponse(apiResponses[3], 'paiements', []);
        
        // Vérifier si au moins certaines données sont disponibles
        if (!clients.length && !factures.length && !devis.length && !paiements.length) {
          throw new Error('Toutes les API ont échoué, aucune donnée disponible');
        }
        
        console.log('Données dashboard chargées', { 
          clients: clients.length, 
          factures: factures.length, 
          devis: devis.length,
          paiements: paiements.length 
        });
        
        // Calculer le nombre de nouveaux clients (créés dans les 30 derniers jours)
        const dateIlYA30Jours = new Date();
        dateIlYA30Jours.setDate(dateIlYA30Jours.getDate() - 30);
        
        const clientsNouveaux = clients.filter((client: Client) => {
          const dateCreation = new Date(client.createdAt);
          return dateCreation >= dateIlYA30Jours;
        }).length;
        
        // Calculer le nombre de factures en attente
        const facturesEnAttente = factures.filter((facture: Facture) => 
          facture.statut === 'En attente' || facture.statut === 'Partiellement payée'
        ).length;
        
        // Calculer le nombre de devis acceptés
        const devisAcceptes = devis.filter((devis: Devis) => devis.statut === 'Accepté').length;
        
        // Calculer le taux de conversion des devis
        const tauxConversion = devis.length > 0 
          ? Math.round((devisAcceptes / devis.length) * 100) 
          : 0;
        
        // Calculer le total des factures
        const totalFactures = factures.reduce((total: number, facture: Facture) => 
          total + (facture.totalTTC || 0), 0
        );
        
        // Calculer le total des paiements du mois en cours
        const debutMois = new Date();
        debutMois.setDate(1);
        debutMois.setHours(0, 0, 0, 0);
        
        const paiementsMois = paiements.filter((paiement: Paiement) => {
          const datePaiement = new Date(paiement.date);
          return datePaiement >= debutMois;
        });
        
        const totalPaiements = paiementsMois.reduce((total: number, paiement: Paiement) => 
          total + (paiement.montant || 0), 0
        );
        
        // Mettre à jour les statistiques
        setStats({
          clients: clients.length,
          clientsNouveaux,
          factures: factures.length,
          facturesEnAttente,
          devis: devis.length,
          devisAcceptes,
          tauxConversion: `${tauxConversion}%`,
          totalFactures: formatMontant(totalFactures),
          totalPaiements: formatMontant(totalPaiements),
          paiementsRecents: paiementsMois.length
        });
        
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Fonction utilitaire pour traiter les réponses d'API
  async function processApiResponse<T>(response: PromiseSettledResult<Response>, apiName: string, defaultValue: T): Promise<T> {
    if (response.status === 'fulfilled' && response.value.ok) {
      try {
        return await response.value.json();
      } catch (err) {
        console.error(`Erreur lors du parsing JSON pour ${apiName}:`, err);
      }
    } else {
      console.error(`Erreur API ${apiName}:`, 
        response.status === 'rejected' 
          ? response.reason 
          : `Status ${(response as PromiseFulfilledResult<Response>).value.status}`);
    }
    return defaultValue;
  }

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

      {/* Affichage en cours de chargement */}
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Carte statistiques clients */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FaUsers className="h-6 w-6 text-blue-500" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  {stats.clientsNouveaux} nouveaux
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
        </>
      )}

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