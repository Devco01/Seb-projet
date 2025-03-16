"use client";

export default function DashboardPage() {
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
              <li><a href="/dashboard" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 'bold' }}>Tableau de bord</a></li>
              <li><a href="/clients" style={{ color: '#4b5563', textDecoration: 'none' }}>Clients</a></li>
              <li><a href="/devis" style={{ color: '#4b5563', textDecoration: 'none' }}>Devis</a></li>
              <li><a href="/factures" style={{ color: '#4b5563', textDecoration: 'none' }}>Factures</a></li>
              <li><a href="/paiements" style={{ color: '#4b5563', textDecoration: 'none' }}>Paiements</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main style={{ flexGrow: 1, padding: '24px' }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto'
        }}>
          <div style={{ 
            marginBottom: '24px'
          }}>
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '8px' 
            }}>
              Tableau de bord
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280'
            }}>
              Aperçu de votre activité
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px', 
            marginBottom: '32px' 
          }}>
            {/* Carte Chiffre d'affaires */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '16px' 
              }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '4px' 
                  }}>
                    Chiffre d'affaires
                  </p>
                  <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#111827' 
                  }}>
                    45 600 €
                  </h2>
                </div>
                <div style={{ 
                  backgroundColor: '#e0f2fe', 
                  borderRadius: '9999px', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ fontSize: '20px' }}>💰</span>
                </div>
              </div>
              <p style={{ 
                fontSize: '14px', 
                color: '#16a34a' 
              }}>
                +12% par rapport au mois dernier
              </p>
            </div>

            {/* Carte Devis en cours */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '16px' 
              }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '4px' 
                  }}>
                    Devis en cours
                  </p>
                  <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#111827' 
                  }}>
                    8
                  </h2>
                </div>
                <div style={{ 
                  backgroundColor: '#fef3c7', 
                  borderRadius: '9999px', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ fontSize: '20px' }}>📝</span>
                </div>
              </div>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280' 
              }}>
                Valeur totale: 15 800 €
              </p>
            </div>

            {/* Carte Factures impayées */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '16px' 
              }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '4px' 
                  }}>
                    Factures impayées
                  </p>
                  <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#111827' 
                  }}>
                    5
                  </h2>
                </div>
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  borderRadius: '9999px', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ fontSize: '20px' }}>📊</span>
                </div>
              </div>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280' 
              }}>
                Montant dû: 8 200 €
              </p>
            </div>

            {/* Carte Clients actifs */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '16px' 
              }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '4px' 
                  }}>
                    Clients actifs
                  </p>
                  <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#111827' 
                  }}>
                    24
                  </h2>
                </div>
                <div style={{ 
                  backgroundColor: '#dcfce7', 
                  borderRadius: '9999px', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ fontSize: '20px' }}>👥</span>
                </div>
              </div>
              <p style={{ 
                fontSize: '14px', 
                color: '#16a34a' 
              }}>
                +3 nouveaux ce mois-ci
              </p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            marginBottom: '32px'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '16px' 
            }}>
              Actions rapides
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px' 
            }}>
              <a href="/clients/nouveau" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                color: '#4b5563' 
              }}>
                <span style={{ marginRight: '8px', fontSize: '20px' }}>➕</span>
                <span>Nouveau client</span>
              </a>
              <a href="/devis/nouveau" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                color: '#4b5563' 
              }}>
                <span style={{ marginRight: '8px', fontSize: '20px' }}>📝</span>
                <span>Créer un devis</span>
              </a>
              <a href="/factures/nouveau" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                color: '#4b5563' 
              }}>
                <span style={{ marginRight: '8px', fontSize: '20px' }}>📄</span>
                <span>Créer une facture</span>
              </a>
              <a href="/paiements/nouveau" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                color: '#4b5563' 
              }}>
                <span style={{ marginRight: '8px', fontSize: '20px' }}>💸</span>
                <span>Enregistrer un paiement</span>
              </a>
            </div>
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