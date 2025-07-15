import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nextauth: {
        url: process.env.NEXTAUTH_URL,
        secret: process.env.NEXTAUTH_SECRET ? 'CONFIGURÉ' : 'MANQUANT',
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0
      },
      database: {
        url: process.env.DATABASE_URL ? 'CONFIGURÉ' : 'MANQUANT',
        postgresUrl: process.env.POSTGRES_URL ? 'CONFIGURÉ' : 'MANQUANT'
      },
      vercel: {
        url: process.env.VERCEL_URL || 'NON DÉTECTÉ',
        env: process.env.VERCEL_ENV || 'NON DÉTECTÉ',
        branch: process.env.VERCEL_BRANCH_URL || 'NON DÉTECTÉ'
      },
      issues: [] as string[]
    };

    // Vérifications et détection d'erreurs
    if (!process.env.NEXTAUTH_URL) {
      diagnostics.issues.push('NEXTAUTH_URL manquant - l\'authentification ne fonctionnera pas');
    }

    if (!process.env.NEXTAUTH_SECRET) {
      diagnostics.issues.push('NEXTAUTH_SECRET manquant - les sessions ne seront pas sécurisées');
    }

    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
      diagnostics.issues.push('NEXTAUTH_SECRET trop court - doit faire au moins 32 caractères');
    }

    if (process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('http://')) {
      diagnostics.issues.push('NEXTAUTH_URL utilise HTTP en production - doit être HTTPS');
    }

    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
      diagnostics.issues.push('Aucune URL de base de données configurée');
    }

    // Suggestions de correction
    const suggestions = [];
    if (diagnostics.issues.length > 0) {
      suggestions.push('Variables d\'environnement à configurer sur Vercel :');
      if (!process.env.NEXTAUTH_URL) {
        suggestions.push('NEXTAUTH_URL=https://votre-domaine.vercel.app');
      }
      if (!process.env.NEXTAUTH_SECRET) {
        suggestions.push('NEXTAUTH_SECRET=' + generateSecretSuggestion());
      }
    }

    return NextResponse.json({
      status: diagnostics.issues.length === 0 ? 'OK' : 'ERREURS_DÉTECTÉES',
      diagnostics,
      suggestions,
      correctiveActions: generateCorrectiveActions(diagnostics.issues)
    });

  } catch (error) {
    return NextResponse.json({
      status: 'ERREUR_CRITIQUE',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      diagnostics: null
    }, { status: 500 });
  }
}

function generateSecretSuggestion(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateCorrectiveActions(issues: string[]): string[] {
  const actions = [];
  
  if (issues.some(issue => issue.includes('NEXTAUTH_URL'))) {
    actions.push('1. Aller sur vercel.com → Votre projet → Settings → Environment Variables');
    actions.push('2. Ajouter NEXTAUTH_URL avec l\'URL exacte de production');
  }
  
  if (issues.some(issue => issue.includes('NEXTAUTH_SECRET'))) {
    actions.push('3. Ajouter NEXTAUTH_SECRET avec une clé de 64 caractères');
  }
  
  if (issues.length > 0) {
    actions.push('4. Redéployer l\'application après avoir ajouté les variables');
    actions.push('5. Attendre 1-2 minutes que le déploiement soit actif');
  }
  
  return actions;
} 