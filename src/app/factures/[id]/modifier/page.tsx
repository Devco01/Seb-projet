'use client';

import { useState, useEffect, Suspense } from 'react';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
  unite?: string;
}

export default function ModifierFacture({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la facture...</p>
        </div>
      </div>
    }>
      <ModifierFactureForm id={params.id} />
    </Suspense>
  );
}

function ModifierFactureForm({ id }: { id: string }) {
  const router = useRouter();
  
  const [date, setDate] = useState('');
  const [echeance, setEcheance] = useState('');
  const [lignes, setLignes] = useState<LigneFacture[]>([]);
  const [conditions, setConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [numero, setNumero] = useState('');
  const [clientId, setClientId] = useState('');
  const [devisId, setDevisId] = useState('');
  
  interface Client {
    id: number;
    nom: string;
    email?: string;
  }
  
  interface Devis {
    id: number;
    numero: string;
    client?: {
      id: number;
      nom: string;
    };
  }
  
  const [clients, setClients] = useState<Client[]>([]);
  const [devisList, setDevisList] = useState<Devis[]>([]);

  // Chargement des données de la facture
  useEffect(() => {
    const fetchFacture = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/factures/${id}`);
        
        if (!response.ok) {
          throw new Error('Impossible de charger les données de la facture');
        }
        
        const data = await response.json();
        console.log('Données de la facture chargées:', data);
        
        setNumero(data.numero);
        setClientId(data.clientId.toString());
        setDate(new Date(data.date).toISOString().split('T')[0]);
        setEcheance(new Date(data.echeance).toISOString().split('T')[0]);
        
        // Parse des lignes si elles sont stockées en format JSON
        let lignesData = [];
        try {
          if (typeof data.lignes === 'string') {
            lignesData = JSON.parse(data.lignes);
          } else if (Array.isArray(data.lignes)) {
            lignesData = data.lignes;
          }
        } catch (e) {
          console.error('Erreur lors du parsing des lignes:', e);
          lignesData = [];
        }
        
        setLignes(lignesData);
        setConditions(data.conditions || '');
        setNotes(data.notes || '');
        setDevisId(data.devisId?.toString() || '');
      } catch (error) {
        console.error('Erreur lors du chargement de la facture:', error);
        toast.error('Erreur lors du chargement de la facture');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        } else {
          console.error('Erreur lors du chargement des clients');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    const fetchDevis = async () => {
      try {
        const response = await fetch('/api/devis');
        if (response.ok) {
          const data = await response.json();
          setDevisList(data);
        } else {
          console.error('Erreur lors du chargement des devis');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchFacture();
    fetchClients();
    fetchDevis();
  }, [id]);

  // Mise à jour d'une ligne
  const handleLigneChange = (index: number, field: keyof LigneFacture, value: string | number) => {
    const newLignes = [...lignes];
    
    if (field === 'description' || field === 'unite') {
      newLignes[index][field] = value as string;
    } else {
      newLignes[index][field] = Number(value);
    }
    
    // Recalcul du total de la ligne
    if (field === 'quantite' || field === 'prixUnitaire') {
      const quantite = newLignes[index].quantite || 0;
      const prixUnitaire = newLignes[index].prixUnitaire || 0;
      
      const total = quantite * prixUnitaire;
      
      newLignes[index].total = total;
    }
    
    setLignes(newLignes);
  };

  // Ajout d'une nouvelle ligne
  const handleAjouterLigne = () => {
    setLignes([...lignes, { 
      description: '', 
      quantite: 1, 
      prixUnitaire: 0, 
      total: 0, 
      unite: 'm²' 
    }]);
  };

  // Suppression d'une ligne
  const handleSupprimerLigne = (index: number) => {
    const newLignes = [...lignes];
    newLignes.splice(index, 1);
    setLignes(newLignes);
  };

  // Calcul du total HT
  const total = lignes.reduce((sum, ligne) => {
    // Vérifier si les propriétés nécessaires existent
    const quantite = ligne.quantite || 0;
    const prixUnitaire = ligne.prixUnitaire || 0;
    return sum + (quantite * prixUnitaire);
  }, 0);

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const facture = {
        clientId: parseInt(clientId),
        date,
        echeance,
        statut: 'En attente', // Statut par défaut
        lignes,
        conditions,
        notes,
        devisId: devisId ? parseInt(devisId) : null,
      };

      const response = await fetch(`/api/factures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facture),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification de la facture');
      }

      toast.success('Facture modifiée avec succès !');
      router.push(`/factures/${id}`);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la facture...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Modifier la facture {numero}</h1>
          <p className="text-gray-600">Modifiez les informations de la facture</p>
        </div>
        <div className="flex space-x-2">
          <Link 
            href={`/factures/${id}`} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaTimes className="mr-2" /> Annuler
          </Link>
          <button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaSave className="mr-2" /> Enregistrer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
              }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id.toString()}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devis associé (optionnel)
            </label>
            <select
              value={devisId}
              onChange={(e) => {
                setDevisId(e.target.value);
              }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Aucun devis associé</option>
              {devisList.map((d) => (
                <option key={d.id} value={d.id.toString()}>
                  {d.numero} - {d.client?.nom || 'Client inconnu'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
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
                Échéance
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
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Prestations</h2>
            <button
              type="button"
              onClick={handleAjouterLigne}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <FaPlus className="mr-1" /> Ajouter une ligne
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unité
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire (€)
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (€)
                  </th>
                  <th className="px-4 py-2">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={ligne.description}
                        onChange={(e) => handleLigneChange(index, 'description', e.target.value)}
                        className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Description"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={ligne.quantite}
                        onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)}
                        className="w-20 border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={ligne.unite}
                        onChange={(e) => handleLigneChange(index, 'unite', e.target.value)}
                        className="w-16 border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="m²"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={ligne.prixUnitaire}
                        onChange={(e) => handleLigneChange(index, 'prixUnitaire', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={ligne.total.toFixed(2)}
                        className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-2">
                      {lignes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleSupprimerLigne(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium">Total:</td>
                  <td className="px-4 py-2 font-bold">{total.toFixed(2)} €</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
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
              placeholder="Notes ou informations supplémentaires..."
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
} 