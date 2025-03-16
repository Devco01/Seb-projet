import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Tester la connexion à la base de données
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Récupérer les variables d'environnement (sans les valeurs sensibles)
    const envInfo = {
      databaseUrlExists: !!process.env.DATABASE_URL,
      directUrlExists: !!process.env.DIRECT_URL,
      nodeEnv: process.env.NODE_ENV,
    };
    
    // Tester la récupération des clients (comme sur la page d'accueil)
    const clients = await prisma.client.findMany({
      take: 1,
      select: {
        id: true,
        nom: true
      }
    });
    
    return NextResponse.json({
      status: 'success',
      dbConnection: 'ok',
      dbTest,
      clients,
      environment: envInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Erreur de test page d\'accueil:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 