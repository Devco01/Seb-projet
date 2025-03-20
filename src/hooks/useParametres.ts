import { useState, useEffect } from 'react';

// Type pour les paramètres de l'entreprise
export interface Parametres {
  id: string;
  companyName: string;
  address: string;
  zipCode: string;
  city: string;
  phone: string;
  email: string;
  siret: string;
  paymentDelay: number;
  logoUrl: string | null;
  tvaPercent: number;
  prefixeDevis: string;
  prefixeFacture: string;
  mentionsLegalesDevis: string | null;
  mentionsLegalesFacture: string | null;
  conditionsPaiement: string | null;
}

export default function useParametres() {
  const [parametres, setParametres] = useState<Parametres | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchParametres = async () => {
      try {
        console.log("[useParametres] Début du chargement des paramètres");
        setLoading(true);
        setError(null);

        const response = await fetch('/api/parametres');
        console.log("[useParametres] Réponse API reçue:", response.status);
        
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement des paramètres: ${response.status}`);
        }

        const data = await response.json();
        console.log("[useParametres] Données reçues:", data);
        
        setParametres(data);
        setLoading(false);
      } catch (err) {
        console.error("[useParametres] Erreur:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        setLoading(false);
      }
    };

    fetchParametres();
  }, []);

  return { parametres, loading, error };
} 