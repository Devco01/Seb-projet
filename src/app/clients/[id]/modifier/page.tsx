'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../../components/MainLayout';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Type pour les clients
type Client = {
  id: number;
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  pays?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export default function ModifierClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    ville: '',
    pays: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Chargement des données du client
  useEffect(() => {
    const fetchClient = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/clients/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données du client');
        }
        
        const client: Client = await response.json();
        
        setFormData({
          nom: client.nom || '',
          email: client.email || '',
          telephone: client.telephone || '',
          adresse: client.adresse || '',
          codePostal: client.codePostal || '',
          ville: client.ville || '',
          pays: client.pays || '',
          notes: client.notes || ''
        });
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Validation de base
      if (!formData.nom) {
        throw new Error('Le nom du client est requis');
      }
      
      const response = await fetch(`/api/clients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du client');
      }
      
      setSuccessMessage('Client mis à jour avec succès');
      
      // Rediriger vers la page de détails du client après 2 secondes
      setTimeout(() => {
        router.push(`/clients/${params.id}`);
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Modifier le client</h1>
          <p className="text-gray-600">Mettez à jour les informations du client</p>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/clients/${params.id}`}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaTimes className="mr-2" /> Annuler
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {isSaving ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
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

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Chargement des données du client...</p>
          </div>
        </div>
      ) : (
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
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
            >
              {isSaving ? <FaSpinner className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
              Enregistrer les modifications
            </button>
          </div>
        </form>
      )}
    </MainLayout>
  );
} 