import { NextResponse } from 'next/server';
import pg from 'pg';

export async function GET() {
  const { Pool } = pg;
  let client = null;
  
  try {
    // Créer un pool de connexion avec les variables d'environnement
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Obtenir un client du pool
    client = await pool.connect();
    
    // Exécuter une requête simple
    const result = await client.query('SELECT NOW() as time');
    
    // Récupérer les variables d'environnement (sans les valeurs sensibles)
    const envInfo = {
      databaseUrlExists: !!process.env.DATABASE_URL,
      directUrlExists: !!process.env.DIRECT_URL,
      nodeEnv: process.env.NODE_ENV,
    };
    
    return NextResponse.json({
      status: 'success',
      dbConnection: 'ok',
      dbTest: result.rows[0],
      environment: envInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Erreur de connexion directe à la base de données:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  } finally {
    // Libérer le client s'il existe
    if (client) {
      client.release();
    }
  }
} 