'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
  tva: number;
  total: number;
}

export default function NouvelleFacture() {
  const [client, setClient] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [echeance, setEcheance] = useState('');
  const [lignes, setLignes] = useState<LigneFacture[]>([
    { description: '', quantite: 1, prixUnitaire: 0, tva: 20, total: 0 }
  ]);
  const [conditions, setConditions] = useState('Paiement à 30 jours à compter de la date de facturation.');
  const [notes, setNotes] = useState('');
  const [devisAssocie, setDevisAssocie] = useState('');

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
    setLignes([...lignes, { description: '', quantite: 1, prixUnitaire: 0, tva: 20, total: 0 }]);
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
    alert('Facture créée avec succès !');
    
    // Redirection vers la liste des factures
    window.location.href = '/factures';
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
              {clients.map((client) => (
                <option key={client.id} value={client.nom}>
                  {client.nom}
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
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
                  <td colSpan={3} className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium">Total HT:</td>
                  <td className="px-4 py-2 font-medium">{totalHT.toFixed(2)} €</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium">Total TVA:</td>
                  <td className="px-4 py-2 font-medium">{totalTVA.toFixed(2)} €</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2"></td>
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