'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaFileDownload, FaEnvelope, FaCheckCircle, FaArrowLeft, FaPrint } from 'react-icons/fa';
import Link from 'next/link';
import EnteteDocument from '@/app/components/EnteteDocument';

// Interface pour les lignes de facture
interface FactureLigne {
  description: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
  total: number;
}

// Interface pour le client
interface FactureClient {
  id: number;
  nom: string;
  email: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  telephone?: string;
}

// Interface pour la facture
interface Facture {
  id: number;
  numero: string;
  client: FactureClient;
  date: string;
  echeance: string;
  statut: string;
  statutColor: string;
  devisId?: number;
  devisNumero?: string;
  devisAssocie?: string;
  lignes: FactureLigne[];
  conditions?: string;
  notes?: string;
  totalHT: number;
  totalTTC: number;
}

export default function DetailFacture({ params }: { params: { id: string } }) {
  const [facture, setFacture] = useState<Facture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFacture = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/factures/${params.id}`);
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement de la facture: ${response.status}`);
        }
        const data = await response.json();
        
        // Analyser les lignes qui sont stockées en JSON
        if (data && data.lignes && typeof data.lignes === 'string') {
          data.lignes = JSON.parse(data.lignes);
        }
        
        // Déterminer la couleur du statut
        let statutColor = 'bg-yellow-100 text-yellow-800'; // Par défaut (En attente)
        if (data.statut === 'Payée') {
          statutColor = 'bg-green-100 text-green-800';
        } else if (data.statut === 'En retard') {
          statutColor = 'bg-red-100 text-red-800';
        } else if (data.statut === 'Annulée') {
          statutColor = 'bg-gray-100 text-gray-800';
        }
        
        // Formater les dates pour l'affichage
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString('fr-FR');
        };
        
        setFacture({
          ...data,
          statutColor,
          date: formatDate(data.date),
          echeance: formatDate(data.echeance)
        });
      } catch (err) {
        console.error('Erreur lors du chargement de la facture:', err);
        setError('Impossible de charger les données de la facture. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadFacture();
  }, [params.id]);

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Afficher un message d'erreur si nécessaire
  if (error || !facture) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p className="font-bold">Erreur</p>
        <p>{error || "Facture non trouvée"}</p>
        <Link href="/factures" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="inline mr-2" /> Retour à la liste des factures
        </Link>
      </div>
    );
  }

  // Calcul du total
  const total = facture.lignes.reduce((sum: number, ligne: FactureLigne) => {
    return sum + (parseFloat(ligne.quantite.toString()) * parseFloat(ligne.prixUnitaire.toString()));
  }, 0);

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

  // Fonction pour imprimer la facture
  const handlePrint = () => {
    window.print();
  };

  // Fonction pour supprimer la facture
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      alert('Facture supprimée avec succès !');
      window.location.href = '/factures';
    }
  };

  return (
    <>
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
            onClick={handlePrint}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaPrint className="mr-2" /> Imprimer
          </button>
          <button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaFileDownload className="mr-2" /> PDF
          </button>
          <button 
            onClick={handleSendEmail}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaEnvelope className="mr-2" /> Email
          </button>
          <Link 
            href={`/factures/${params.id}/modifier`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaEdit className="mr-2" /> Modifier
          </Link>
          {facture.statut !== 'Payée' && (
            <button 
              onClick={handleMarkAsPaid}
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg flex items-center"
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 print:hidden">
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
                    <td className="px-4 py-3 text-right font-medium">
                      {ligne.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right font-medium">Total:</td>
                  <td className="px-4 py-3 text-right font-bold">{total.toFixed(2)} €</td>
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
      
      {/* Section visible uniquement à l'impression */}
      <div className="hidden print:block print:mb-8">
        <EnteteDocument title="Facture" subtitle={`Référence: ${facture.numero} - Créée le ${facture.date}`} />
        
        {/* Contenu d'impression de la facture */}
        <div className="mt-8">
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold mb-2">Client</h2>
              <p className="font-medium">{facture.client.nom}</p>
              <p>{facture.client.adresse}</p>
              <p>{facture.client.codePostal} {facture.client.ville}</p>
              <p>Email: {facture.client.email}</p>
              <p>Tél: {facture.client.telephone}</p>
            </div>
          </div>
          
          {/* Reste du contenu pour l'impression */}
        </div>
      </div>
    </>
  );
} 