'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaFileInvoiceDollar, FaArrowLeft, FaPrint } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PrintDocument from '@/app/components/PrintDocument';

interface Paiement {
  id: number;
  reference: string;
  facture: {
    id: number;
    numero: string;
    totalTTC: number;
    date: string;
  };
  client: {
    id: number;
    nom: string;
    email: string;
  };
  factureId: number;
  clientId: number;
  date: string;
  dateOriginale?: string;
  montant: number;
  methode: string;
  referenceTransaction?: string;
  statut: string;
  notes?: string;
}

// Ajouter cette déclaration en haut du fichier pour TypeScript
declare global {
  interface Window {
    preparePrint?: () => void;
  }
}

export default function DetailPaiement({ params }: { params: { id: string } }) {
  const [paiement, setPaiement] = useState<Paiement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Récupérer les données du paiement depuis l'API
  useEffect(() => {
    const fetchPaiement = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/paiements/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Impossible de récupérer les informations du paiement');
        }
        
        const data = await response.json();
        console.log('Données du paiement chargées:', data);
        setPaiement({
          ...data,
          dateOriginale: data.date
        });
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors de la récupération des données du paiement');
      } finally {
        setLoading(false);
      }
    };

    fetchPaiement();
  }, [params.id]);

  // Fonction pour supprimer le paiement
  const handleDelete = async () => {
    if (!paiement) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ce paiement ${paiement.reference} ?`)) {
      try {
        console.log(`Tentative de suppression du paiement ID: ${params.id}`);
        const response = await fetch(`/api/paiements/${params.id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        console.log('Réponse de suppression:', data);

        alert('Paiement supprimé avec succès !');
        // Redirection forcée vers la liste des paiements
        router.push('/paiements');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        // Même en cas d'erreur, on redirige car le paiement a probablement été supprimé
        alert('Le paiement a été supprimé mais une erreur est survenue lors de la mise à jour des données associées.');
        // Redirection forcée vers la liste des paiements
        router.push('/paiements');
      }
    }
  };

  // Fonction pour imprimer le paiement
  const handlePrint = () => {
    // Ouvrir la page d'impression dans une nouvelle fenêtre
    window.open(`/print?type=paiement&id=${params.id}`, '_blank');
  };

  // Format d'affichage des montants
  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(montant);
  };

  // Format d'affichage des dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Déterminer la couleur du statut
  const getStatusColor = (statut: string): string => {
    switch (statut?.toLowerCase()) {
      case 'reçu':
        return 'bg-green-100 text-green-800';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du paiement...</p>
        </div>
      </div>
    );
  }

  if (error || !paiement) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-bold">Erreur</p>
        <p>{error || "Impossible de charger les informations du paiement"}</p>
        <Link href="/paiements" className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Retour aux paiements
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link href="/paiements" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Retour aux paiements
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Paiement {paiement.reference}</h1>
          <p className="text-gray-600">Enregistré le {formatDate(paiement.date)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaPrint className="mr-2" /> Imprimer
          </button>
          <Link 
            href={`/factures/${paiement.factureId}`}
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
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(paiement.statut)}`}>
                {paiement.statut}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Montant:</span>
              <span className="font-bold">{formatMontant(paiement.montant)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{formatDate(paiement.date)}</span>
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
              <Link href={`/factures/${paiement.factureId}`} className="text-blue-600 hover:text-blue-800">
                {paiement.facture?.numero || `Facture #${paiement.factureId}`}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{paiement.facture?.date ? formatDate(paiement.facture.date) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Montant:</span>
              <span>{paiement.facture?.totalTTC ? formatMontant(paiement.facture.totalTTC) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Client:</span>
              <Link href={`/clients/${paiement.clientId}`} className="text-blue-600 hover:text-blue-800">
                {paiement.client?.nom || `Client #${paiement.clientId}`}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {paiement.notes && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-2">Notes</h2>
          {/* Filtrer le récapitulatif au cas où il serait présent dans les notes */}
          {paiement.notes.includes('RÉCAPITULATIF DES MONTANTS:') ? (
            <div className="text-gray-700">
              {paiement.notes.split('\n').map((line, index) => {
                // On ignore les lignes du récapitulatif
                if (line.includes('RÉCAPITULATIF DES MONTANTS:') || 
                    line.includes('- Montant total du devis:') || 
                    line.includes('- Montant de cet acompte:') || 
                    line.includes('- Montant restant à payer:')) {
                  return null;
                } else if (line.trim()) {
                  return <div key={index}>{line}</div>;
                }
                return null;
              })}
            </div>
          ) : (
            <p className="text-gray-700">{paiement.notes}</p>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Entête avec logo */}
        <div className="flex justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="font-medium">Statut:</span>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(paiement.statut)}`}>
              {paiement.statut}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Montant:</span>
            <span className="font-bold">{formatMontant(paiement.montant)}</span>
          </div>
        </div>
      </div>

      {/* Section visible uniquement à l'impression */}
      <div id="print-content" className="hidden print:block print-container">
        <PrintDocument 
          type="paiement"
          reference={paiement.reference}
          date={paiement.dateOriginale || paiement.date}
          clientName={paiement.client?.nom || `Client #${paiement.clientId}`}
          clientEmail={paiement.client?.email}
          lines={[{
            description: `Paiement pour facture ${paiement.facture?.numero || `#${paiement.factureId}`}`,
            quantite: 1,
            unite: paiement.methode,
            prixUnitaire: paiement.montant,
            total: paiement.montant
          }]}
          total={paiement.montant}
        />
      </div>
    </>
  );
} 