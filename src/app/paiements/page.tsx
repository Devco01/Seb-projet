export default function PaiementsPage() {
  // Donnees statiques pour la demonstration
  const paiements = [
    { id: 1, facture: 'FAC-2025-001', client: 'Dupont SAS', date: '25/01/2025', montant: 2450.50, mode: 'Virement' },
    { id: 2, facture: 'FAC-2025-004', client: 'Petit Immobilier', date: '28/02/2025', montant: 5620.30, mode: 'Cheque' },
    { id: 3, facture: 'FAC-2024-098', client: 'Dubois SARL', date: '15/12/2024', montant: 1850.75, mode: 'Carte bancaire' },
    { id: 4, facture: 'FAC-2024-095', client: 'Martin Construction', date: '05/12/2024', montant: 3200.00, mode: 'Virement' },
    { id: 5, facture: 'FAC-2024-092', client: 'Leroy Batiment', date: '28/11/2024', montant: 4750.25, mode: 'Especes' },
  ];

  // Fonction pour obtenir la couleur du mode de paiement
  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Virement': return '#3b82f6'; // bleu
      case 'Cheque': return '#8b5cf6'; // violet
      case 'Carte bancaire': return '#10b981'; // vert
      case 'Especes': return '#f59e0b'; // orange
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
        }}>Gestion des paiements</h1>
        
        <a href="/paiements/nouveau" style={{
          padding: '8px 16px',
          backgroundColor: '#22c55e',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none'
        }}>
          Nouveau paiement
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
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Facture</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Client</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Montant</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Mode</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paiements.map((paiement) => (
              <tr key={paiement.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{paiement.facture}</td>
                <td style={{ padding: '12px 16px' }}>{paiement.client}</td>
                <td style={{ padding: '12px 16px' }}>{paiement.date}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>{paiement.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: getModeColor(paiement.mode),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {paiement.mode}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a href={`/paiements/${paiement.id}`} style={{
                      padding: '4px 8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}>
                      Voir
                    </a>
                    <a href={`/paiements/${paiement.id}/modifier`} style={{
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
          Retour a l'accueil
        </a>
      </div>
      
      <footer style={{ 
        marginTop: '32px', 
        paddingTop: '16px', 
        borderTop: '1px solid #ddd', 
        textAlign: 'center',
        color: '#777'
      }}>
        <p>© 2025 FacturePro - Peinture en batiment</p>
      </footer>
    </div>
  );
}
