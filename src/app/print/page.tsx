'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PrintDocument from '@/app/components/PrintDocument';

// Type pour les données du document
interface DocumentData {
  type: 'devis' | 'facture' | 'paiement';
  reference: string;
  date: string;
  echeance?: string;
  clientName: string;
  clientAddress?: string;
  clientZipCity?: string;
  clientEmail?: string;
  clientPhone?: string;
  lines: Array<{
    description: string;
    quantite: number;
    unite: string;
    prixUnitaire: number;
    total: number;
  }>;
  total: number;
  notes?: string;
  conditionsPaiement?: string;
}

export default function PrintPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (!type || !id) {
      setError('Type ou ID manquant dans l\'URL');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/print?type=${type}&id=${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des données');
        }
        
        const data = await response.json();
        // Vérifier que le type reçu est valide
        if (data.type && ['devis', 'facture', 'paiement'].includes(data.type)) {
          setDocumentData(data as DocumentData);
        } else {
          throw new Error('Type de document invalide');
        }
        
        // Démarrer l'impression automatiquement après le chargement
        setTimeout(() => {
          window.print();
        }, 500);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement du document pour impression...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!documentData) {
    return <div className="flex justify-center items-center min-h-screen">Aucune donnée disponible pour l&apos;impression</div>;
  }

  return (
    <div className="print-container w-full">
      <PrintDocument 
        type={documentData.type}
        reference={documentData.reference}
        date={documentData.date}
        echeance={documentData.echeance}
        clientName={documentData.clientName}
        clientAddress={documentData.clientAddress}
        clientZipCity={documentData.clientZipCity}
        clientEmail={documentData.clientEmail}
        clientPhone={documentData.clientPhone}
        lines={documentData.lines}
        total={documentData.total}
        notes={documentData.notes}
        conditionsPaiement={documentData.conditionsPaiement}
      />
    </div>
  );
} 