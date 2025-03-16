import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export interface Client {
  id: number;
  nom: string;
  contact?: string;
  email: string;
  telephone?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  siret?: string;
  tva?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  nom: string;
  contact?: string;
  email: string;
  telephone?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  siret?: string;
  tva?: string;
  notes?: string;
}

export function useClients() {
  const api = useApi<any>();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer tous les clients
  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/clients');
      
      if (response.error) {
        setError(response.error);
      } else {
        setClients(response.data);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer un client par son ID
  const fetchClientById = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/clients/${id}`);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la récupération du client');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau client
  const createClient = async (clientData: ClientFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/clients', clientData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des clients
      await fetchClients();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la création du client');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un client
  const updateClient = async (id: number, clientData: ClientFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/api/clients/${id}`, clientData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des clients
      await fetchClients();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la mise à jour du client');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un client
  const deleteClient = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/api/clients/${id}`);
      
      if (response.error) {
        setError(response.error);
        return false;
      }
      
      // Mettre à jour la liste des clients
      await fetchClients();
      
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression du client');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Charger les clients au montage du composant
  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
    fetchClientById,
    createClient,
    updateClient,
    deleteClient,
  };
} 