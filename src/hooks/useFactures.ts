import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { Client } from './useClients';
import { LigneDevis } from './useDevis';

export interface LigneFacture extends LigneDevis {
  // Propriétés spécifiques aux lignes de facture
  factureId?: number;
}

export interface Facture {
  id: number;
  numero: string;
  clientId: number;
  client?: Client;
  date: string;
  echeance: string;
  statut: 'En attente' | 'Payée' | 'Partiellement payée' | 'En retard' | 'Annulée';
  lignes: LigneFacture[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  totalPaye: number;
  resteAPayer: number;
  conditions?: string;
  notes?: string;
  devisId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FactureFormData {
  clientId: number;
  date: string;
  echeance: string;
  statut: 'En attente' | 'Payée' | 'Partiellement payée' | 'En retard' | 'Annulée';
  lignes: Omit<LigneFacture, 'id'>[];
  conditions?: string;
  notes?: string;
  devisId?: number;
}

export function useFactures() {
  const api = useApi<Facture[] | Facture>();
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les factures
  const fetchFactures = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/factures');
      
      if (response.error) {
        setError(response.error);
      } else if (Array.isArray(response.data)) {
        setFactures(response.data);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des factures');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Récupérer une facture par son ID
  const fetchFactureById = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/factures/${id}`);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la récupération de la facture');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle facture
  const createFacture = async (factureData: FactureFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/factures', factureData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des factures
      await fetchFactures();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la création de la facture');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une facture
  const updateFacture = async (id: number, factureData: FactureFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/api/factures/${id}`, factureData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des factures
      await fetchFactures();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la facture');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une facture
  const deleteFacture = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/api/factures/${id}`);
      
      if (response.error) {
        setError(response.error);
        return false;
      }
      
      // Mettre à jour la liste des factures
      await fetchFactures();
      
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression de la facture');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Marquer une facture comme payée
  const marquerCommePaye = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/api/factures/${id}/payer`, { statut: 'Payée' });
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des factures
      await fetchFactures();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors du marquage de la facture comme payée');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calculer les totaux d'une facture
  const calculerTotaux = (lignes: Omit<LigneFacture, 'id'>[]) => {
    let totalHT = 0;
    let totalTVA = 0;
    
    lignes.forEach(ligne => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneTVA = ligneHT * (ligne.tva / 100);
      
      totalHT += ligneHT;
      totalTVA += ligneTVA;
    });
    
    const totalTTC = totalHT + totalTVA;
    
    return { totalHT, totalTVA, totalTTC };
  };

  // Charger les factures au montage du composant
  useEffect(() => {
    fetchFactures();
  }, [fetchFactures]);

  return {
    factures,
    loading,
    error,
    fetchFactures,
    fetchFactureById,
    createFacture,
    updateFacture,
    deleteFacture,
    marquerCommePaye,
    calculerTotaux,
  };
} 