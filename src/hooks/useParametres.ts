import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export interface Parametres {
  id: number;
  nomEntreprise: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  telephone?: string;
  email: string;
  siteWeb?: string;
  siret: string;
  tvaIntracommunautaire?: string;
  rcs?: string;
  capital?: string;
  logo?: string;
  conditionsPaiement?: string;
  piedPage?: string;
  couleurPrincipale?: string;
  couleurSecondaire?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParametresFormData {
  nomEntreprise: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  telephone?: string;
  email: string;
  siteWeb?: string;
  siret: string;
  tvaIntracommunautaire?: string;
  rcs?: string;
  capital?: string;
  logo?: string;
  conditionsPaiement?: string;
  piedPage?: string;
  couleurPrincipale?: string;
  couleurSecondaire?: string;
}

export function useParametres() {
  const api = useApi<any>();
  const [parametres, setParametres] = useState<Parametres | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les paramètres
  const fetchParametres = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/parametres');
      
      if (response.error) {
        setError(response.error);
      } else {
        setParametres(response.data);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des paramètres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les paramètres
  const updateParametres = async (parametresData: ParametresFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/api/parametres', parametresData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      setParametres(response.data);
      return response.data;
    } catch (err) {
      setError('Erreur lors de la mise à jour des paramètres');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Télécharger un logo
  const uploadLogo = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await fetch('/api/parametres/logo', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Erreur lors du téléchargement du logo');
        return null;
      }
      
      // Mettre à jour les paramètres avec le nouveau logo
      await fetchParametres();
      
      return data;
    } catch (err) {
      setError('Erreur lors du téléchargement du logo');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Charger les paramètres au montage du composant
  useEffect(() => {
    fetchParametres();
  }, []);

  return {
    parametres,
    loading,
    error,
    fetchParametres,
    updateParametres,
    uploadLogo,
  };
} 