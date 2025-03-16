"use client";

import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFileDownload, FaEnvelope, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

// Données fictives pour les devis
const devisData = [
  { 
    id: 1, 
    numero: 'D-2023-056', 
    client: 'Dupont SAS', 
    date: '20/06/2023', 
    validite: '20/07/2023',
    montant: '3 200 €',
    statut: 'En attente',
    statutColor: 'bg-yellow-100 text-yellow-800'
  },
  { 
    id: 2, 
    numero: 'D-2023-055', 
    client: 'Martin Construction', 
    date: '15/06/2023', 
    validite: '15/07/2023',
    montant: '2 450 €',
    statut: 'Accepté',
    statutColor: 'bg-green-100 text-green-800'
  },
  { 
    id: 3, 
    numero: 'D-2023-054', 
    client: 'Dubois SARL', 
    date: '10/06/2023', 
    validite: '10/07/2023',
    montant: '1 800 €',
    statut: 'Refusé',
    statutColor: 'bg-red-100 text-red-800'
  },
  { 
    id: 4, 
    numero: 'D-2023-053', 
    client: 'Résidences du Parc', 
    date: '05/06/2023', 
    validite: '05/07/2023',
    montant: '4 100 €',
    statut: 'Converti en facture',
    statutColor: 'bg-blue-100 text-blue-800'
  },
];

export default function DevisPage() {
  // Données statiques pour la démonstration
  const devis = [
    { id: 1, numero: 'DEV-2025-001', client: 'Dupont SAS', date: '15/01/2025', montantTTC: 2450.50, statut: 'En attente' },
    { id: 2, numero: 'DEV-2025-002', client: 'Martin Construction', date: '22/01/2025', montantTTC: 3780.00, statut: 'Accepté' },
    { id: 3, numero: 'DEV-2025-003', client: 'Dubois SARL', date: '05/02/2025', montantTTC: 1250.75, statut: 'Refusé' },
    { id: 4, numero: 'DEV-2025-004', client: 'Petit Immobilier', date: '18/02/2025', montantTTC: 5620.30, statut: 'En attente' },
    { id: 5, numero: 'DEV-2025-005', client: 'Leroy Bâtiment', date: '03/03/2025', montantTTC: 4150.00, statut: 'Accepté' },
  ];

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Accepté': return '#22c55e'; // vert
      case 'Refusé': return '#ef4444'; // rouge
      case 'En attente': return '#f59e0b'; // orange
      default: return '#6b7280'; // gris
    }
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#333'
        }}>Gestion des devis</h1>
        
        <a href="/devis/nouveau" style={{
          padding: '8px 16px',
          backgroundColor: '#22c55e',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none'
        }}>
          Nouveau devis
        </a>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Numéro</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Client</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Montant TTC</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Statut</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devis.map((devis) => (
              <tr key={devis.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{devis.numero}</td>
                <td style={{ padding: '12px 16px' }}>{devis.client}</td>
                <td style={{ padding: '12px 16px' }}>{devis.date}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>{devis.montantTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: getStatusColor(devis.statut),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {devis.statut}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a href={`/devis/${devis.id}`} style={{
                      padding: '4px 8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}>
                      Voir
                    </a>
                    <a href={`/devis/${devis.id}/modifier`} style={{
                      padding: '4px 8px',
                      backgroundColor: '#eab308',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}>
                      Modifier
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <a href="/" style={{
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none'
        }}>
          Retour à l'accueil
        </a>
      </div>
      
      <footer style={{ 
        marginTop: '32px', 
        paddingTop: '16px', 
        borderTop: '1px solid #ddd', 
        textAlign: 'center',
        color: '#777'
      }}>
        <p>© 2025 FacturePro - Peinture en bâtiment</p>
      </footer>
    </div>
  );
} 