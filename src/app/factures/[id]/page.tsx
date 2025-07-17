'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEnvelope, FaCheckCircle, FaArrowLeft, FaPrint, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PrintDocument from '@/app/components/PrintDocument';

// Interface pour les lignes de facture
interface FactureLigne {
  description: string;
  quantite: number;
  unite?: string;
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
  dateOriginale?: string;
  echeanceOriginale?: string;
  estAcompte?: boolean;
  pourcentageAcompte?: number;
  devis?: { numero: string };
  factureFinaleId?: number;
}

// Ajouter cette déclaration en haut du fichier pour TypeScript
declare global {
  interface Window {
    preparePrint?: () => void;
  }
}

export default function DetailFacture({ params }: { params: { id: string } }) {
  const [facture, setFacture] = useState<Facture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadFacture = async () => {
      try {
        setLoading(true);
        console.log(`Chargement de la facture avec ID: ${params.id}`);
        
        // Validation de l'ID
        const factureId = parseInt(params.id, 10);
        if (isNaN(factureId)) {
          throw new Error(`ID de facture invalide: ${params.id}`);
        }
        
        const response = await fetch(`/api/factures/${factureId}`);
        console.log(`Statut de la réponse: ${response.status}`);
        
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement de la facture: ${response.status} ${response.statusText}`);
        }
        
        // Récupérer le texte brut pour le débogage
        const responseText = await response.text();
        console.log(`Réponse brute: ${responseText.substring(0, 100)}...`);
        
        // Tenter de parser la réponse JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Erreur de parsing JSON:', parseError);
          throw new Error(`Réponse invalide du serveur: ${responseText.substring(0, 100)}...`);
        }
        
        console.log('Données de la facture chargées:', data);
        
        // Vérifier que les données sont bien présentes
        if (!data || !data.id || !data.numero) {
          throw new Error('Données de facture incomplètes ou invalides');
        }
        
        // Analyser les lignes qui sont stockées en JSON
        let lignesData = [];
        if (data.lignes) {
          if (typeof data.lignes === 'string') {
            try {
              lignesData = JSON.parse(data.lignes);
              console.log('Lignes de facture parsées:', lignesData);
            } catch (e) {
              console.error('Erreur lors du parsing des lignes:', e);
              lignesData = [];
            }
          } else if (Array.isArray(data.lignes)) {
            lignesData = data.lignes;
            console.log('Lignes de facture (déjà en array):', lignesData);
          }
        }
        
        // S'assurer que toutes les lignes ont des propriétés valides
        const lignesValidees = lignesData.map((ligne: Partial<FactureLigne>, index: number) => {
          console.log(`Traitement ligne ${index}:`, ligne);
          
          const quantite = Number(ligne.quantite) || 0;
          const prixUnitaire = Number(ligne.prixUnitaire) || 0;
          const total = quantite * prixUnitaire;
          
          return {
            description: ligne.description || 'Article sans description',
            quantite: quantite,
            unite: ligne.unite || 'unité',
            prixUnitaire: prixUnitaire,
            total: total
          };
        });
        
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
          try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
              console.error(`Date invalide: ${dateString}`);
              return 'Date invalide';
            }
            return date.toLocaleDateString('fr-FR');
          } catch (dateError) {
            console.error(`Erreur de formatage de date:`, dateError);
            return 'Date invalide';
          }
        };
        
        // S'assurer que client existe
        if (!data.client) {
          data.client = {
            id: 0,
            nom: 'Client inconnu',
            email: '',
            adresse: '',
            codePostal: '',
            ville: ''
          };
          console.warn('Données client manquantes dans la facture');
        }
        
        const factureProcessed = {
          ...data,
          lignes: lignesValidees,
          statutColor,
          dateOriginale: data.date,
          echeanceOriginale: data.echeance,
          date: formatDate(data.date),
          echeance: formatDate(data.echeance)
        };
        
        console.log('Facture traitée:', factureProcessed);
        setFacture(factureProcessed);
      } catch (err) {
        console.error('Erreur lors du chargement de la facture:', err);
        setError(`Impossible de charger les données de la facture: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
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
  const total = facture.lignes && Array.isArray(facture.lignes) 
    ? facture.lignes.reduce((sum: number, ligne: FactureLigne) => {
        // Vérifier et convertir les valeurs en nombre pour éviter des erreurs
        const quantite = Number(ligne.quantite) || 0;
        const prixUnitaire = Number(ligne.prixUnitaire) || 0;
        return sum + (quantite * prixUnitaire);
      }, 0)
    : (facture.totalTTC || 0); // Fallback vers totalTTC si les lignes ne sont pas disponibles

  // Fonction pour recharger les données de la facture
  const reloadFacture = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/factures/${params.id}`);
      
      if (!response.ok) {
        throw new Error(`Erreur lors du rechargement: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Analyser les lignes
      let lignesData = [];
      if (data.lignes) {
        if (typeof data.lignes === 'string') {
          try {
            lignesData = JSON.parse(data.lignes);
          } catch (e) {
            console.error('Erreur lors du parsing des lignes:', e);
            lignesData = [];
          }
        } else if (Array.isArray(data.lignes)) {
          lignesData = data.lignes;
        }
      }
      
      // Déterminer la couleur du statut
      let statutColor = 'bg-yellow-100 text-yellow-800';
      if (data.statut === 'Payée') {
        statutColor = 'bg-green-100 text-green-800';
      } else if (data.statut === 'En retard') {
        statutColor = 'bg-red-100 text-red-800';
      } else if (data.statut === 'Annulée') {
        statutColor = 'bg-gray-100 text-gray-800';
      }
      
      // Formater les dates
      const formatDate = (dateString: string) => {
        try {
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleDateString('fr-FR');
        } catch {
          return 'Date invalide';
        }
      };
      
      setFacture({
        ...data,
        lignes: lignesData,
        statutColor,
        dateOriginale: data.date,
        echeanceOriginale: data.echeance,
        date: formatDate(data.date),
        echeance: formatDate(data.echeance)
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour marquer la facture comme payée
  const handleMarkAsPaid = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer cette facture comme payée ?')) {
      try {
        const response = await fetch(`/api/factures/${params.id}/payer`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la mise à jour du statut de la facture');
        }
        
        // Recharger les données depuis le serveur pour garantir la synchronisation
        await reloadFacture();
        
        alert('Facture marquée comme payée avec succès !');
      } catch (err) {
        console.error('Erreur:', err);
        alert(`Erreur lors de la mise à jour: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  // Fonction pour envoyer la facture par email
  const handleSendEmail = () => {
    if (facture && facture.client && facture.client.email) {
      const subject = encodeURIComponent(`Facture ${facture.numero}`);
      const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint notre facture ${facture.numero}.\n\nCordialement,`);
      window.location.href = `mailto:${facture.client.email}?subject=${subject}&body=${body}`;
    } else {
      alert('Adresse email du client non disponible');
    }
  };

  // Fonction pour imprimer la facture (optimisée Chromebook)
  const handlePrint = () => {
    try {
      // Méthode d'ouverture compatible Chromebook
      const printWindow = window.open(`/print?type=facture&id=${params.id}`, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      // Vérifier si la fenêtre s'est ouverte (popup non bloqué)
      if (!printWindow || printWindow.closed || typeof printWindow.closed === 'undefined') {
        // Fallback : ouvrir dans le même onglet si popup bloqué
        window.location.href = `/print?type=facture&id=${params.id}`;
      } else {
        // Forcer le focus sur la nouvelle fenêtre
        printWindow.focus();
      }
    } catch (error) {
      console.error('Erreur ouverture impression:', error);
      // Fallback sécurisé
      window.location.href = `/print?type=facture&id=${params.id}`;
    }
  };

  // Fonction pour supprimer la facture
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        const response = await fetch(`/api/factures/${params.id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la suppression de la facture');
        }
        
        alert('Facture supprimée avec succès !');
        router.push('/factures');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert(`Erreur lors de la suppression: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  // Fonction pour vérifier si une facture est un acompte
  const isAcompteFacture = (facture: Facture) => {
    return facture.notes?.includes('FACTURE D\'ACOMPTE');
  };

  // Extraire le pourcentage d'acompte à partir des notes
  const getAcomptePercentage = (facture: Facture) => {
    if (!facture.notes) return null;
    const match = facture.notes.match(/acompte représentant (\d+)%/i);
    return match ? parseInt(match[1]) : null;
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
            onClick={handleSendEmail}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <FaEnvelope className="mr-2" /> Email
          </button>
          <Link 
            href={`/factures/nouveau?id=${params.id}`}
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
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                    Description
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Qté
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Prix unit. (€)
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Total (€)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(facture.lignes) && facture.lignes.length > 0 ? (
                  facture.lignes.map((ligne, index) => (
                    <tr key={index}>
                      <td className="px-2 sm:px-4 py-3 text-sm text-gray-900 break-words max-w-0">
                        <div className="overflow-hidden">
                          {ligne.description || 'Article sans description'}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-center text-sm text-gray-500 whitespace-nowrap">
                        {ligne.quantite}
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-right text-sm text-gray-500 whitespace-nowrap">
                        {Number(ligne.prixUnitaire).toFixed(2)}
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-right text-sm text-gray-900 font-medium whitespace-nowrap">
                        {Number(ligne.total).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                      Aucune ligne de facturation disponible
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-2 sm:px-4 py-3"></td>
                  <td className="px-2 sm:px-4 py-3 text-right font-medium">Total:</td>
                  <td className="px-2 sm:px-4 py-3 text-right font-bold">{total.toFixed(2)} €</td>
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
            {/* Pour les factures d'acompte, on filtre le récapitulatif qui sera affiché séparément */}
            {facture.notes?.includes('FACTURE D\'ACOMPTE') ? (
              <div className="text-gray-700">
                {facture.notes.split('\n').map((line, index) => {
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
              <p className="text-gray-700">{facture.notes}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Section visible uniquement à l'impression */}
      <div id="print-content" className="hidden print:block print-container">
        <PrintDocument 
          type="facture"
          reference={facture.numero}
          date={facture.dateOriginale || facture.date}
          echeance={facture.echeanceOriginale || facture.echeance}
          clientName={facture.client.nom}
          clientAddress={facture.client.adresse}
          clientZipCity={`${facture.client.codePostal} ${facture.client.ville}`}
          clientEmail={facture.client.email}
          clientPhone={facture.client.telephone}
          lines={facture.lignes}
          total={total}
          notes={facture.notes}
        />
      </div>

      {/* Information simplifiée pour les factures d'acompte */}
      {isAcompteFacture(facture) && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 print:hidden">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Facture d&apos;acompte</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Cette facture représente un acompte de {getAcomptePercentage(facture)}% sur le devis n°{facture.devis?.numero}.</p>
                <p className="mt-1 font-medium">Le récapitulatif détaillé des montants est visible sur la version imprimée.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 