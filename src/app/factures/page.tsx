"use client";

import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFileDownload, FaEnvelope, FaCheck, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

// Données fictives pour les factures
const facturesData = [
  { 
    id: 1, 
    numero: 'F-2023-042', 
    client: 'Dupont SAS', 
    date: '15/06/2023', 
    echeance: '15/07/2023',
    montant: '2 500 €',
    statut: 'Payée',
    statutColor: 'bg-green-100 text-green-800'
  },
  { 
    id: 2, 
    numero: 'F-2023-041', 
    client: 'Martin Construction', 
    date: '10/06/2023', 
    echeance: '10/07/2023',
    montant: '1 800 €',
    statut: 'En attente',
    statutColor: 'bg-yellow-100 text-yellow-800'
  },
  { 
    id: 3, 
    numero: 'F-2023-040', 
    client: 'Dubois SARL', 
    date: '05/06/2023', 
    echeance: '05/07/2023',
    montant: '3 200 €',
    statut: 'Impayée',
    statutColor: 'bg-red-100 text-red-800'
  },
  { 
    id: 4, 
    numero: 'F-2023-039', 
    client: 'Résidences du Parc', 
    date: '01/06/2023', 
    echeance: '01/07/2023',
    montant: '1 950 €',
    statut: 'Payée',
    statutColor: 'bg-green-100 text-green-800'
  },
];

export default function FacturesPage() {
  // Données statiques pour la démonstration
  const factures = [
    { id: 1, numero: 'FAC-2025-001', client: 'Dupont SAS', date: '20/01/2025', montantTTC: 2450.50, statut: 'Payée' },
    { id: 2, numero: 'FAC-2025-002', client: 'Martin Construction', date: '28/01/2025', montantTTC: 3780.00, statut: 'En attente' },
    { id: 3, numero: 'FAC-2025-003', client: 'Dubois SARL', date: '10/02/2025', montantTTC: 1250.75, statut: 'En retard' },
    { id: 4, numero: 'FAC-2025-004', client: 'Petit Immobilier', date: '22/02/2025', montantTTC: 5620.30, statut: 'Payée' },
    { id: 5, numero: 'FAC-2025-005', client: 'Leroy Bâtiment', date: '08/03/2025', montantTTC: 4150.00, statut: 'En attente' },
  ];

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Payée': return '#22c55e'; // vert
      case 'En retard': return '#ef4444'; // rouge
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
        }}>Gestion des factures</h1>
        
        <a href="/factures/nouveau" style={{
          padding: '8px 16px',
          backgroundColor: '#22c55e',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none'
        }}>
          Nouvelle facture
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
            {factures.map((facture) => (
              <tr key={facture.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{facture.numero}</td>
                <td style={{ padding: '12px 16px' }}>{facture.client}</td>
                <td style={{ padding: '12px 16px' }}>{facture.date}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>{facture.montantTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: getStatusColor(facture.statut),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {facture.statut}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a href={`/factures/${facture.id}`} style={{
                      padding: '4px 8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}>
                      Voir
                    </a>
                    <a href={`/factures/${facture.id}/modifier`} style={{
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