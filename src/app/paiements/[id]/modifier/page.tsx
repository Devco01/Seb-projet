"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaSave, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

// Données fictives pour un paiement existant
const paiementExistant = {
  id: "p123",
  factureId: "f789",
  montant: "500.00",
  datePaiement: "2023-06-15",
  modePaiement: "Chèque",
  reference: "CHQ12345",
  notes: "Paiement partiel"
};

export default function ModifierPaiementPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(paiementExistant);

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Paiement modifié avec succès!");
    // Redirection vers la page de détail du paiement
    window.location.href = `/paiements/${params.id}`;
  };

  const { register } = useForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Modifier le paiement</h1>
        <Link href={`/paiements/${params.id}`} className="text-blue-600 hover:text-blue-800">
          <FaTimes className="inline mr-1" />
          Annuler
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="factureId">
                ID de la facture
              </label>
              <input
                type="text"
                name="factureId"
                value={formData.factureId}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="montant">
                Montant (€)
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                id="montant"
                placeholder="Montant du paiement"
                {...register("montant", {
                  required: "Le montant est requis",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Veuillez entrer un montant valide (ex: 100 ou 100.50)"
                  },
                })}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="datePaiement">
                Date de paiement
              </label>
              <input
                type="date"
                name="datePaiement"
                value={formData.datePaiement}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="modePaiement">
                Mode de paiement
              </label>
              <select
                name="modePaiement"
                value={formData.modePaiement}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un mode de paiement</option>
                <option value="Virement">Virement bancaire</option>
                <option value="Chèque">Chèque</option>
                <option value="Espèces">Espèces</option>
                <option value="Carte">Carte bancaire</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="reference">
                Référence
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSave className="mr-2" />
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 