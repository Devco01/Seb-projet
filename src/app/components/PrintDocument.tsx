'use client';

import { useEffect, useState } from 'react';

export interface PrintDocumentProps {
  type: 'devis' | 'facture' | 'paiement';
  reference: string;
  date: string;
  echeance?: string;
  clientName: string;
  clientAddress?: string;
  clientZipCity?: string;
  clientEmail?: string;
  clientPhone?: string;
  lines: {
    description: string;
    quantite: number;
    unite?: string;
    prixUnitaire: number;
    total: number;
  }[];
  total: number;
  notes?: string;
  conditionsPaiement?: string;
}

interface ParametresEntreprise {
  companyName: string;
  address: string;
  zipCode: string;
  city: string;
  phone?: string;
  email: string;
  siret?: string;
  logoUrl?: string;
}

export default function PrintDocument({
  type,
  reference,
  date,
  echeance,
  clientName,
  clientAddress,
  clientZipCity,
  clientEmail,
  clientPhone,
  lines,
  total,
  notes,
  conditionsPaiement
}: PrintDocumentProps) {
  const [parametres, setParametres] = useState<ParametresEntreprise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParametres = async () => {
      try {
        const response = await fetch('/api/parametres');
        if (response.ok) {
          const data = await response.json();
          setParametres(data);
        } else {
          console.error('Erreur lors du chargement des paramètres');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParametres();
  }, []);

  const formatDateFr = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <div className="print:hidden">Chargement...</div>;
  }

  // Paramètres par défaut si rien n'est configuré
  const defaultParams: ParametresEntreprise = {
    companyName: 'Mon Entreprise',
    address: '123 Rue Example',
    zipCode: '75000',
    city: 'Paris',
    email: 'contact@exemple.fr',
    phone: '01 23 45 67 89',
    siret: '000 000 000 00000'
  };

  const entreprise = parametres || defaultParams;

  const documentType = type === 'devis' ? 'DEVIS' : type === 'facture' ? 'FACTURE' : 'REÇU DE PAIEMENT';
  const documentTitle = type === 'devis' ? 'DEVIS N°' : type === 'facture' ? 'FACTURE N°' : 'REÇU N°';

  return (
    <div className="hidden print:block print:p-8">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:block * {
            visibility: visible;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      <div className="mb-6 border-b-2 border-gray-300 pb-6">
        {/* En-tête avec logo et informations de l'entreprise */}
        <div className="flex justify-between items-start">
          <div className="w-1/3">
            {entreprise.logoUrl ? (
              <img
                src={entreprise.logoUrl}
                alt={`Logo ${entreprise.companyName}`}
                className="h-20 object-contain"
              />
            ) : (
              <h2 className="text-xl font-bold">{entreprise.companyName}</h2>
            )}
          </div>
          <div className="w-1/3 text-center">
            <h1 className="text-2xl font-bold text-gray-800">{documentType}</h1>
          </div>
          <div className="w-1/3 text-sm text-right">
            <p className="font-semibold">{entreprise.companyName}</p>
            <p>{entreprise.address}</p>
            <p>{entreprise.zipCode} {entreprise.city}</p>
            <p>Tél: {entreprise.phone}</p>
            <p>Email: {entreprise.email}</p>
            {entreprise.siret && <p>SIRET: {entreprise.siret}</p>}
            <p className="mt-1 font-medium">Auto-entrepreneur</p>
          </div>
        </div>
      </div>

      {/* Références du document */}
      <div className="flex justify-between mb-6">
        <div>
          <div className="border border-gray-300 inline-block px-2 py-1 mb-2 font-bold">{documentTitle} {reference}</div>
          <p><span className="font-semibold">Date:</span> {formatDateFr(date)}</p>
          {echeance && <p><span className="font-semibold">Échéance:</span> {formatDateFr(echeance)}</p>}
        </div>
        <div className="text-right">
          <p className="font-bold mb-1 border-b border-gray-400 inline-block pb-1">CLIENT</p>
          <p className="font-semibold">{clientName}</p>
          {clientAddress && <p>{clientAddress}</p>}
          {clientZipCity && <p>{clientZipCity}</p>}
          {clientEmail && <p>Email: {clientEmail}</p>}
          {clientPhone && <p>Tél: {clientPhone}</p>}
        </div>
      </div>

      {/* Tableau des lignes */}
      <div className="mb-6">
        {type === 'paiement' ? (
          <div className="mb-8 py-4 border-y-2 border-gray-300">
            <h2 className="text-xl font-bold mb-4 text-center">REÇU DE PAIEMENT</h2>
            <div className="text-center my-6">
              <p className="text-xl mb-2">
                Nous accusons réception de votre paiement d&apos;un montant de
              </p>
              <p className="text-2xl font-bold my-4">{total.toFixed(2)} €</p>
              <p className="text-lg">
                {lines[0]?.description}
              </p>
              <p className="text-lg">
                Méthode de paiement: {lines[0]?.unite || 'Non précisée'}
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-t-2 border-b-2 border-gray-400">
                <th className="py-2 text-left w-1/2 font-bold bg-gray-100">Description</th>
                <th className="py-2 text-center font-bold bg-gray-100">Quantité</th>
                <th className="py-2 text-center font-bold bg-gray-100">Unité</th>
                <th className="py-2 text-right font-bold bg-gray-100">Prix unitaire</th>
                <th className="py-2 text-right font-bold bg-gray-100">Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-1">{line.description}</td>
                  <td className="py-1 text-center">{line.quantite}</td>
                  <td className="py-1 text-center">{line.unite || '-'}</td>
                  <td className="py-1 text-right">{line.prixUnitaire.toFixed(2)} €</td>
                  <td className="py-1 text-right">{line.total.toFixed(2)} €</td>
                </tr>
              ))}
              {/* Assurer un minimum de lignes pour l'aspect visuel */}
              {lines.length < 10 && Array(10 - lines.length).fill(0).map((_, index) => (
                <tr key={`empty-${index}`} className="border-b border-gray-300">
                  <td className="py-1">&nbsp;</td>
                  <td className="py-1">&nbsp;</td>
                  <td className="py-1">&nbsp;</td>
                  <td className="py-1">&nbsp;</td>
                  <td className="py-1">&nbsp;</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-1"></td>
                <td className="py-1 text-right font-bold">TOTAL</td>
                <td className="py-1 text-right font-bold border-t-2 border-b-2 border-gray-800">{total.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Pied de page avec conditions et notes */}
      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
        <div>
          {conditionsPaiement && (
            <>
              <p className="font-bold mb-1 border-b border-gray-300 inline-block pb-1">
                {type === 'paiement' ? 'DÉTAILS DU PAIEMENT :' : 'CONDITIONS DE PAIEMENT :'}
              </p>
              <p>{conditionsPaiement}</p>
            </>
          )}
        </div>
        <div>
          {notes && (
            <>
              <p className="font-bold mb-1 border-b border-gray-300 inline-block pb-1">NOTES :</p>
              <p>{notes}</p>
            </>
          )}
        </div>
      </div>

      {/* Mentions légales en bas de page */}
      <div className="mt-10 text-xs text-gray-500 text-center">
        {type === 'devis' && (
          <p>Devis à retourner daté et signé avec la mention &quot;bon pour accord&quot;</p>
        )}
        {type === 'facture' && (
          <p>Merci pour votre confiance</p>
        )}
        {type === 'paiement' && (
          <p>Ce document confirme la réception du paiement et sert de reçu</p>
        )}
      </div>
    </div>
  );
} 