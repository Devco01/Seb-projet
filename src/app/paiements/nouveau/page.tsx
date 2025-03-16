'use client';

import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import { FaSave, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

export default function NouveauPaiement() {
  const [formData, setFormData] = useState({
    facture: '',
    client: '',
    date: new Date().toISOString().split('T')[0],
    montant: '',
    methode: 'Virement bancaire',
    reference: '',
    notes: ''
  });

  // Factures fictives pour le dropdown
  const factures = [
    { id: 1, numero: 'F-2023-042', client: 'Dupont SAS', montant: '2 500 €' },
    { id: 2, numero: 'F-2023-041', client: 'Martin Construction', montant: '1 800 €' },
    { id: 3, numero: 'F-2023-040', client: 'Dubois SARL', montant: '3 200 €' },
  ];

  // Méthodes de paiement disponibles
  const methodesPaiement = [
    'Virement bancaire',
    'Chèque',
    'Espèces',
    'Carte bancaire',
    'Prélèvement automatique'
  ];

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Si la facture change, mettre à jour automatiquement le client
    if (name === 'facture') {
      const factureSelectionnee = factures.find(f => f.numero === value);
      if (factureSelectionnee) {
        setFormData(prev => ({
          ...prev,
          client: factureSelectionnee.client,
          montant: factureSelectionnee.montant.replace(' €', '')
        }));
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici, vous enverriez les données à votre API
    alert('Paiement enregistré avec succès !');
    
    // Redirection vers la liste des paiements
    window.location.href = '/paiements';
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Nouveau paiement</h1>
          <p className="text-gray-600">Enregistrez un nouveau paiement pour une facture</p>
        </div>
        <div className="flex space-x-2">
          <Link 
            href="/paiements" 
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facture
              </label>
              <select
                name="facture"
                value={formData.facture}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez une facture</option>
                {factures.map((facture) => (
                  <option key={facture.id} value={facture.numero}>
                    {facture.numero} - {facture.client} - {facture.montant}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Automatiquement rempli d'après la facture sélectionnée</p>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date du paiement
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant (€)
              </label>
              <input
                type="text"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Montant par défaut d'après la facture sélectionnée</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Méthode de paiement
              </label>
              <select
                name="methode"
                value={formData.methode}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {methodesPaiement.map((methode) => (
                  <option key={methode} value={methode}>
                    {methode}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Référence du paiement
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Ex: Numéro de chèque, référence de virement..."
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="Informations supplémentaires sur ce paiement..."
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </MainLayout>
  );
} 