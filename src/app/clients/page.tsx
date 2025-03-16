"use client";

import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaInfoCircle, FaFileInvoiceDollar, FaFileContract, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useClients } from '@/hooks/useClients';
import { useRouter } from 'next/navigation';

export default function ClientsPage() {
  // Données statiques pour la démonstration
  const clients = [
    { id: 1, nom: 'Dupont SAS', email: 'contact@dupont-sas.fr', telephone: '01 23 45 67 89', ville: 'Paris' },
    { id: 2, nom: 'Martin Construction', email: 'info@martin-construction.fr', telephone: '01 98 76 54 32', ville: 'Lyon' },
    { id: 3, nom: 'Dubois SARL', email: 'contact@dubois-sarl.fr', telephone: '01 45 67 89 01', ville: 'Marseille' },
    { id: 4, nom: 'Petit Immobilier', email: 'info@petit-immobilier.fr', telephone: '01 56 78 90 12', ville: 'Bordeaux' },
    { id: 5, nom: 'Leroy Bâtiment', email: 'contact@leroy-batiment.fr', telephone: '01 67 89 01 23', ville: 'Lille' },
  ];

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
        }}>Gestion des clients</h1>
        
        <a href="/clients/nouveau" style={{
          padding: '8px 16px',
          backgroundColor: '#22c55e',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none'
        }}>
          Nouveau client
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
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nom</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Téléphone</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Ville</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{client.nom}</td>
                <td style={{ padding: '12px 16px' }}>{client.email}</td>
                <td style={{ padding: '12px 16px' }}>{client.telephone}</td>
                <td style={{ padding: '12px 16px' }}>{client.ville}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a href={`/clients/${client.id}`} style={{
                      padding: '4px 8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}>
                      Voir
                    </a>
                    <a href={`/clients/${client.id}/modifier`} style={{
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