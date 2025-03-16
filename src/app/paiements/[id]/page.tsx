'use client';

import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import { FaEdit, FaTrash, FaFileInvoiceDollar, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

// Données fictives pour un paiement
const paiementData = {
  id: 1,
  reference: 'P-2023-025',
  facture: {
    id: 42,
    numero: 'F-2023-042',
    montant: '2 500 €',
    date: '15/06/2023'
  },
  client: {
    id: 1,
    nom: 'Dupont SAS',
    email: 'contact@dupont-sas.fr',
    telephone: '01 23 45 67 89'
  },
  date: '20/06/2023',
  montant: '2 500 €',
  methode: 'Virement bancaire',
  referenceTransaction: 'VIR-20230620-DUP',
  statut: 'En attente',
  statutColor: 'bg-yellow-100 text-yellow-800',
  notes: 'Paiement en attente de confirmation bancaire.'
};

export default function DetailPaiement({ params }: { params: { id: string } }) {
  const [paiement, setPaiement] = useState(paiementData);

  // Fonction pour marquer le paiement comme reçu
  const handleMarkAsReceived = () => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer ce paiement comme reçu ?')) {
      setPaiement({
        ...paiement,
        statut: 'Reçu',
        statutColor: 'bg-green-100 text-green-800'
      });
      alert('Paiement marqué comme reçu avec succès !');
    }
  };

  // Fonction pour supprimer le paiement
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      alert('Paiement supprimé avec succès !');
      window.location.href = '/paiements';
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/paiements" className="mr-4 text-blue-600 hover:text-blue-800">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Paiement {paiement.reference}</h1>
            <p className="text-gray-600">Enregistré le {paiement.date}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link 
            href={`/factures/${paiement.facture.id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaFileInvoiceDollar className="mr-2" /> Voir facture
          </Link>
          <Link 
            href={`/paiements/${params.id}/modifier`}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaEdit className="mr-2" /> Modifier
          </Link>
          {paiement.statut === 'En attente' && (
            <button 
              onClick={handleMarkAsReceived}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <FaCheckCircle className="mr-2" /> Marquer reçu
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaTrash className="mr-2" /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Informations du paiement</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Statut:</span>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${paiement.statutColor}`}>
                {paiement.statut}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Montant:</span>
              <span className="font-bold">{paiement.montant}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{paiement.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Méthode:</span>
              <span>{paiement.methode}</span>
            </div>
            {paiement.referenceTransaction && (
              <div className="flex justify-between">
                <span className="font-medium">Référence transaction:</span>
                <span>{paiement.referenceTransaction}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Facture associée</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Numéro:</span>
              <Link href={`/factures/${paiement.facture.id}`} className="text-blue-600 hover:text-blue-800">
                {paiement.facture.numero}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{paiement.facture.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Montant:</span>
              <span>{paiement.facture.montant}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Client:</span>
              <Link href={`/clients/${paiement.client.id}`} className="text-blue-600 hover:text-blue-800">
                {paiement.client.nom}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {paiement.notes && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-2">Notes</h2>
          <p className="text-gray-700">{paiement.notes}</p>
        </div>
      )}
    </MainLayout>
  );
} 