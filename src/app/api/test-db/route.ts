import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configuration pour le mode standalone
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Tester la connexion à la base de données avec une requête simple
    const clientCount = await prisma.client.count();
    
    // Récupérer les variables d'environnement (sans les valeurs sensibles)
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      DIRECT_URL_SET: !!process.env.DIRECT_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_REGION: process.env.VERCEL_REGION,
    };
    
    return NextResponse.json({
      status: 'success',
      message: 'Connexion à la base de données réussie',
      data: {
        clientCount,
        timestamp: new Date().toISOString(),
        envInfo
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Erreur de connexion à la base de données',
      error: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null
    }, { status: 500 });
  }
} 