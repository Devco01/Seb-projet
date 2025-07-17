'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaEnvelope, FaEdit, FaTrash, FaExchangeAlt, FaArrowLeft, FaPrint, FaFileInvoiceDollar, FaPlus, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PrintDocument from '@/app/components/PrintDocument';
import { toast } from 'react-hot-toast';

// Interface pour les lignes de devis
interface DevisLigne {
  description: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
  total: number;
}

// Interface pour le client
interface DevisClient {
  id: number;
  nom: string;
  email: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  telephone?: string;
}

// Interface pour les acomptes existants
interface AcompteExistant {
  id: number;
  numero: string;
  pourcentage: number;
  montant: number;
  statut: string;
  date: string;
}

// Interface pour le devis
interface Devis {
  id: number;
  numero: string;
  client: DevisClient;
  date: string;
  validite: string;
  statut: string;
  statutColor: string;
  lignes: DevisLigne[];
  conditions?: string;
  notes?: string;
  totalHT: number;
  totalTTC: number;
  dateOriginale?: string;
  validiteOriginale?: string;
}

// Ajouter cette déclaration en haut du fichier pour TypeScript
declare global {
  interface Window {
    preparePrint?: () => void;
  }
}

export default function DetailDevis({ params }: { params: { id: string } }) {
  const [devis, setDevis] = useState<Devis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acomptesExistants, setAcomptesExistants] = useState<AcompteExistant[]>([]);
  const [showAcompteForm, setShowAcompteForm] = useState(false);
  const [acompteMontant, setAcompteMontant] = useState<number>(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour charger les acomptes existants
  const loadAcomptesExistants = useCallback(async () => {
    try {
      const response = await fetch(`/api/devis/${params.id}/acomptes`);
      if (response.ok) {
        const acomptes = await response.json();
        setAcomptesExistants(acomptes);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des acomptes:', err);
    }
  }, [params.id]);

  useEffect(() => {
    const loadDevis = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/devis/${params.id}`);
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement du devis: ${response.status}`);
        }
        const data = await response.json();
        
        // Analyser les lignes qui sont stockées en JSON
        if (data && data.lignes && typeof data.lignes === 'string') {
          data.lignes = JSON.parse(data.lignes);
        }
        
        // Déterminer la couleur du statut
        let statutColor = 'bg-yellow-100 text-yellow-800'; // Par défaut (En attente)
        if (data.statut === 'Accepté') {
          statutColor = 'bg-green-100 text-green-800';
        } else if (data.statut === 'Refusé') {
          statutColor = 'bg-red-100 text-red-800';
        } else if (data.statut === 'Expiré') {
          statutColor = 'bg-gray-100 text-gray-800';
        }
        
        // Formater les dates pour l'affichage
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString('fr-FR');
        };
        
        setDevis({
          ...data,
          statutColor,
          dateOriginale: data.date,
          validiteOriginale: data.validite,
          date: formatDate(data.date),
          validite: formatDate(data.validite)
        });

        // Charger les acomptes existants
        await loadAcomptesExistants();
      } catch (err) {
        console.error('Erreur lors du chargement du devis:', err);
        setError('Impossible de charger les données du devis. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadDevis();
  }, [params.id, loadAcomptesExistants]);

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Afficher un message d'erreur si nécessaire
  if (error || !devis) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p className="font-bold">Erreur</p>
        <p>{error || "Devis non trouvé"}</p>
        <Link href="/devis" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="inline mr-2" /> Retour à la liste des devis
        </Link>
      </div>
    );
  }

  // Calcul du total
  const total = devis.lignes.reduce((sum: number, ligne: DevisLigne) => {
    return sum + (parseFloat(ligne.quantite.toString()) * parseFloat(ligne.prixUnitaire.toString()));
  }, 0);

  // Calcul du total des acomptes déjà créés
  const totalMontantAcomptesExistants = acomptesExistants.reduce((sum, acompte) => sum + acompte.montant, 0);
  const montantRestant = Math.max(0, devis ? devis.totalTTC - totalMontantAcomptesExistants : 0);
  const nombreAcomptesRestants = Math.max(0, 4 - acomptesExistants.length);

  // Fonction pour convertir le devis en facture
  const handleConvertToInvoice = () => {
    if (window.confirm('Êtes-vous sûr de vouloir convertir ce devis en facture ?')) {
      alert('Devis converti en facture avec succès !');
      router.push('/factures');
    }
  };

  // Fonction pour envoyer le devis par email
  const handleSendEmail = () => {
    if (devis && devis.client && devis.client.email) {
      const subject = encodeURIComponent(`Devis ${devis.numero}`);
      const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint notre devis ${devis.numero}.\n\nCordialement,`);
      window.location.href = `mailto:${devis.client.email}?subject=${subject}&body=${body}`;
    } else {
      alert('Adresse email du client non disponible');
    }
  };

  // Fonction pour imprimer le devis
  const handlePrint = () => {
    // Ouvrir la page d'impression dans une nouvelle fenêtre
    window.open(`/print?type=devis&id=${params.id}`, '_blank');
  };

  // Fonction pour supprimer le devis
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      try {
        const response = await fetch(`/api/devis/${params.id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la suppression du devis');
        }
        
        alert('Devis supprimé avec succès !');
        router.push('/devis');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert(`Erreur lors de la suppression: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  // Fonction pour créer un acompte avec montant personnalisé
  const handleCreateAcompte = async () => {
    if (acompteMontant <= 0 || acompteMontant > montantRestant) {
      toast.error(`Le montant doit être entre 1€ et ${montantRestant.toFixed(2)}€`);
      return;
    }

    if (confirm(`Voulez-vous créer une facture d'acompte de ${acompteMontant.toFixed(2)}€ pour ce devis ?`)) {
      setIsLoading(true);
      try {
        console.log('Envoi de la requête de création d\'acompte pour le devis:', params.id);
        
        // Préparation des données à envoyer
        const requestData = {
          devisId: parseInt(params.id, 10),
          montant: acompteMontant
        };
        
        console.log('Données de la requête:', requestData);
        
        const response = await fetch('/api/factures/acompte', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        // Récupérer le texte de la réponse pour le débogage
        const responseText = await response.text();
        console.log('Réponse brute:', responseText);
        
        // Tenter de parser la réponse JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(`Réponse invalide du serveur: ${responseText}`);
        }
        
        if (response.ok) {
          console.log('Facture d\'acompte créée avec succès:', data);
          toast.success('Facture d\'acompte créée avec succès');
          
          // Recharger les acomptes existants
          await loadAcomptesExistants();
          
          // Fermer le formulaire d'acompte
          setShowAcompteForm(false);
          setAcompteMontant(0);
          
          // Si la facture a une URL d'impression, ouvrir dans un nouvel onglet
          if (data.printUrl) {
            window.open(data.printUrl, '_blank');
          }
          
          // Rediriger vers la page de facture si un ID est présent
          if (data.id) {
            router.push(`/factures/${data.id}`);
          } else {
            console.error('ID de facture manquant dans la réponse');
            toast.error('Erreur: ID de facture manquant dans la réponse');
          }
        } else {
          console.error('Erreur lors de la création de la facture d\'acompte:', data);
          toast.error(data.message || `Erreur ${response.status}: ${response.statusText}`);
          
          // Afficher les détails de l'erreur si disponibles
          if (data.details) {
            console.error('Détails de l\'erreur:', data.details);
            toast.error(`Détails: ${data.details}`);
          }
        }
      } catch (error) {
        console.error('Exception lors de la création de la facture d\'acompte:', error);
        toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur inconnue est survenue'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

    // Fonction pour créer des boutons d'acompte prédéfinis (montants suggérés)
  const handleCreateAcomptePredefini = async (montant: number) => {
    if (confirm(`Voulez-vous créer une facture d'acompte de ${montant.toFixed(2)}€ pour ce devis ?`)) {
      setIsLoading(true);
      try {
        const requestData = {
          devisId: parseInt(params.id, 10),
          montant: montant
        };
        
        const response = await fetch('/api/factures/acompte', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(`Réponse invalide du serveur: ${responseText}`);
        }
        
        if (response.ok) {
          toast.success('Facture d\'acompte créée avec succès');
          await loadAcomptesExistants();
          
          if (data.printUrl) {
            window.open(data.printUrl, '_blank');
          }
          
          if (data.id) {
            router.push(`/factures/${data.id}`);
          }
        } else {
          toast.error(data.message || `Erreur ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Exception lors de la création de la facture d\'acompte:', error);
        toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur inconnue est survenue'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="space-y-6 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header avec titre et actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/devis"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="inline mr-2" /> Retour
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-800">
                Devis {devis.numero}
              </h1>
              <p className="text-gray-500 mt-1">
                Créé le {devis.date} - Valide jusqu&apos;au {devis.validite}
              </p>
            </div>
          </div>
        </div>

        {/* Section des acomptes existants */}
        {acomptesExistants.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Acomptes créés</h3>
            <div className="space-y-2">
              {acomptesExistants.map((acompte) => (
                <div key={acompte.id} className="flex justify-between items-center bg-white p-3 rounded border">
                  <div>
                    <span className="font-medium">Facture {acompte.numero}</span>
                    <span className="ml-2 text-gray-600">({acompte.pourcentage}%)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{acompte.montant.toFixed(2)} €</div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      acompte.statut === 'Payée' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {acompte.statut}
                    </div>
                  </div>
                </div>
              ))}
                             <div className="mt-3 text-sm text-gray-600">
                 Total des acomptes: {totalMontantAcomptesExistants.toFixed(2)} € / {devis.totalTTC.toFixed(2)} €
               </div>
            </div>
          </div>
        )}

        {/* Message d'aide pour la configuration */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 print:hidden">
          <h3 className="text-lg font-medium text-amber-800 mb-2">📄 Améliorer la prévisualisation</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Pour afficher votre logo sur les devis, allez dans <strong>Paramètres → Logo de l'entreprise</strong></li>
            <li>• Configurez vos informations d'entreprise dans <strong>Paramètres → Informations générales</strong></li>
            <li>• Vérifiez l'aperçu avec le bouton <strong>&quot;Imprimer&quot;</strong> ci-dessous</li>
            <li>• Les devis s'affichent en format professionnel avec votre identité visuelle</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 print:hidden">
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={handleSendEmail}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <FaEnvelope className="mr-2" /> Envoyer par email
            </button>
            <Link 
              href={`/devis/${params.id}/modifier`}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <FaEdit className="mr-2" /> Modifier
            </Link>
            <button 
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <FaPrint className="mr-2" /> Imprimer
            </button>
            <button 
              onClick={handleConvertToInvoice}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <FaExchangeAlt className="mr-2" /> Convertir en facture
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <FaTrash className="mr-2" /> Supprimer
            </button>
          </div>

                    {/* Section des acomptes */}
          {nombreAcomptesRestants > 0 && montantRestant > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Créer des acomptes</h3>
              <div className="mb-3 text-sm text-gray-600">
                Vous pouvez créer jusqu&apos;à {nombreAcomptesRestants} acompte(s) supplémentaire(s) 
                pour un montant restant de {montantRestant.toFixed(2)}€.
              </div>
              
              {/* Boutons d'acompte prédéfinis basés sur des montants suggérés */}
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Suggestions basées sur des fractions du montant restant */}
                {devis && [
                  { label: "1/4", montant: Math.round(montantRestant * 0.25 * 100) / 100 },
                  { label: "1/3", montant: Math.round(montantRestant * 0.33 * 100) / 100 },
                  { label: "1/2", montant: Math.round(montantRestant * 0.5 * 100) / 100 },
                  { label: "2/3", montant: Math.round(montantRestant * 0.67 * 100) / 100 }
                ].filter(suggestion => suggestion.montant <= montantRestant && suggestion.montant > 0).slice(0, 3).map((suggestion) => (
                  <button
                    key={suggestion.label}
                    onClick={() => handleCreateAcomptePredefini(suggestion.montant)}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center disabled:opacity-50"
                  >
                    {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaFileInvoiceDollar className="mr-2" />}
                    {suggestion.montant.toFixed(2)}€ ({suggestion.label})
                  </button>
                ))}
                <button
                  onClick={() => setShowAcompteForm(!showAcompteForm)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" /> Montant personnalisé
                </button>
              </div>

              {/* Formulaire d'acompte personnalisé */}
              {showAcompteForm && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <label htmlFor="acompte-montant" className="text-sm font-medium">
                      Montant d&apos;acompte:
                    </label>
                    <input
                      id="acompte-montant"
                      type="number"
                      min="0.01"
                      max={montantRestant}
                      step="0.01"
                      value={acompteMontant}
                      onChange={(e) => setAcompteMontant(parseFloat(e.target.value) || 0)}
                      className="w-32 px-2 py-1 border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">€ (max: {montantRestant.toFixed(2)}€)</span>
                    <button
                      onClick={handleCreateAcompte}
                      disabled={isLoading || acompteMontant <= 0 || acompteMontant > montantRestant}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      {isLoading ? <FaSpinner className="animate-spin" /> : 'Créer'}
                    </button>
                    <button
                      onClick={() => setShowAcompteForm(false)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Annuler
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Pourcentage équivalent: {devis ? ((acompteMontant / devis.totalTTC) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Message si plus d'acomptes possibles */}
          {(nombreAcomptesRestants === 0 || montantRestant <= 0) && acomptesExistants.length > 0 && (
            <div className="border-t pt-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-yellow-800">
                  {montantRestant <= 0 
                    ? "Le total des acomptes atteint le montant du devis. Aucun acompte supplémentaire ne peut être créé."
                    : "Nombre maximum d'acomptes atteint (4). Aucun acompte supplémentaire ne peut être créé."
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reste du contenu existant... */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 print:hidden">
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold mb-2">Client</h2>
              <p className="font-medium">{devis.client.nom}</p>
              <p>{devis.client.adresse}</p>
              <p>{devis.client.codePostal} {devis.client.ville}</p>
              <p>Email: {devis.client.email}</p>
              <p>Tél: {devis.client.telephone}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold mb-2">Statut</h2>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${devis.statutColor}`}>
                {devis.statut}
              </span>
            </div>
          </div>

          {/* Tableau des lignes */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devis.lignes.map((ligne: DevisLigne, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ligne.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ligne.quantite} {ligne.unite}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(ligne.prixUnitaire.toString()).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {(parseFloat(ligne.quantite.toString()) * parseFloat(ligne.prixUnitaire.toString())).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Conditions et notes */}
        {(devis.conditions || devis.notes) && (
          <div className="bg-white rounded-lg shadow-md p-6 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-bold mb-2">Conditions</h2>
                <p className="text-gray-700">{devis.conditions}</p>
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2">Notes</h2>
                {/* Filtrer le récapitulatif au cas où il serait présent dans les notes */}
                {devis.notes?.includes('RÉCAPITULATIF DES MONTANTS:') ? (
                  <div className="text-gray-700">
                    {devis.notes.split('\n').map((line, index) => {
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
                  <p className="text-gray-700">{devis.notes}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Section visible uniquement à l'impression */}
      <div id="print-content" className="hidden print:block print-container">
        <PrintDocument 
          type="devis"
          reference={devis.numero}
          date={devis.dateOriginale || devis.date}
          echeance={devis.validiteOriginale || devis.validite}
          clientName={devis.client.nom}
          clientAddress={devis.client.adresse}
          clientZipCity={`${devis.client.codePostal} ${devis.client.ville}`}
          clientEmail={devis.client.email}
          clientPhone={devis.client.telephone}
          lines={devis.lignes}
          total={total}
          notes={devis.notes}
        />
      </div>
    </>
  );
} 