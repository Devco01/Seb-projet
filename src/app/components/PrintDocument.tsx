'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
  total
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

  const formatDateFr = (dateStr?: string) => {
    if (!dateStr) return 'Non spécifiée';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return 'Format de date incorrect';
    }
  };

  const formatMontant = (montant?: number) => {
    const valeur = Number(montant);
    return isNaN(valeur) ? '0.00' : valeur.toFixed(2);
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

  const printStyles = `
    @page {
      size: A4;
      margin: 0mm;
    }
    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      * {
        box-sizing: border-box;
      }
    }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #000;
      background: #fff;
    }
    .printOnly {
      display: block !important;
      width: 100%;
      background-color: white;
      padding: 10mm;
    }
    .container {
      max-width: 100%;
      overflow: visible !important;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      border-bottom: 2px solid #ddd;
      padding-bottom: 15px;
    }
    .company-logo {
      flex: 1;
    }
    .document-title {
      flex: 1;
      text-align: center;
      font-size: 22px;
      font-weight: bold;
    }
    .company-info {
      flex: 1;
      text-align: right;
      font-size: 11px;
    }
    .document-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .document-ref {
      border: 1px solid #ddd;
      display: inline-block;
      padding: 5px 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .client-info {
      text-align: right;
    }
    .client-title {
      font-weight: bold;
      margin-bottom: 5px;
      border-bottom: 1px solid #444;
      display: inline-block;
      padding-bottom: 2px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    .table th {
      background-color: #f5f5f5;
      border-top: 2px solid #444;
      border-bottom: 2px solid #444;
      padding: 6px;
      text-align: left;
      font-size: 12px;
    }
    .table th.text-right {
      text-align: right;
    }
    .table th.text-center {
      text-align: center;
    }
    .table td {
      padding: 6px;
      border-bottom: 1px solid #ddd;
      font-size: 12px;
    }
    .table td.text-right {
      text-align: right;
    }
    .table td.text-center {
      text-align: center;
    }
    .table tfoot td {
      padding: 8px;
    }
    .table tfoot .total-row {
      text-align: right;
      font-weight: bold;
    }
    .table tfoot .total-value {
      text-align: right;
      font-weight: bold;
      border-top: 2px solid #444;
      border-bottom: 2px solid #444;
    }
    .payment-receipt {
      text-align: center;
      border-top: 2px solid #ddd;
      border-bottom: 2px solid #ddd;
      padding: 15px 0;
      margin-bottom: 15px;
    }
    .payment-amount {
      font-size: 20px;
      font-weight: bold;
      margin: 10px 0;
    }

    
    .legal-notice {
      margin-top: 20px;
      text-align: center;
      font-size: 9px;
      color: #777;
    }
  `;

  return (
    <div id="printable-document" className="hidden print:block">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      
      <div className="printOnly container">
        <div className="header">
          <div className="company-logo">
            {entreprise.logoUrl ? (
              <Image
                src={entreprise.logoUrl}
                alt={`Logo ${entreprise.companyName}`}
                width={200}
                height={80}
                style={{ maxHeight: '80px', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{entreprise.companyName}</div>
            )}
          </div>
          
          <div className="document-title">
            {documentType}
          </div>
          
          <div className="company-info">
            <div style={{ fontWeight: 'semibold' }}>{entreprise.companyName}</div>
            <div>{entreprise.address}</div>
            <div>{entreprise.zipCode} {entreprise.city}</div>
            <div>Tél: {entreprise.phone}</div>
            <div>Email: {entreprise.email}</div>
            {entreprise.siret && <div>SIRET: {entreprise.siret}</div>}
            <div style={{ marginTop: '5px', fontWeight: 'medium' }}>Auto-entrepreneur</div>
          </div>
        </div>

        <div className="document-info">
          <div>
            <div className="document-ref">{documentTitle} {reference}</div>
            <div><span style={{ fontWeight: 'semibold' }}>Date:</span> {formatDateFr(date)}</div>
            {echeance && <div><span style={{ fontWeight: 'semibold' }}>Échéance:</span> {formatDateFr(echeance)}</div>}
          </div>
          
          <div className="client-info">
            <div className="client-title">CLIENT</div>
            <div style={{ fontWeight: 'semibold' }}>{clientName}</div>
            {clientAddress && <div>{clientAddress}</div>}
            {clientZipCity && <div>{clientZipCity}</div>}
            {clientEmail && <div>Email: {clientEmail}</div>}
            {clientPhone && <div>Tél: {clientPhone}</div>}
          </div>
        </div>

        

        {type === 'paiement' ? (
          <div className="payment-receipt">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>REÇU DE PAIEMENT</h2>
            <div>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                Nous accusons réception de votre paiement d&apos;un montant de
              </p>
              <p className="payment-amount">{formatMontant(total)} €</p>
              <p style={{ fontSize: '16px' }}>
                {lines[0]?.description}
              </p>
              <p style={{ fontSize: '16px' }}>
                Méthode de paiement: {lines[0]?.unite || 'Non précisée'}
              </p>
            </div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Description</th>
                <th className="text-center">Quantité</th>
                <th className="text-center">Unité</th>
                <th className="text-right">Prix unitaire</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr key={index}>
                  <td>{line.description}</td>
                  <td className="text-center">{line.quantite}</td>
                  <td className="text-center">{line.unite || '-'}</td>
                  <td className="text-right">{formatMontant(line.prixUnitaire)} €</td>
                  <td className="text-right">{formatMontant(line.total)} €</td>
                </tr>
              ))}
              {/* Lignes vides pour l'aspect visuel */}
              {lines.length < 5 && Array(5 - lines.length).fill(0).map((_, index) => (
                <tr key={`empty-${index}`}>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}></td>
                <td className="total-row">TOTAL</td>
                <td className="total-value">{formatMontant(total)} €</td>
              </tr>
            </tfoot>
          </table>
        )}





        <div className="legal-notice">
          {type === 'devis' && (
            <div>Devis à retourner daté et signé avec la mention &quot;bon pour accord&quot;</div>
          )}
          {type === 'facture' && (
            <div>Merci pour votre confiance</div>
          )}
          {type === 'paiement' && (
            <div>Ce document confirme la réception du paiement et sert de reçu</div>
          )}
        </div>
      </div>
    </div>
  );
} 