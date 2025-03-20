'use client';

import { useState, useEffect, Suspense } from 'react';
import { FaPlus, FaTrash, FaSave, FaTimes, FaSpinner, FaPrint } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import EnteteDocument from '@/app/components/EnteteDocument';

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

type Client = {
  id: number;
  nom: string;
  email?: string;
};

type Devis = {
  id: number;
  numero: string;
  clientId: number;
  totalTTC: number;
  statut: string;
};

// Composant qui utilise useSearchParams
function FactureFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const devisParam = searchParams?.get('devis');
  
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [echeance, setEcheance] = useState('');
  const [devisId, setDevisId] = useState(devisParam || '');
  const [lignes, setLignes] = useState<LigneFacture[]>([
    { description: '', quantite: 1, prixUnitaire: 0, total: 0 }
  ]);
  const [conditions, setConditions] = useState('Paiement à 30 jours à compter de la date de facturation.');
  const [notes, setNotes] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingDevis, setIsLoadingDevis] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formInitialized, setFormInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Récupérer les clients depuis l'API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des clients');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setClients(data);
        } else {
          console.error('Les données clients reçues ne sont pas un tableau:', data);
          setClients([]);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setClients([]);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Récupérer les devis depuis l'API
  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const response = await fetch('/api/devis');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des devis');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // Filtrer les devis qui peuvent être convertis en factures (statut accepté)
          const devisConvertibles = data.filter((devis: Devis) => 
            devis.statut?.toLowerCase() === 'accepté' || devis.statut?.toLowerCase() === 'envoyé'
          );
          setDevisList(devisConvertibles);
        } else {
          console.error('Les données devis reçues ne sont pas un tableau:', data);
          setDevisList([]);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setDevisList([]);
      } finally {
        setIsLoadingDevis(false);
      }
    };

    fetchDevis();
  }, []);

  // Calcul de la date d'échéance par défaut (30 jours après la date actuelle)
  useEffect(() => {
    if (!echeance) {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + 30);
      setEcheance(dateObj.toISOString().split('T')[0]);
    }
  }, [echeance]);

  // Charger les données du formulaire depuis le localStorage
  useEffect(() => {
    // Marquer que nous sommes côté client
    setIsClient(true);
    
    if (!formInitialized) {
      // Charger les données nécessaires
      const fetchData = async () => {
        try {
          const clientsResponse = await fetch('/api/clients');
          const clientsData = await clientsResponse.json();
          setClients(clientsData);
      
          // Générer un numéro de facture
          // ... code existant ...
          
          setFormInitialized(true);
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
        }
      };
      
      fetchData();
    }
  }, [formInitialized]);

  // Mise à jour d'une ligne
  const handleLigneChange = (index: number, field: keyof LigneFacture, value: string | number) => {
    const newLignes = [...lignes];
    
    if (field === 'description') {
      newLignes[index][field] = value as string;
    } else {
      newLignes[index][field] = Number(value);
    }
    
    // Recalculer le total de la ligne
    if (field === 'quantite' || field === 'prixUnitaire') {
      const quantite = newLignes[index].quantite;
      const prixUnitaire = newLignes[index].prixUnitaire;
      
      const total = quantite * prixUnitaire;
      
      newLignes[index].total = Number(total.toFixed(2));
    }
    
    setLignes(newLignes);
  };

  // Ajouter une nouvelle ligne
  const handleAjouterLigne = () => {
    setLignes([...lignes, { description: '', quantite: 1, prixUnitaire: 0, total: 0 }]);
  };

  // Supprimer une ligne
  const handleSupprimerLigne = (index: number) => {
    if (lignes.length > 1) {
      const newLignes = [...lignes];
      newLignes.splice(index, 1);
      setLignes(newLignes);
    }
  };

  // Gérer le changement de devis
  const handleDevisChange = async (id: string) => {
    setDevisId(id);
    
    if (id) {
      try {
        const response = await fetch(`/api/devis/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du devis');
        }
        
        const devis = await response.json();
        
        // Mettre à jour le client
        setClientId(devis.clientId.toString());
        
        // Mettre à jour les lignes
        if (devis.lignes && devis.lignes.length > 0) {
          const newLignes = devis.lignes.map((ligne: {
            description: string;
            quantite: number;
            prixUnitaire: number;
          }) => ({
            description: ligne.description,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            total: Number((ligne.quantite * ligne.prixUnitaire).toFixed(2))
          }));
          
          setLignes(newLignes);
        }
        
        // Mettre à jour les conditions et notes
        if (devis.conditions) {
          setConditions(devis.conditions);
        }
        
        if (devis.notes) {
          setNotes(devis.notes);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
    }
  };

  // Calculer les totaux
  const totalHT = lignes.reduce((sum, ligne) => sum + (ligne.quantite * ligne.prixUnitaire), 0);
  const totalTTC = totalHT;

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Validation de base
      if (!clientId) {
        throw new Error('Veuillez sélectionner un client');
      }
      
      if (lignes.some(ligne => !ligne.description || ligne.quantite <= 0)) {
        throw new Error('Veuillez remplir correctement toutes les lignes de la facture');
      }
      
      // Préparer les données pour l'API
      const factureData = {
        clientId: parseInt(clientId),
        date,
        echeance,
        devisId: devisId ? parseInt(devisId) : null,
        lignes: lignes.map(ligne => ({
          description: ligne.description,
          quantite: ligne.quantite,
          prixUnitaire: ligne.prixUnitaire
        })),
        conditions,
        notes,
        totalHT,
        totalTTC
      };
      
      // Envoyer les données à l'API
      const response = await fetch('/api/factures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(factureData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la facture');
      }
      
      const result = await response.json();
      setSuccessMessage('Facture créée avec succès');
      
      // Redirection vers la page de la facture
      router.push(`/factures/${result.id}`);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour imprimer
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container px-4 py-8 mx-auto print:px-0">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Nouvelle Facture</h1>
        <div className="flex space-x-2">
          <Link
            href="/factures"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
          >
            <FaTimes className="mr-2" /> Annuler
          </Link>
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <FaPrint className="mr-2" /> Aperçu
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6 print:shadow-none print:p-0">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md print:hidden">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md print:hidden">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="print:block">
          <div className="print:hidden">
            <EnteteDocument title="Facture" />
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="client">
                  Client
                </label>
                <select
                  id="client"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  disabled={isLoadingClients || Boolean(devisId)}
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">
                  Date de facturation
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="echeance">
                  Date d&apos;échéance
                </label>
                <input
                  type="date"
                  id="echeance"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={echeance}
                  onChange={(e) => setEcheance(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="devis">
                Basé sur un devis
              </label>
              <select
                id="devis"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={devisId}
                onChange={(e) => handleDevisChange(e.target.value)}
                disabled={isLoadingDevis}
              >
                <option value="">Aucun</option>
                {devisList.map((devis) => (
                  <option key={devis.id} value={devis.id}>
                    {devis.numero} - Total: {devis.totalTTC.toFixed(2)} €
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Lignes de facture</h3>
                <button
                  type="button"
                  onClick={handleAjouterLigne}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center text-sm"
                >
                  <FaPlus className="mr-1" /> Ajouter une ligne
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-right w-24">Quantité</th>
                      <th className="p-2 text-right w-32">Prix unitaire</th>
                      <th className="p-2 text-right w-32">Total</th>
                      <th className="p-2 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lignes.map((ligne, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded-md"
                            value={ligne.description}
                            onChange={(e) => handleLigneChange(index, 'description', e.target.value)}
                            required
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            className="w-full p-1 border border-gray-300 rounded-md text-right"
                            value={ligne.quantite}
                            onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)}
                            min="1"
                            step="1"
                            required
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            className="w-full p-1 border border-gray-300 rounded-md text-right"
                            value={ligne.prixUnitaire}
                            onChange={(e) => handleLigneChange(index, 'prixUnitaire', e.target.value)}
                            min="0"
                            step="0.01"
                            required
                          />
                        </td>
                        <td className="p-2 text-right">
                          {ligne.total.toFixed(2)} €
                        </td>
                        <td className="p-2 text-center">
                          {lignes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleSupprimerLigne(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-medium">
                      <td colSpan={3} className="p-2 text-right">Total HT:</td>
                      <td className="p-2 text-right">{totalHT.toFixed(2)} €</td>
                      <td></td>
                    </tr>
                    <tr className="border-t font-bold">
                      <td colSpan={3} className="p-2 text-right">Total TTC:</td>
                      <td className="p-2 text-right">{totalTTC.toFixed(2)} €</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="conditions">
                  Conditions de paiement
                </label>
                <textarea
                  id="conditions"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            <div className="text-right">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center ml-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Enregistrement...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Version imprimable */}
          <div className="hidden print:block">
            {isClient && (
              <>
                <EnteteDocument title="Facture" />
                
                <div className="mb-8">
                  <div className="flex justify-between mb-6">
                    <div>
                      <p><strong>Date:</strong> {new Date(date).toLocaleDateString('fr-FR')}</p>
                      <p><strong>Échéance:</strong> {new Date(echeance).toLocaleDateString('fr-FR')}</p>
                    </div>
                    
                    <div className="text-right">
                      <p><strong>Client:</strong> {clients.find(c => c.id.toString() === clientId)?.nom || ''}</p>
                    </div>
                  </div>
                  
                  <table className="w-full mb-6">
                    <thead>
                      <tr className="border-b-2 border-gray-400">
                        <th className="py-2 text-left">Description</th>
                        <th className="py-2 text-right">Qté</th>
                        <th className="py-2 text-right">Prix unitaire</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignes.map((ligne, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{ligne.description}</td>
                          <td className="py-2 text-right">{ligne.quantite}</td>
                          <td className="py-2 text-right">{ligne.prixUnitaire.toFixed(2)} €</td>
                          <td className="py-2 text-right">{ligne.total.toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold border-t">
                        <td colSpan={3} className="py-2 text-right">Total TTC:</td>
                        <td className="py-2 text-right">{totalTTC.toFixed(2)} €</td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  <div className="mb-4">
                    <h3 className="font-bold mb-1">Conditions de paiement:</h3>
                    <p>{conditions}</p>
                  </div>
                  
                  {notes && (
                    <div>
                      <h3 className="font-bold mb-1">Notes:</h3>
                      <p>{notes}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant de chargement pour le Suspense
function FactureLoading() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Nouvelle Facture</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full mb-4"></div>
          <p className="text-gray-600">Chargement du formulaire...</p>
        </div>
      </div>
    </div>
  );
}

// Composant principal enveloppé dans Suspense
export default function NouvelleFacture() {
  return (
    <Suspense fallback={<FactureLoading />}>
      <FactureFormContent />
    </Suspense>
  );
} 