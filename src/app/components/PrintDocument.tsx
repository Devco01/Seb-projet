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
  
  // Format uniforme pour tous les documents : "Type N° Référence"
  const getDocumentTitle = () => {
    if (type === 'devis') {
      return `Devis N° ${reference}`;
    } else if (type === 'facture') {
      // Détecter si c'est une facture d'acompte
      if (reference && reference.startsWith('A')) {
        return `Facture d'acompte N° ${reference}`;
      }
      return `Facture N° ${reference}`;
    } else {
      // Pour les reçus de paiement
      return `Reçu de paiement N° ${reference}`;
    }
  };
  
  const documentTitle = getDocumentTitle();

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
      vertical-align: top;
      line-height: 1.4;
    }
    .table td.description {
      white-space: normal;
      word-break: break-word;
      max-width: 0;
      min-width: 200px;
    }
    .table td.text-right {
      text-align: right;
    }
    .table td.text-center {
      text-align: center;
    }
    .table tfoot td {
      padding: 8px 6px;
      font-size: 12px;
      vertical-align: middle;
    }
    .table tfoot .total-row {
      text-align: right;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .table tfoot .total-value {
      text-align: right;
      font-weight: bold;
      border-top: 2px solid #444;
      border-bottom: 2px solid #444;
      white-space: nowrap;
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
    .page-break {
      page-break-before: always;
      margin-top: 0;
    }
    .page-content {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
    }
    .table-section {
      flex: 1;
    }
    .page-number {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 9px;
      color: #666;
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
            {documentTitle}
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
            <div className="document-ref">{documentTitle}</div>
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
          (() => {
            // Configuration de pagination : max 12 lignes par page
            const LINES_PER_PAGE = 12;
            const chunks = [];
            
            // Diviser les lignes en chunks
            for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
              chunks.push(lines.slice(i, i + LINES_PER_PAGE));
            }
            
            // Si aucune ligne, créer au moins un chunk vide
            if (chunks.length === 0) {
              chunks.push([]);
            }

            return chunks.map((chunk, pageIndex) => (
              <div key={pageIndex} className={pageIndex === 0 ? "page-content" : "page-break page-content"}>
                {/* En-tête répété sur chaque page (sauf la première où il est déjà affiché) */}
                {pageIndex > 0 && (
                  <div className="header" style={{ marginBottom: '20px' }}>
                    <div className="company-logo">
                      {logoPath ? (
                        <img
                          src={logoPath}
                          alt={`Logo ${nomEntreprise}`}
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '80px', 
                            objectFit: 'contain',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          color: '#1e40af',
                          padding: '8px 0'
                        }}>
                          {nomEntreprise}
                        </div>
                      )}
                    </div>
                    
                    <div className="document-title">
                      {documentTitle} (suite)
                    </div>
                    
                    <div className="company-info">
                      <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '11px' }}>
                        {nomEntreprise}
                      </div>
                      <div style={{ marginBottom: '1px', fontSize: '10px' }}>{adresse}</div>
                      <div style={{ marginBottom: '6px', fontSize: '10px' }}>{codePostal} {ville}</div>
                      <div style={{ marginBottom: '1px', fontSize: '10px' }}>Email: {entreprise.email}</div>
                      {entreprise.siret && <div style={{ fontSize: '9px' }}>SIRET: {entreprise.siret}</div>}
                    </div>
                  </div>
                )}

                <div className="table-section">
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ width: '50%' }}>Description</th>
                        <th className="text-center" style={{ width: '15%' }}>Qté</th>
                        <th className="text-right" style={{ width: '17%' }}>Prix unit.</th>
                        <th className="text-right" style={{ width: '18%' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chunk.map((line, index) => (
                        <tr key={pageIndex * LINES_PER_PAGE + index}>
                          <td className="description">{line.description}</td>
                          <td className="text-center">{line.quantite}</td>
                          <td className="text-right">{formatMontant(line.prixUnitaire)} €</td>
                          <td className="text-right">{formatMontant(line.total)} €</td>
                        </tr>
                      ))}
                      
                      {/* Lignes vides pour l'aspect visuel seulement sur la première page si pas assez de lignes */}
                      {pageIndex === 0 && chunk.length < 5 && Array(5 - chunk.length).fill(0).map((_, index) => (
                        <tr key={`empty-${index}`}>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                        </tr>
                      ))}
                    </tbody>
                    
                    {/* Total seulement sur la dernière page */}
                    {pageIndex === chunks.length - 1 && (
                      <tfoot>
                        <tr>
                          <td colSpan={2} style={{ borderTop: '1px solid #ddd' }}></td>
                          <td className="total-row" style={{ 
                            textAlign: 'right',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            padding: '8px 6px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {notes && notes.includes('FACTURE D\'ACOMPTE') ? 'MONTANT ACOMPTE' : 'TOTAL'}
                          </td>
                          <td className="total-value" style={{
                            textAlign: 'right',
                            fontWeight: 'bold',
                            borderTop: '2px solid #444',
                            borderBottom: '2px solid #444',
                            fontSize: '12px',
                            padding: '8px 6px'
                          }}>{formatMontant(total)} €</td>
                        </tr>
                        {/* Afficher le reste à payer pour les factures d'acompte */}
                        {notes && notes.includes('FACTURE D\'ACOMPTE') && notes.includes('- Montant restant à payer:') && (
                          (() => {
                            const montantRestantMatch = notes.match(/- Montant restant à payer: ([\d,]+\.?\d*) €/);
                            const montantRestant = montantRestantMatch ? parseFloat(montantRestantMatch[1].replace(',', '')) : null;
                            
                            return montantRestant ? (
                              <tr>
                                <td colSpan={2}></td>
                                <td style={{ 
                                  fontWeight: 'bold', 
                                  backgroundColor: '#3b82f6',
                                  color: '#ffffff',
                                  fontSize: '12px',
                                  padding: '8px 6px',
                                  textAlign: 'right',
                                  whiteSpace: 'nowrap'
                                }}>
                                  RESTE À PAYER
                                </td>
                                <td style={{ 
                                  fontWeight: 'bold',
                                  backgroundColor: '#3b82f6',
                                  color: '#ffffff',
                                  fontSize: '12px',
                                  padding: '8px 6px',
                                  textAlign: 'right'
                                }}>
                                  {formatMontant(montantRestant)} €
                                </td>
                              </tr>
                            ) : null;
                          })()
                        )}
                      </tfoot>
                    )}
                  </table>
                </div>
                
                {/* Legal notice sur la dernière page */}
                {pageIndex === chunks.length - 1 && (
                  <div className="legal-notice">
                    {type === 'devis' && (
                      <div>Devis à retourner daté et signé avec la mention &quot;bon pour accord&quot;</div>
                    )}
                    {type === 'facture' && (
                      <div>Merci pour votre confiance</div>
                    )}
                  </div>
                )}
                
                {/* Numéro de page */}
                {chunks.length > 1 && (
                  <div className="page-number">
                    Page {pageIndex + 1} / {chunks.length}
                  </div>
                )}
              </div>
            ));
          })()
        )}





        {/* Legal notice intégré dans la pagination pour les documents avec tableaux */}
        {type === 'paiement' && (
          <div className="legal-notice">
            <div>Ce document confirme la réception du paiement et sert de reçu</div>
          </div>
        )}
      </div>
    </div>
  );
} 