'use client';

import { useState, useEffect } from 'react';
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

export default function NouvelleFacture() {
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
      
      // Préparer les données
      const factureData = {
        clientId: parseInt(clientId),
        date,
        echeance,
        lignes: lignes.map(ligne => ({
          description: ligne.description,
          quantite: ligne.quantite,
          prixUnitaire: ligne.prixUnitaire,
        })),
        conditions,
        notes,
        devisId: devisId ? parseInt(devisId) : undefined,
        totalHT,
        totalTTC
      };
      
      // Envoi des données à l'API
      const response = await fetch('/api/factures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(factureData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la facture');
      }
      
      const data = await response.json();
      setSuccessMessage('Facture créée avec succès');
      
      // Effacer les données du localStorage après création réussie
      localStorage.removeItem('nouvelleFactureForm');
      
      // Rediriger vers la page de détails de la facture après 2 secondes
      setTimeout(() => {
        router.push(`/factures/${data.id}`);
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour imprimer la facture
  const handlePrint = () => {
    window.print();
  };

  // Conditionnellement rendre le contenu uniquement côté client
  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nouvelle facture</h1>
          <p className="text-gray-600">Créez une nouvelle facture pour un client</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={handlePrint}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPrint className="mr-2" /> Imprimer
          </button>
          <Link
            href="/factures"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaTimes className="mr-2" /> Annuler
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {isLoading ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
            Enregistrer
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoadingClients}
            >
              <option value="">Sélectionnez un client</option>
              {isLoadingClients ? (
                <option value="" disabled>Chargement des clients...</option>
              ) : (
                Array.isArray(clients) ? 
                clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom}
                  </option>
                )) : 
                <option value="" disabled>Erreur lors du chargement des clients</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d&apos;échéance <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={echeance}
              onChange={(e) => setEcheance(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devis associé (optionnel)
            </label>
            <select
              value={devisId}
              onChange={(e) => handleDevisChange(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Aucun devis associé</option>
              {isLoadingDevis ? (
                <option value="" disabled>Chargement des devis...</option>
              ) : (
                Array.isArray(devisList) ? 
                devisList.map((devis) => (
                  <option key={devis.id} value={devis.id}>
                    {devis.numero} - {devis.clientId} - {devis.totalTTC.toFixed(2)} €
                  </option>
                )) :
                <option value="" disabled>Erreur lors du chargement des devis</option>
              )}
            </select>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 border-b pb-2">Lignes de la facture</h2>
        
        <div className="mb-6 overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 md:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-2 md:px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qté</th>
                <th className="px-2 md:px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">PU (€)</th>
                <th className="px-2 md:px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-2 md:px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((ligne, index) => (
                <tr key={index} className="border-b">
                  <td className="px-2 md:px-4 py-2">
                    <input
                      type="text"
                      value={ligne.description}
                      onChange={(e) => handleLigneChange(index, 'description', e.target.value)}
                      className="w-full border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Description de la prestation ou du produit"
                      required
                    />
                  </td>
                  <td className="px-2 md:px-4 py-2">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={ligne.quantite}
                      onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)}
                      className="w-full border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-sm"
                      required
                    />
                  </td>
                  <td className="px-2 md:px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={ligne.prixUnitaire}
                      onChange={(e) => handleLigneChange(index, 'prixUnitaire', e.target.value)}
                      className="w-full border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-sm"
                      required
                    />
                  </td>
                  <td className="px-2 md:px-4 py-2 text-right font-medium text-sm">
                    {ligne.total.toFixed(2)} €
                  </td>
                  <td className="px-2 md:px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleSupprimerLigne(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={lignes.length === 1}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button
          type="button"
          onClick={handleAjouterLigne}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center text-sm"
        >
          <FaPlus className="mr-2" /> Ajouter une ligne
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conditions de paiement
            </label>
            <textarea
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-64">
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total:</span>
              <span>{totalTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </form>

      {/* Section d'aperçu pour l'impression */}
      <div className="hidden print:block mt-8">
        <EnteteDocument title="Facture" subtitle={`Facture créée le ${date}`} />
        
        {/* Contenu pour l'impression */}
        <div className="mt-6">
          {clientId && (
            <div className="mb-4">
              <h2 className="font-bold mb-2">Client</h2>
              <p>{clients.find(c => c.id.toString() === clientId)?.nom}</p>
            </div>
          )}
          
          <div className="mb-4">
            <h2 className="font-bold mb-2">Détails de la facture</h2>
            <p>Date: {date}</p>
            <p>Échéance: {echeance}</p>
            {devisId && <p>Devis associé: {devisList.find(d => d.id.toString() === devisId)?.numero}</p>}
          </div>
          
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Description</th>
                <th className="text-right pb-2">Quantité</th>
                <th className="text-right pb-2">Prix unitaire</th>
                <th className="text-right pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((ligne, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{ligne.description}</td>
                  <td className="text-right py-2">{ligne.quantite}</td>
                  <td className="text-right py-2">{ligne.prixUnitaire.toFixed(2)} €</td>
                  <td className="text-right py-2">{ligne.total.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right pt-2 font-bold">Total:</td>
                <td className="text-right pt-2 font-bold">
                  {lignes.reduce((sum, ligne) => sum + ligne.total, 0).toFixed(2)} €
                </td>
              </tr>
            </tfoot>
          </table>
          
          {conditions && (
            <div className="mb-4">
              <h2 className="font-bold mb-2">Conditions</h2>
              <p>{conditions}</p>
            </div>
          )}
          
          {notes && (
            <div>
              <h2 className="font-bold mb-2">Notes</h2>
              <p>{notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 