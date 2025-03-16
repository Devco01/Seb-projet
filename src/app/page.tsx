import Link from 'next/link';

export default function Home() {
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
      }}>FacturePro - Peinture en bâtiment</h1>
      
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
          <a href="/dashboard" style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Tableau de bord
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
          <a href="/paiements" style={{
            padding: '8px 16px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Paiements
          </a>
          <a href="/parametres" style={{
            padding: '8px 16px',
            backgroundColor: '#64748b',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Paramètres
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
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>--</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Factures impayées</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>--</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Clients actifs</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>--</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Chiffre d'affaires</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>--</p>
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
