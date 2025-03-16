'use client';

import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import { FaEdit, FaTrash, FaFileInvoiceDollar, FaFileContract, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

// Données fictives pour un client
const clientData = {
  id: 1,
  nom: 'Dupont SAS',
  contact: 'Jean Dupont',
  email: 'contact@dupont-sas.fr',
  telephone: '01 23 45 67 89',
  adresse: '15 rue des Lilas',
  codePostal: '75001',
  ville: 'Paris',
  pays: 'France',
  siret: '12345678901234',
  tva: 'FR12345678901',
  dateCreation: '12/01/2023',
  notes: 'Client régulier, préfère être contacté par email.',
  devis: [
    { id: 1, numero: 'D-2023-056', date: '20/06/2023', montant: '3 200 €', statut: 'En attente' },
    { id: 2, numero: 'D-2023-048', date: '05/06/2023', montant: '1 800 €', statut: 'Accepté' },
    { id: 3, numero: 'D-2023-032', date: '15/05/2023', montant: '2 400 €', statut: 'Refusé' }
  ],
  factures: [
    { id: 1, numero: 'F-2023-042', date: '15/06/2023', montant: '2 500 €', statut: 'Payée' },
    { id: 2, numero: 'F-2023-035', date: '01/06/2023', montant: '1 800 €', statut: 'En attente' },
    { id: 3, numero: 'F-2023-028', date: '15/05/2023', montant: '3 200 €', statut: 'Impayée' }
  ]
};

export default function DetailClient({ params }: { params: { id: string } }) {
  const [client, setClient] = useState(clientData);

  // Fonction pour supprimer le client
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      alert('Client supprimé avec succès !');
      window.location.href = '/clients';
    }
  };

  // Fonction pour créer un nouveau devis pour ce client
  const handleCreateDevis = () => {
    window.location.href = `/devis/nouveau?client=${client.id}`;
  };

  // Fonction pour créer une nouvelle facture pour ce client
  const handleCreateFacture = () => {
    window.location.href = `/factures/nouveau?client=${client.id}`;
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/clients" className="mr-4 text-blue-600 hover:text-blue-800">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{client.nom}</h1>
            <p className="text-gray-600">Client depuis {client.dateCreation}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleCreateDevis}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaFileContract className="mr-2" /> Nouveau devis
          </button>
          <button 
            onClick={handleCreateFacture}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaFileInvoiceDollar className="mr-2" /> Nouvelle facture
          </button>
          <Link 
            href={`/clients/${params.id}/modifier`}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaEdit className="mr-2" /> Modifier
          </Link>
          <button 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaTrash className="mr-2" /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Informations générales</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Contact:</span> {client.contact}</p>
            <p><span className="font-medium">Email:</span> {client.email}</p>
            <p><span className="font-medium">Téléphone:</span> {client.telephone}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Adresse</h2>
          <div className="space-y-2">
            <p>{client.adresse}</p>
            <p>{client.codePostal} {client.ville}</p>
            <p>{client.pays}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Informations fiscales</h2>
          <div className="space-y-2">
            <p><span className="font-medium">SIRET:</span> {client.siret}</p>
            <p><span className="font-medium">N° TVA:</span> {client.tva}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Notes</h2>
        <p className="text-gray-700">{client.notes}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Devis récents</h2>
          {client.devis.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {client.devis.map((devis) => (
                    <tr key={devis.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {devis.numero}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {devis.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {devis.montant}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {devis.statut}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <Link href={`/devis/${devis.id}`} className="text-blue-600 hover:text-blue-900">
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Aucun devis pour ce client.</p>
          )}
          <div className="mt-4 text-right">
            <Link href={`/devis?client=${client.id}`} className="text-blue-600 hover:text-blue-900 text-sm">
              Voir tous les devis
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Factures récentes</h2>
          {client.factures.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {client.factures.map((facture) => (
                    <tr key={facture.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {facture.numero}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {facture.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {facture.montant}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {facture.statut}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <Link href={`/factures/${facture.id}`} className="text-blue-600 hover:text-blue-900">
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Aucune facture pour ce client.</p>
          )}
          <div className="mt-4 text-right">
            <Link href={`/factures?client=${client.id}`} className="text-blue-600 hover:text-blue-900 text-sm">
              Voir toutes les factures
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 