import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { Client } from './useClients';

export interface LigneDevis {
  id?: number;
  description: string;
  quantite: number;
  prixUnitaire: number;
  tva: number;
  totalHT: number;
}

export interface Devis {
  id: number;
  numero: string;
  clientId: number;
  client?: Client;
  date: string;
  validite: string;
  statut: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé' | 'Expiré';
  lignes: LigneDevis[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  conditions?: string;
  notes?: string;
  factureId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DevisFormData {
  clientId: number;
  date: string;
  validite: string;
  statut: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé' | 'Expiré';
  lignes: Omit<LigneDevis, 'id'>[];
  conditions?: string;
  notes?: string;
}

export function useDevis() {
  const api = useApi<any>();
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer tous les devis
  const fetchDevis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/devis');
      
      if (response.error) {
        setError(response.error);
      } else {
        setDevis(response.data);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des devis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer un devis par son ID
  const fetchDevisById = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/devis/${id}`);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la récupération du devis');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau devis
  const createDevis = async (devisData: DevisFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/devis', devisData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des devis
      await fetchDevis();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la création du devis');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un devis
  const updateDevis = async (id: number, devisData: DevisFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/api/devis/${id}`, devisData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des devis
      await fetchDevis();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la mise à jour du devis');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un devis
  const deleteDevis = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/api/devis/${id}`);
      
      if (response.error) {
        setError(response.error);
        return false;
      }
      
      // Mettre à jour la liste des devis
      await fetchDevis();
      
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression du devis');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Convertir un devis en facture
  const convertirEnFacture = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/api/devis/${id}/convertir`, {});
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      // Mettre à jour la liste des devis
      await fetchDevis();
      
      return response.data;
    } catch (err) {
      setError('Erreur lors de la conversion du devis en facture');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calculer les totaux d'un devis
  const calculerTotaux = (lignes: Omit<LigneDevis, 'id'>[]) => {
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

  // Charger les devis au montage du composant
  useEffect(() => {
    fetchDevis();
  }, []);

  return {
    devis,
    loading,
    error,
    fetchDevis,
    fetchDevisById,
    createDevis,
    updateDevis,
    deleteDevis,
    convertirEnFacture,
    calculerTotaux,
  };
} 