import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test simple de connexion à la base de données
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Récupérer les variables d'environnement (sans les valeurs sensibles)
    const envInfo = {
      databaseUrlExists: !!process.env.DATABASE_URL,
      directUrlExists: !!process.env.DIRECT_URL,
      nodeEnv: process.env.NODE_ENV,
    };
    
    return NextResponse.json({
      status: 'success',
      dbConnection: 'ok',
      dbTest: result,
      environment: envInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Erreur de diagnostic:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 