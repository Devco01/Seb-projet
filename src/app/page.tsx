import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '16px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#2563eb' 
          }}>FacturePro</h1>
          <nav>
            <ul style={{ 
              display: 'flex', 
              gap: '16px', 
              listStyle: 'none', 
              margin: 0, 
              padding: 0 
            }}>
              <li><a href="/dashboard" style={{ color: '#4b5563', textDecoration: 'none' }}>Tableau de bord</a></li>
              <li><a href="/clients" style={{ color: '#4b5563', textDecoration: 'none' }}>Clients</a></li>
              <li><a href="/devis" style={{ color: '#4b5563', textDecoration: 'none' }}>Devis</a></li>
              <li><a href="/factures" style={{ color: '#4b5563', textDecoration: 'none' }}>Factures</a></li>
              <li><a href="/paiements" style={{ color: '#4b5563', textDecoration: 'none' }}>Paiements</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '48px 24px' 
        }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '48px' 
          }}>
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#111827', 
              marginBottom: '16px' 
            }}>
              Bienvenue sur FacturePro
            </h2>
            <p style={{ 
              fontSize: '20px', 
              color: '#6b7280', 
              marginTop: '16px' 
            }}>
              Solution de gestion de facturation pour entreprise de peinture en bâtiment
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px', 
            marginBottom: '48px' 
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '500', 
                  color: '#111827', 
                  marginBottom: '8px' 
                }}>Gestion des clients</h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  marginBottom: '16px' 
                }}>
                  Gérez votre base de clients et accédez rapidement à leurs informations.
                </p>
                <div>
                  <a href="/clients" style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#2563eb', 
                    textDecoration: 'none' 
                  }}>
                    Voir les clients →
                  </a>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '500', 
                  color: '#111827', 
                  marginBottom: '8px' 
                }}>Devis et factures</h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  marginBottom: '16px' 
                }}>
                  Créez et gérez vos devis et factures en quelques clics.
                </p>
                <div>
                  <a href="/devis" style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#2563eb', 
                    textDecoration: 'none' 
                  }}>
                    Voir les devis →
                  </a>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '500', 
                  color: '#111827', 
                  marginBottom: '8px' 
                }}>Suivi des paiements</h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  marginBottom: '16px' 
                }}>
                  Suivez les paiements reçus et les factures en attente.
                </p>
                <div>
                  <a href="/paiements" style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#2563eb', 
                    textDecoration: 'none' 
                  }}>
                    Voir les paiements →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="/dashboard" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '6px', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: '500', 
              textDecoration: 'none', 
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
            }}>
              Accéder au tableau de bord
            </a>
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: 'white' }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '24px', 
          textAlign: 'center' 
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280' 
          }}>
            © 2025 FacturePro - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}
