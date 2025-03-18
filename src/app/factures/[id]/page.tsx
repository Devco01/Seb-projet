'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaFileDownload, FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

// Données fictives pour une facture
const factureData = {
  id: 1,
  numero: 'F-2023-042',
  client: {
    nom: 'Dupont SAS',
    adresse: '15 rue des Lilas',
    codePostal: '75001',
    ville: 'Paris',
    email: 'contact@dupont-sas.fr',
    telephone: '01 23 45 67 89'
  },
  date: '15/06/2023',
  echeance: '15/07/2023',
  statut: 'En attente',
  statutColor: 'bg-yellow-100 text-yellow-800',
  devisAssocie: 'D-2023-056',
  lignes: [
    {
      description: 'Peinture murs intérieurs - Salon',
      quantite: 45,
      unite: 'm²',
      prixUnitaire: 25,
      tva: 20,
      total: 1350
    },
    {
      description: 'Peinture plafond - Salon',
      quantite: 20,
      unite: 'm²',
      prixUnitaire: 30,
      tva: 20,
      total: 720
    },
    {
      description: 'Préparation des surfaces',
      quantite: 1,
      unite: 'forfait',
      prixUnitaire: 350,
      tva: 20,
      total: 420
    }
  ],
  conditions: 'Paiement à 30 jours à compter de la date de facturation.',
  notes: 'Merci pour votre confiance.'
};

export default function DetailFacture({ params }: { params: { id: string } }) {
  const [facture, setFacture] = useState(factureData);

  // Calcul du total HT
  const totalHT = facture.lignes.reduce((sum, ligne) => {
    return sum + (ligne.quantite * ligne.prixUnitaire);
  }, 0);

  // Calcul du total TVA
  const totalTVA = facture.lignes.reduce((sum, ligne) => {
    return sum + (ligne.quantite * ligne.prixUnitaire * ligne.tva / 100);
  }, 0);

  // Calcul du total TTC
  const totalTTC = totalHT + totalTVA;

  // Fonction pour marquer la facture comme payée
  const handleMarkAsPaid = () => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer cette facture comme payée ?')) {
      setFacture({
        ...facture,
        statut: 'Payée',
        statutColor: 'bg-green-100 text-green-800'
      });
      alert('Facture marquée comme payée avec succès !');
    }
  };

  // Fonction pour télécharger la facture
  const handleDownload = () => {
    alert('Téléchargement de la facture en PDF...');
  };

  // Fonction pour envoyer la facture par email
  const handleSendEmail = () => {
    alert('Envoi de la facture par email...');
  };

  // Fonction pour supprimer la facture
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      alert('Facture supprimée avec succès !');
      window.location.href = '/factures';
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/factures" className="mr-4 text-blue-600 hover:text-blue-800">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Facture {facture.numero}</h1>
            <p className="text-gray-600">Émise le {facture.date} - Échéance le {facture.echeance}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleDownload}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaFileDownload className="mr-2" /> PDF
          </button>
          <button 
            onClick={handleSendEmail}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaEnvelope className="mr-2" /> Email
          </button>
          <Link 
            href={`/factures/${params.id}/modifier`}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaEdit className="mr-2" /> Modifier
          </Link>
          {facture.statut !== 'Payée' && (
            <button 
              onClick={handleMarkAsPaid}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <FaCheckCircle className="mr-2" /> Marquer payée
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold mb-2">Client</h2>
            <p className="font-medium">{facture.client.nom}</p>
            <p>{facture.client.adresse}</p>
            <p>{facture.client.codePostal} {facture.client.ville}</p>
            <p>Email: {facture.client.email}</p>
            <p>Tél: {facture.client.telephone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold mb-2">Statut</h2>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${facture.statutColor}`}>
              {facture.statut}
            </span>
            {facture.devisAssocie && (
              <div className="mt-4">
                <h2 className="text-lg font-bold mb-2">Devis associé</h2>
                <Link href={`/devis/${facture.devisAssocie}`} className="text-blue-600 hover:text-blue-800">
                  {facture.devisAssocie}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Prestations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unité
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire (€)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TVA (%)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (€)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facture.lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-normal">
                      {ligne.description}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ligne.quantite}
                    </td>
                    <td className="px-4 py-3">
                      {ligne.unite}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ligne.prixUnitaire.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ligne.tva}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {ligne.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={4} className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right font-medium">Total HT:</td>
                  <td className="px-4 py-3 text-right font-medium">{totalHT.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right font-medium">Total TVA:</td>
                  <td className="px-4 py-3 text-right font-medium">{totalTVA.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right font-medium">Total TTC:</td>
                  <td className="px-4 py-3 text-right font-bold">{totalTTC.toFixed(2)} €</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold mb-2">Conditions de paiement</h2>
            <p className="text-gray-700">{facture.conditions}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">Notes</h2>
            <p className="text-gray-700">{facture.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 