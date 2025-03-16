"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page d'accueil alternative
    router.push('/accueil');
  }, [router]);

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '24px',
        color: '#333'
      }}>Tableau de bord</h1>
      
      <div style={{ marginBottom: '32px' }}>
        <p style={{ 
          fontSize: '18px', 
          marginBottom: '16px',
          color: '#555'
        }}>
          Bienvenue sur votre espace de gestion. Cette page est une version statique sans connexion à la base de données.
        </p>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '16px', 
          marginBottom: '24px'
        }}>
          <a href="/" style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Accueil
          </a>
          <a href="/clients" style={{
            padding: '8px 16px',
            backgroundColor: '#22c55e',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Clients
          </a>
          <a href="/devis" style={{
            padding: '8px 16px',
            backgroundColor: '#eab308',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Devis
          </a>
          <a href="/factures" style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Factures
          </a>
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Devis en cours</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>5</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Factures impayées</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>3</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Clients actifs</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>12</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Chiffre d'affaires</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>15 400 €</p>
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Activités récentes</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}>
              <p style={{ fontWeight: 'medium' }}>Facture #F-2023-042 créée</p>
              <p style={{ fontSize: '14px', color: '#777' }}>Il y a 2 jours</p>
            </li>
            <li style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}>
              <p style={{ fontWeight: 'medium' }}>Paiement reçu de Dupont SAS</p>
              <p style={{ fontSize: '14px', color: '#777' }}>Il y a 3 jours</p>
            </li>
            <li style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}>
              <p style={{ fontWeight: 'medium' }}>Devis #D-2023-018 envoyé</p>
              <p style={{ fontSize: '14px', color: '#777' }}>Il y a 5 jours</p>
            </li>
          </ul>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Tâches à faire</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <input type="checkbox" style={{ marginRight: '8px' }} />
              <span>Relancer la facture #F-2023-039</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <input type="checkbox" style={{ marginRight: '8px' }} />
              <span>Finaliser le devis pour Martin Construction</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <input type="checkbox" style={{ marginRight: '8px' }} />
              <span>Mettre à jour les coordonnées de Dubois SARL</span>
            </li>
          </ul>
        </div>
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