import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { Client } from './useClients';
import { Facture } from './useFactures';

export interface Paiement {
  id: number;
  factureId: number;
  facture?: Facture;
  clientId: number;
  client?: Client;
  date: string;
  montant: number;
  methode: 'Virement bancaire' | 'Chèque' | 'Espèces' | 'Carte bancaire' | 'Prélèvement';
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaiementFormData {
  factureId: number;
  clientId: number;
  date: string;
  montant: number;
  methode: 'Virement bancaire' | 'Chèque' | 'Espèces' | 'Carte bancaire' | 'Prélèvement';
  reference?: string;
  notes?: string;
}

export function usePaiements() {
  const api = useApi<Paiement[] | Paiement>();
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Récupérer tous les paiements
  const fetchPaiements = useCallback(async () => {
    // Éviter les appels multiples si déjà en cours de chargement
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/paiements');
      
      if (response.error) {
        setError(response.error);
      } else if (Array.isArray(response.data)) {
        setPaiements(response.data);
        setIsInitialized(true);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des paiements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [api, loading]);

  // Récupérer un paiement par son ID
  const fetchPaiementById = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/paiements/${id}`);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la récupération du paiement');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les paiements par facture
  const fetchPaiementsByFacture = async (factureId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/factures/${factureId}/paiements`);
      
      if (response.error) {
        setError(response.error);
        return [];
      }
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la récupération des paiements de la facture');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau paiement
  const createPaiement = async (paiementData: PaiementFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/paiements', paiementData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des paiements
      await fetchPaiements();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la création du paiement');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un paiement
  const updatePaiement = async (id: number, paiementData: PaiementFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/api/paiements/${id}`, paiementData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des paiements
      await fetchPaiements();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la mise à jour du paiement');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un paiement
  const deletePaiement = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/api/paiements/${id}`);
      
      if (response.error) {
        setError(response.error);
        return false;
      }
      
      // Mettre à jour la liste des paiements
      await fetchPaiements();
      
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression du paiement');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Charger les paiements au montage du composant, une seule fois
  useEffect(() => {
    if (!isInitialized) {
      fetchPaiements();
    }
  }, [fetchPaiements, isInitialized]);

  return {
    paiements,
    loading,
    error,
    fetchPaiements,
    fetchPaiementById,
    fetchPaiementsByFacture,
    createPaiement,
    updatePaiement,
    deletePaiement,
  };
} 