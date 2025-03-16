"use client";

import MainLayout from '../components/MainLayout';
import DashboardCard from '../components/DashboardCard';
import { 
  FaFileInvoiceDollar, 
  FaFileContract, 
  FaUsers, 
  FaEuroSign 
} from 'react-icons/fa';

export default function Dashboard() {
  // Données fictives pour le tableau de bord
  const dashboardData = {
    devisEnCours: 5,
    facturesImpayees: 3,
    clientsActifs: 12,
    chiffreAffaires: '15 400 €',
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue sur votre espace de gestion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Devis en cours" 
          value={dashboardData.devisEnCours} 
          icon={FaFileContract} 
          color="border-blue-500" 
        />
        <DashboardCard 
          title="Factures impayées" 
          value={dashboardData.facturesImpayees} 
          icon={FaFileInvoiceDollar} 
          color="border-red-500" 
        />
        <DashboardCard 
          title="Clients actifs" 
          value={dashboardData.clientsActifs} 
          icon={FaUsers} 
          color="border-green-500" 
        />
        <DashboardCard 
          title="Chiffre d'affaires" 
          value={dashboardData.chiffreAffaires} 
          icon={FaEuroSign} 
          color="border-blue-500" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Activités récentes</h2>
          <ul className="space-y-3">
            <li className="border-b pb-2">
              <p className="font-medium">Facture #F-2023-042 créée</p>
              <p className="text-sm text-gray-500">Il y a 2 jours</p>
            </li>
            <li className="border-b pb-2">
              <p className="font-medium">Paiement reçu de Dupont SAS</p>
              <p className="text-sm text-gray-500">Il y a 3 jours</p>
            </li>
            <li className="border-b pb-2">
              <p className="font-medium">Devis #D-2023-018 envoyé</p>
              <p className="text-sm text-gray-500">Il y a 5 jours</p>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Tâches à faire</h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Relancer la facture #F-2023-039</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Finaliser le devis pour Martin Construction</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Mettre à jour les coordonnées de Dubois SARL</span>
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
} 