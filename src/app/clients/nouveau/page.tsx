'use client';

import { useState } from 'react';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NouveauClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    contact: '',
    email: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    ville: '',
    pays: 'France',
    notes: ''
  });

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Validation de base
      if (!formData.nom) {
        throw new Error('Le nom du client est requis');
      }
      
      // Envoi des données à l'API
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du client');
      }
      
      const data = await response.json();
      setSuccessMessage('Client créé avec succès');
      
      // Rediriger vers la page de détails du client après 2 secondes
      setTimeout(() => {
        router.push(`/clients/${data.id}`);
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Nouveau client</h1>
          <p className="text-gray-600">Créez un nouveau client dans votre base de données</p>
        </div>
        <div className="flex space-x-2">
          <Link
            href="/clients"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="nom">
              Nom / Raison sociale <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="contact">
              Personne à contacter
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="telephone">
              Téléphone
            </label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="adresse">
              Adresse
            </label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="codePostal">
              Code postal
            </label>
            <input
              type="text"
              id="codePostal"
              name="codePostal"
              value={formData.codePostal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="ville">
              Ville
            </label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="pays">
              Pays
            </label>
            <input
              type="text"
              id="pays"
              name="pays"
              value={formData.pays}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
          >
            {isLoading ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
            Créer le client
          </button>
        </div>
      </form>
    </div>
  );
} 