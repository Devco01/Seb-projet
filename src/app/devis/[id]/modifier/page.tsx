'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../../components/MainLayout';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

interface LigneDevis {
  description: string;
  quantite: number;
  prixUnitaire: number;
  tva: number;
  total: number;
  unite?: string;
}

// Données fictives pour un devis existant
const devisExistant = {
  id: 1,
  numero: 'D-2023-056',
  client: 'Dupont SAS',
  date: '2023-06-20',
  validite: '2023-07-20',
  statut: 'En attente',
  lignes: [
    {
      description: 'Peinture murs intérieurs - Salon',
      quantite: 45,
      unite: 'm²',
      prixUnitaire: 25,
      tva: 20,
      total: 1350
    },
    {
      description: 'Peinture plafond - Salon',
      quantite: 20,
      unite: 'm²',
      prixUnitaire: 30,
      tva: 20,
      total: 720
    },
    {
      description: 'Préparation des surfaces',
      quantite: 1,
      unite: 'forfait',
      prixUnitaire: 350,
      tva: 20,
      total: 420
    }
  ],
  conditions: 'Paiement à 30 jours à compter de la date de facturation.',
  notes: 'Devis valable pour une durée de 30 jours. Les travaux pourront commencer 2 semaines après acceptation du devis.'
};

export default function ModifierDevis({ params }: { params: { id: string } }) {
  const [client, setClient] = useState('');
  const [date, setDate] = useState('');
  const [validite, setValidite] = useState('');
  const [lignes, setLignes] = useState<LigneDevis[]>([]);
  const [conditions, setConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Clients fictifs pour le dropdown
  const clients = [
    { id: 1, nom: 'Dupont SAS' },
    { id: 2, nom: 'Martin Construction' },
    { id: 3, nom: 'Dubois SARL' },
    { id: 4, nom: 'Résidences du Parc' },
  ];

  // Chargement des données du devis
  useEffect(() => {
    // Simulation d'un appel API pour récupérer les données du devis
    setTimeout(() => {
      setClient(devisExistant.client);
      setDate(devisExistant.date);
      setValidite(devisExistant.validite);
      setLignes(devisExistant.lignes);
      setConditions(devisExistant.conditions);
      setNotes(devisExistant.notes);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  // Mise à jour d'une ligne
  const handleLigneChange = (index: number, field: keyof LigneDevis, value: string | number) => {
    const newLignes = [...lignes];
    
    if (field === 'description' || field === 'unite') {
      newLignes[index][field] = value as string;
    } else {
      newLignes[index][field] = Number(value);
    }
    
    // Recalcul du total de la ligne
    if (field === 'quantite' || field === 'prixUnitaire' || field === 'tva') {
      const quantite = newLignes[index].quantite;
      const prixUnitaire = newLignes[index].prixUnitaire;
      const tva = newLignes[index].tva;
      
      const totalHT = quantite * prixUnitaire;
      const totalTTC = totalHT * (1 + tva / 100);
      
      newLignes[index].total = totalTTC;
    }
    
    setLignes(newLignes);
  };

  // Ajout d'une nouvelle ligne
  const handleAjouterLigne = () => {
    setLignes([...lignes, { description: '', quantite: 1, prixUnitaire: 0, tva: 20, total: 0, unite: 'm²' }]);
  };

  // Suppression d'une ligne
  const handleSupprimerLigne = (index: number) => {
    const newLignes = [...lignes];
    newLignes.splice(index, 1);
    setLignes(newLignes);
  };

  // Calcul du total HT
  const totalHT = lignes.reduce((sum, ligne) => {
    return sum + (ligne.quantite * ligne.prixUnitaire);
  }, 0);

  // Calcul du total TVA
  const totalTVA = lignes.reduce((sum, ligne) => {
    return sum + (ligne.quantite * ligne.prixUnitaire * ligne.tva / 100);
  }, 0);

  // Calcul du total TTC
  const totalTTC = totalHT + totalTVA;

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici, vous enverriez les données à votre API
    alert('Devis modifié avec succès !');
    
    // Redirection vers la page de détail du devis
    window.location.href = `/devis/${params.id}`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du devis...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Modifier le devis {devisExistant.numero}</h1>
          <p className="text-gray-600">Modifiez les informations du devis</p>
        </div>
        <div className="flex space-x-2">
          <Link 
            href={`/devis/${params.id}`} 
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
                Validité
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unité
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire (€)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TVA (%)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (€)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                        min="0"
                        step="0.01"
                        value={ligne.prixUnitaire}
                        onChange={(e) => handleLigneChange(index, 'prixUnitaire', e.target.value)}
                        className="w-24 border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ligne.tva}
                        onChange={(e) => handleLigneChange(index, 'tva', e.target.value)}
                        className="w-16 border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {ligne.total.toFixed(2)}
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
                  <td colSpan={4} className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium">Total HT:</td>
                  <td className="px-4 py-2 font-medium">{totalHT.toFixed(2)} €</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium">Total TVA:</td>
                  <td className="px-4 py-2 font-medium">{totalTVA.toFixed(2)} €</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium">Total TTC:</td>
                  <td className="px-4 py-2 font-bold">{totalTTC.toFixed(2)} €</td>
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
    </MainLayout>
  );
} 