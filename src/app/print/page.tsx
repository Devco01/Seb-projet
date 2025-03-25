'use client';

import { useEffect, useState, Suspense } from 'react';
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

// Composant de chargement pour le Suspense
function PrintLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full mb-4"></div>
        <p className="text-gray-600">Préparation du document pour impression...</p>
      </div>
    </div>
  );
}

// Composant qui utilise useSearchParams
function PrintContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) {
      setError('Type ou ID manquant dans l\'URL');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Tentative de récupération des données: type=${type}, id=${id}`);
        
        const response = await fetch(`/api/print?type=${type}&id=${id}`);
        const responseText = await response.text();
        
        try {
          // Tenter de parser la réponse JSON
          const data = JSON.parse(responseText);
          
          if (!response.ok) {
            setDebugInfo(`Erreur API: ${JSON.stringify(data)}`);
            throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
          }
          
          console.log('Données reçues:', data);
          
          // Vérifier si les données ont le format attendu
          if (!data || typeof data !== 'object') {
            setDebugInfo(`Format de données incorrect: ${responseText}`);
            throw new Error('Format de données incorrect');
          }
          
          // Vérifier que le type reçu est valide
          if (!data.type || !['devis', 'facture', 'paiement'].includes(data.type)) {
            setDebugInfo(`Type invalide: ${data.type}, données: ${JSON.stringify(data)}`);
            throw new Error(`Type de document invalide: ${data.type || 'non défini'}`);
          }
          
          setDocumentData(data as DocumentData);
          
          // Démarrer l'impression automatiquement après le chargement
          setTimeout(() => {
            console.log('Lancement de l\'impression');
            window.print();
          }, 1000);
        } catch (parseError) {
          console.error('Erreur de parsing JSON:', parseError);
          setDebugInfo(`Erreur de parsing JSON: ${responseText}`);
          throw new Error(`Erreur de format de données: ${parseError instanceof Error ? parseError.message : 'Erreur inconnue'}`);
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Chargement du document pour impression...</p>
          <p className="text-gray-400 text-sm">{type} #{id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center max-w-lg p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-bold mb-2">Erreur lors du chargement du document</p>
          <p className="text-red-500 mb-4">{error}</p>
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg overflow-auto max-h-60 text-xs text-left">
              <p className="font-bold mb-1">Informations de débogage:</p>
              <pre>{debugInfo}</pre>
            </div>
          )}
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center max-w-lg p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-600 font-bold">Aucune donnée disponible pour l&apos;impression</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Assurons-nous que les données sont correctement formatées avant de les passer au composant PrintDocument
  if (documentData) {
    // Vérifier que les lignes sont au format attendu
    if (!Array.isArray(documentData.lines) || documentData.lines.length === 0) {
      documentData.lines = [{
        description: 'Document sans détails',
        quantite: 1,
        unite: 'unité',
        prixUnitaire: documentData.total || 0,
        total: documentData.total || 0
      }];
    }

    // Formater les lignes pour s'assurer qu'elles ont toutes les propriétés requises
    documentData.lines = documentData.lines.map(line => ({
      description: line.description || 'Article',
      quantite: Number(line.quantite) || 1,
      unite: line.unite || 'unité',
      prixUnitaire: Number(line.prixUnitaire) || 0,
      total: Number(line.total) || 0
    }));
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

// Composant principal qui enveloppe le contenu dans un Suspense
export default function PrintPage() {
  return (
    <Suspense fallback={<PrintLoading />}>
      <PrintContent />
    </Suspense>
  );
} 