'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
  unite?: string;
}

// Données fictives pour une facture existante
const factureExistante = {
  id: 1,
  numero: 'F-2023-042',
  client: 'Dupont SAS',
  date: '2023-06-15',
  echeance: '2023-07-15',
  statut: 'En attente',
  devisAssocie: 'D-2023-056',
  lignes: [
    {
      description: 'Peinture murs intérieurs - Salon',
      quantite: 45,
      unite: 'm²',
      prixUnitaire: 25,
      total: 1125
    },
    {
      description: 'Peinture plafond - Salon',
      quantite: 20,
      unite: 'm²',
      prixUnitaire: 30,
      total: 600
    },
    {
      description: 'Préparation des surfaces',
      quantite: 1,
      unite: 'forfait',
      prixUnitaire: 350,
      total: 350
    }
  ],
  conditions: 'Paiement à 30 jours à compter de la date de facturation.',
  notes: 'Merci pour votre confiance.'
};

export default function ModifierFacture({ params }: { params: { id: string } }) {
  const [client, setClient] = useState('');
  const [date, setDate] = useState('');
  const [echeance, setEcheance] = useState('');
  const [lignes, setLignes] = useState<LigneFacture[]>([]);
  const [conditions, setConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [devisAssocie, setDevisAssocie] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Clients fictifs pour le dropdown
  const clients = [
    { id: 1, nom: 'Dupont SAS' },
    { id: 2, nom: 'Martin Construction' },
    { id: 3, nom: 'Dubois SARL' },
    { id: 4, nom: 'Résidences du Parc' },
  ];

  // Devis fictifs pour le dropdown
  const devis = [
    { id: 1, numero: 'D-2023-056', client: 'Dupont SAS' },
    { id: 2, numero: 'D-2023-055', client: 'Martin Construction' },
  ];

  // Chargement des données de la facture
  useEffect(() => {
    // Simulation d'un appel API pour récupérer les données de la facture
    setTimeout(() => {
      setClient(factureExistante.client);
      setDate(factureExistante.date);
      setEcheance(factureExistante.echeance);
      setLignes(factureExistante.lignes);
      setConditions(factureExistante.conditions);
      setNotes(factureExistante.notes);
      setDevisAssocie(factureExistante.devisAssocie);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

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
      const quantite = newLignes[index].quantite;
      const prixUnitaire = newLignes[index].prixUnitaire;
      
      const total = quantite * prixUnitaire;
      
      newLignes[index].total = total;
    }
    
    setLignes(newLignes);
  };

  // Ajout d'une nouvelle ligne
  const handleAjouterLigne = () => {
    setLignes([...lignes, { description: '', quantite: 1, prixUnitaire: 0, total: 0, unite: 'm²' }]);
  };

  // Suppression d'une ligne
  const handleSupprimerLigne = (index: number) => {
    const newLignes = [...lignes];
    newLignes.splice(index, 1);
    setLignes(newLignes);
  };

  // Calcul du total HT
  const total = lignes.reduce((sum, ligne) => {
    return sum + (ligne.quantite * ligne.prixUnitaire);
  }, 0);

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici, vous enverriez les données à votre API
    alert('Facture modifiée avec succès !');
    
    // Redirection vers la page de détail de la facture
    window.location.href = `/factures/${params.id}`;
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
          <h1 className="text-3xl font-bold">Modifier la facture {factureExistante.numero}</h1>
          <p className="text-gray-600">Modifiez les informations de la facture</p>
        </div>
        <div className="flex space-x-2">
          <Link 
            href={`/factures/${params.id}`} 
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
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.nom}>
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
              value={devisAssocie}
              onChange={(e) => setDevisAssocie(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Aucun devis associé</option>
              {devis.map((d) => (
                <option key={d.id} value={d.numero}>
                  {d.numero} - {d.client}
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