import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      production: {
        url: process.env.NEXTAUTH_URL || 'NON CONFIGURÉ',
        secretPresent: !!process.env.NEXTAUTH_SECRET,
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
        databaseUrl: !!process.env.DATABASE_URL
      },
      issues: [] as string[],
      solutions: [] as string[]
    };

    // Diagnostic automatique des problèmes
    if (!process.env.NEXTAUTH_URL) {
      diagnostics.issues.push('❌ NEXTAUTH_URL manquant');
      diagnostics.solutions.push('1. Aller sur vercel.com → Votre projet → Settings → Environment Variables');
      diagnostics.solutions.push('2. Ajouter NEXTAUTH_URL avec votre vraie URL de production');
    }

    if (!process.env.NEXTAUTH_SECRET) {
      diagnostics.issues.push('❌ NEXTAUTH_SECRET manquant');
      diagnostics.solutions.push('3. Ajouter NEXTAUTH_SECRET avec une clé de 64 caractères');
    } else if (process.env.NEXTAUTH_SECRET.length < 32) {
      diagnostics.issues.push('❌ NEXTAUTH_SECRET trop court');
      diagnostics.solutions.push('3. REMPLACER NEXTAUTH_SECRET par une clé plus longue');
    }

    if (!process.env.DATABASE_URL) {
      diagnostics.issues.push('❌ DATABASE_URL manquant');
      diagnostics.solutions.push('4. Configurer la base de données PostgreSQL sur Vercel');
    }

    // Test automatique de connexion
    let authTest = 'NON TESTÉ';
    try {
      const testResponse = await fetch(`${process.env.NEXTAUTH_URL || 'https://votre-site.vercel.app'}/api/auth/session`);
      authTest = testResponse.ok ? '✅ API ACCESSIBLE' : `❌ ERREUR ${testResponse.status}`;
    } catch (error) {
      authTest = `❌ CONNEXION IMPOSSIBLE: ${error}`;
    }

    return NextResponse.json({
      status: diagnostics.issues.length === 0 ? 'PRÊT' : 'PROBLÈMES DÉTECTÉS',
      problemes: diagnostics.issues,
      solutions: diagnostics.solutions,
      authTest,
      resumé: diagnostics.issues.length === 0 
        ? "✅ Tout semble configuré correctement" 
        : `❌ ${diagnostics.issues.length} problème(s) détecté(s) - voir les solutions`,
      nextSteps: diagnostics.issues.length > 0 
        ? "Corrigez les variables d'environnement sur Vercel puis redéployez"
        : "Le site devrait fonctionner pour votre client"
    });

  } catch (error) {
    return NextResponse.json({
      status: 'ERREUR CRITIQUE',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 