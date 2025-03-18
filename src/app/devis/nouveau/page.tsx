'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { FaPlus, FaTrash, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LigneDevis {
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

export default function NouveauDevis() {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validite, setValidite] = useState('');
  const [lignes, setLignes] = useState<LigneDevis[]>([
    { description: '', quantite: 1, prixUnitaire: 0, tva: 20, total: 0 }
  ]);
  const [conditions, setConditions] = useState('Paiement à 30 jours à compter de la date de facturation.');
  const [notes, setNotes] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formInitialized, setFormInitialized] = useState(false);

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

  // Calcul de la date de validité par défaut (30 jours après la date actuelle)
  useEffect(() => {
    if (!validite) {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + 30);
      setValidite(dateObj.toISOString().split('T')[0]);
    }
  }, [validite]);

  // Charger les données du formulaire depuis le localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !formInitialized) {
      const savedForm = localStorage.getItem('nouveauDevisForm');
      if (savedForm) {
        try {
          const parsedForm = JSON.parse(savedForm);
          if (parsedForm.clientId) setClientId(parsedForm.clientId);
          if (parsedForm.date) setDate(parsedForm.date);
          if (parsedForm.validite) setValidite(parsedForm.validite);
          if (parsedForm.lignes && parsedForm.lignes.length > 0) setLignes(parsedForm.lignes);
          if (parsedForm.conditions) setConditions(parsedForm.conditions);
          if (parsedForm.notes) setNotes(parsedForm.notes);
        } catch (err) {
          console.error('Erreur lors du chargement du formulaire:', err);
        }
      }
      setFormInitialized(true);
    }
  }, [formInitialized]);

  // Sauvegarder les données du formulaire dans le localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && formInitialized) {
      const formData = {
        clientId,
        date,
        validite,
        lignes,
        conditions,
        notes
      };
      localStorage.setItem('nouveauDevisForm', JSON.stringify(formData));
    }
  }, [clientId, date, validite, lignes, conditions, notes, formInitialized]);

  // Mise à jour d'une ligne
  const handleLigneChange = (index: number, field: keyof LigneDevis, value: string | number) => {
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
      
      // Vérification détaillée des lignes avec logs pour déboguer
      console.log("Lignes à valider:", JSON.stringify(lignes));
      
      const lignesInvalides = lignes.filter(ligne => 
        !ligne.description.trim() || 
        ligne.quantite <= 0 || 
        ligne.prixUnitaire < 0 || 
        isNaN(ligne.quantite) || 
        isNaN(ligne.prixUnitaire) || 
        isNaN(ligne.tva)
      );
      
      if (lignesInvalides.length > 0) {
        console.error("Lignes invalides détectées:", JSON.stringify(lignesInvalides));
        
        // Message d'erreur plus détaillé
        const messages: string[] = [];
        lignesInvalides.forEach((ligne, index) => {
          if (!ligne.description.trim()) messages.push(`La description de la ligne ${index + 1} est vide`);
          if (ligne.quantite <= 0 || isNaN(ligne.quantite)) messages.push(`La quantité de la ligne ${index + 1} est invalide`);
          if (ligne.prixUnitaire < 0 || isNaN(ligne.prixUnitaire)) messages.push(`Le prix unitaire de la ligne ${index + 1} est invalide`);
          if (isNaN(ligne.tva)) messages.push(`La TVA de la ligne ${index + 1} est invalide`);
        });
        
        throw new Error(`Veuillez remplir correctement toutes les lignes du devis: ${messages.join(', ')}`);
      }
      
      // Préparer les données
      const devisData = {
        clientId: parseInt(clientId),
        date,
        validite,
        lignes: lignes.map(ligne => ({
          description: ligne.description,
          quantite: ligne.quantite,
          prixUnitaire: ligne.prixUnitaire,
          tva: ligne.tva
        })),
        conditions,
        notes,
        totalHT,
        totalTVA,
        totalTTC
      };
      
      console.log("Données du devis à envoyer:", JSON.stringify(devisData));
      
      // Envoi des données à l'API
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devisData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API:", errorData);
        throw new Error(errorData.message || 'Erreur lors de la création du devis');
      }
      
      const data = await response.json();
      setSuccessMessage('Devis créé avec succès');
      
      // Effacer les données du localStorage après création réussie
      localStorage.removeItem('nouveauDevisForm');
      
      // Rediriger vers la page de détails du devis après 2 secondes
      setTimeout(() => {
        router.push(`/devis/${data.id}`);
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
          <h1 className="text-3xl font-bold">Nouveau devis</h1>
          <p className="text-gray-600">Créez un nouveau devis pour un client</p>
        </div>
        <div className="flex space-x-2">
          <Link 
            href="/devis" 
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

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
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
              Date de validité <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={validite}
              onChange={(e) => setValidite(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Lignes du devis</h2>
          
          <div className="table-responsive">
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 md:px-4 py-2 text-left">Description</th>
                  <th className="px-2 md:px-4 py-2 text-right">Qté</th>
                  <th className="px-2 md:px-4 py-2 text-right">Prix €</th>
                  <th className="px-2 md:px-4 py-2 text-right">TVA %</th>
                  <th className="px-2 md:px-4 py-2 text-right">Total €</th>
                  <th className="px-2 md:px-4 py-2 text-center w-10">Actions</th>
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
                        placeholder="Description"
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
                        className="w-full border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-sm"
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
                    <td className="px-2 md:px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={ligne.tva}
                        onChange={(e) => handleLigneChange(index, 'tva', e.target.value)}
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
        </div>

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