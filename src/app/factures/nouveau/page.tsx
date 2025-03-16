'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { FaPlus, FaTrash, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
  tva: number;
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
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [echeance, setEcheance] = useState('');
  const [lignes, setLignes] = useState<LigneFacture[]>([
    { description: '', quantite: 1, prixUnitaire: 0, tva: 20, total: 0 }
  ]);
  const [conditions, setConditions] = useState('Paiement à 30 jours à compter de la date de facturation.');
  const [notes, setNotes] = useState('');
  const [devisId, setDevisId] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingDevis, setIsLoadingDevis] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Récupérer les clients depuis l'API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des clients');
        }
        const data = await response.json();
        setClients(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
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
        // Filtrer les devis qui peuvent être convertis en factures (statut accepté)
        const devisConvertibles = data.filter((devis: Devis) => 
          devis.statut?.toLowerCase() === 'accepté' || devis.statut?.toLowerCase() === 'envoyé'
        );
        setDevisList(devisConvertibles);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setIsLoadingDevis(false);
      }
    };

    fetchDevis();
  }, []);

  // Calcul de la date d'échéance par défaut (30 jours après la date actuelle)
  useEffect(() => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 30);
    setEcheance(dateObj.toISOString().split('T')[0]);
  }, []);

  // Mise à jour d'une ligne
  const handleLigneChange = (index: number, field: keyof LigneFacture, value: string | number) => {
    const newLignes = [...lignes];
    
    if (field === 'description') {
      newLignes[index][field] = value as string;
    } else {
      newLignes[index][field] = Number(value);
    }
    
    // Recalculer le total de la ligne
    if (field === 'quantite' || field === 'prixUnitaire' || field === 'tva') {
      const quantite = newLignes[index].quantite;
      const prixUnitaire = newLignes[index].prixUnitaire;
      const tva = newLignes[index].tva;
      
      const totalHT = quantite * prixUnitaire;
      const totalTTC = totalHT * (1 + tva / 100);
      
      newLignes[index].total = Number(totalTTC.toFixed(2));
    }
    
    setLignes(newLignes);
  };

  // Ajouter une nouvelle ligne
  const handleAjouterLigne = () => {
    setLignes([...lignes, { description: '', quantite: 1, prixUnitaire: 0, tva: 20, total: 0 }]);
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
            tva: number;
          }) => ({
            description: ligne.description,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            tva: ligne.tva,
            total: Number((ligne.quantite * ligne.prixUnitaire * (1 + ligne.tva / 100)).toFixed(2))
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
  const totalTVA = lignes.reduce((sum, ligne) => {
    const ht = ligne.quantite * ligne.prixUnitaire;
    return sum + (ht * ligne.tva / 100);
  }, 0);
  const totalTTC = totalHT + totalTVA;

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
          tva: ligne.tva
        })),
        conditions,
        notes,
        devisId: devisId ? parseInt(devisId) : undefined,
        totalHT,
        totalTVA,
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

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Nouvelle facture</h1>
          <p className="text-gray-600">Créez une nouvelle facture pour un client</p>
        </div>
        <div className="flex space-x-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devis associé
            </label>
            <select
              value={devisId}
              onChange={(e) => handleDevisChange(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoadingDevis}
            >
              <option value="">Aucun devis associé</option>
              {isLoadingDevis ? (
                <option value="" disabled>Chargement des devis...</option>
              ) : (
                devisList.map((devis) => (
                  <option key={devis.id} value={devis.id}>
                    {devis.numero}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoadingClients || devisId !== ''}
            >
              <option value="">Sélectionnez un client</option>
              {isLoadingClients ? (
                <option value="" disabled>Chargement des clients...</option>
              ) : (
                clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom}
                  </option>
                ))
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
              Date d'échéance <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={echeance}
              onChange={(e) => setEcheance(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Lignes de la facture</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Quantité</th>
                  <th className="px-4 py-2 text-right">Prix unitaire (€)</th>
                  <th className="px-4 py-2 text-right">TVA (%)</th>
                  <th className="px-4 py-2 text-right">Total (€)</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={ligne.description}
                        onChange={(e) => handleLigneChange(index, 'description', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description du produit ou service"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={ligne.quantite}
                        onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={ligne.prixUnitaire}
                        onChange={(e) => handleLigneChange(index, 'prixUnitaire', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={ligne.tva}
                        onChange={(e) => handleLigneChange(index, 'tva', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        required
                      />
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {ligne.total.toFixed(2)} €
                    </td>
                    <td className="px-4 py-2 text-center">
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
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Ajouter une ligne
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          <div className="w-64">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total HT:</span>
              <span>{totalHT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total TVA:</span>
              <span>{totalTVA.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total TTC:</span>
              <span>{totalTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </form>
    </MainLayout>
  );
} 