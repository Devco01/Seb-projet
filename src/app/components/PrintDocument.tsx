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
  notes?: string;
}

interface ParametresEntreprise {
  nomEntreprise?: string;
  companyName?: string;
  adresse?: string;
  address?: string;
  codePostal?: string;
  zipCode?: string;
  ville?: string;
  city?: string;
  telephone?: string;
  phone?: string;
  email: string;
  siret?: string;
  logo?: string;
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
  notes
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
    nomEntreprise: 'Mon Entreprise',
    companyName: 'Mon Entreprise',
    adresse: '123 Rue Example',
    address: '123 Rue Example',
    codePostal: '75000',
    zipCode: '75000',
    ville: 'Paris',
    city: 'Paris',
    email: 'contact@exemple.fr',
    telephone: '01 23 45 67 89',
    phone: '01 23 45 67 89',
    siret: '000 000 000 00000'
  };

  const entreprise = parametres || defaultParams;
  
  // Normaliser les champs pour compatibilité
  const nomEntreprise = entreprise.nomEntreprise || entreprise.companyName || defaultParams.companyName;
  const adresse = entreprise.adresse || entreprise.address || defaultParams.address;
  const codePostal = entreprise.codePostal || entreprise.zipCode || defaultParams.zipCode;
  const ville = entreprise.ville || entreprise.city || defaultParams.city;
  const telephone = entreprise.telephone || entreprise.phone || defaultParams.phone;
  const logoPath = entreprise.logo || entreprise.logoUrl;

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
      padding: 15mm;
      box-sizing: border-box;
    }
    .container {
      max-width: 100%;
      overflow: visible !important;
      word-wrap: break-word;
      hyphens: auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      border-bottom: 2px solid #ddd;
      padding-bottom: 15px;
      min-height: 100px;
    }
    .company-logo {
      flex: 1;
      max-width: 200px;
    }
    .company-logo img {
      max-width: 100%;
      max-height: 100px;
      object-fit: contain;
    }
    .document-title {
      flex: 1;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .company-info {
      flex: 1;
      text-align: right;
      font-size: 11px;
      line-height: 1.4;
      max-width: 200px;
    }
    .document-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 25px;
      gap: 20px;
    }
    .document-left {
      flex: 1;
      max-width: 300px;
    }
    .document-ref {
      border: 2px solid #1e40af;
      background-color: #f8fafc;
      display: inline-block;
      padding: 8px 15px;
      margin-bottom: 15px;
      font-weight: bold;
      font-size: 14px;
      border-radius: 4px;
    }
    .client-info {
      flex: 1;
      text-align: right;
      max-width: 300px;
    }
    .client-title {
      font-weight: bold;
      margin-bottom: 8px;
      border-bottom: 2px solid #1e40af;
      display: inline-block;
      padding-bottom: 4px;
      font-size: 12px;
      color: #1e40af;
    }
    .client-details {
      background-color: #f8fafc;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      line-height: 1.5;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      table-layout: fixed;
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
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
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
            {logoPath ? (
              <img
                src={logoPath}
                alt={`Logo ${nomEntreprise}`}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100px', 
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            ) : (
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#1e40af',
                padding: '10px 0'
              }}>
                {nomEntreprise}
              </div>
            )}
          </div>
          
          <div className="document-title">
            {documentType}
          </div>
          
          <div className="company-info">
            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>
              {nomEntreprise}
            </div>
            <div style={{ marginBottom: '2px' }}>{adresse}</div>
            <div style={{ marginBottom: '8px' }}>{codePostal} {ville}</div>
            {telephone && <div style={{ marginBottom: '2px' }}>Tél: {telephone}</div>}
            <div style={{ marginBottom: '2px' }}>Email: {entreprise.email}</div>
            {entreprise.siret && <div style={{ marginBottom: '8px' }}>SIRET: {entreprise.siret}</div>}
            <div style={{ 
              marginTop: '8px', 
              fontWeight: 'bold',
              fontSize: '10px',
              color: '#666',
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              display: 'inline-block'
            }}>
              Auto-entrepreneur
            </div>
          </div>
        </div>

        <div className="document-info">
          <div className="document-left">
            <div className="document-ref">{documentTitle} {reference}</div>
            <div style={{ 
              fontSize: '12px', 
              marginBottom: '8px',
              lineHeight: '1.5'
            }}>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Date :</span> {formatDateFr(date)}
              </div>
              {echeance && (
                <div>
                  <span style={{ fontWeight: 'bold' }}>
                    {type === 'devis' ? 'Validité :' : 'Échéance :'}
                  </span> {formatDateFr(echeance)}
                </div>
              )}
            </div>
          </div>
          
          <div className="client-info">
            <div className="client-title">CLIENT</div>
            <div className="client-details">
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '13px', 
                marginBottom: '6px',
                color: '#1e40af'
              }}>
                {clientName}
              </div>
              {clientAddress && (
                <div style={{ marginBottom: '3px', fontSize: '11px' }}>
                  {clientAddress}
                </div>
              )}
              {clientZipCity && (
                <div style={{ marginBottom: '6px', fontSize: '11px' }}>
                  {clientZipCity}
                </div>
              )}
              {clientEmail && (
                <div style={{ marginBottom: '3px', fontSize: '11px' }}>
                  Email: {clientEmail}
                </div>
              )}
              {clientPhone && (
                <div style={{ fontSize: '11px' }}>
                  Tél: {clientPhone}
                </div>
              )}
            </div>
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
                <td className="total-row">{notes && notes.includes('FACTURE D\'ACOMPTE') ? 'MONTANT DE CET ACOMPTE' : 'TOTAL'}</td>
                <td className="total-value">{formatMontant(total)} €</td>
              </tr>
              {/* Afficher le reste à payer pour les factures d'acompte */}
              {notes && notes.includes('FACTURE D\'ACOMPTE') && notes.includes('- Montant restant à payer:') && (
                (() => {
                  const montantRestantMatch = notes.match(/- Montant restant à payer: ([\d,]+\.?\d*) €/);
                  const montantRestant = montantRestantMatch ? parseFloat(montantRestantMatch[1].replace(',', '')) : null;
                  
                  return montantRestant ? (
                    <tr style={{ backgroundColor: '#dbeafe' }}>
                      <td colSpan={3}></td>
                      <td style={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        fontSize: '16px',
                        padding: '10px'
                      }}>
                        RESTE À PAYER
                      </td>
                      <td style={{ 
                        fontWeight: 'bold',
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        fontSize: '16px',
                        padding: '10px',
                        textAlign: 'right'
                      }}>
                        {formatMontant(montantRestant)} €
                      </td>
                    </tr>
                  ) : null;
                })()
              )}
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