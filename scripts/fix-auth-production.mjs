#!/usr/bin/env node

import https from 'https';

// Configuration
const CONFIG = {
  // Remplacez par votre URL de production Vercel
  PRODUCTION_URL: process.env.VERCEL_URL || 'VOTRE_URL_PRODUCTION.vercel.app',
  LOCAL_ENV_FILE: '.env'
};

console.log('🔍 Diagnostic automatique des problèmes d\'authentification...\n');

async function checkProductionDiagnostics() {
  return new Promise((resolve, reject) => {
    const url = `https://${CONFIG.PRODUCTION_URL}/api/debug`;
    console.log(`📡 Vérification de : ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error(`Erreur parsing JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Erreur réseau: ${error.message}`));
    });
  });
}

function generateNextAuthSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function createVercelEnvCommands(diagnostics) {
  const commands = [];
  
  if (!diagnostics.nextauth.url || diagnostics.nextauth.url.includes('localhost')) {
    commands.push(`npx vercel env add NEXTAUTH_URL production`);
    commands.push(`# Valeur: https://${CONFIG.PRODUCTION_URL}`);
  }
  
  if (!diagnostics.nextauth.secret || diagnostics.nextauth.secretLength < 32) {
    commands.push(`npx vercel env add NEXTAUTH_SECRET production`);
    commands.push(`# Valeur: ${generateNextAuthSecret()}`);
  }
  
  if (!diagnostics.database.url && !diagnostics.database.postgresUrl) {
    commands.push(`npx vercel env add DATABASE_URL production`);
    commands.push(`# Valeur: votre URL PostgreSQL`);
  }
  
  return commands;
}

function displayFixInstructions(diagnostics) {
  console.log('\n📋 INSTRUCTIONS DE CORRECTION:\n');
  
  console.log('🔧 ÉTAPE 1: Variables d\'environnement Vercel');
  console.log('Exécutez ces commandes:');
  
  const commands = createVercelEnvCommands(diagnostics);
  commands.forEach(cmd => {
    if (cmd.startsWith('#')) {
      console.log(`   ${cmd}`);
    } else {
      console.log(`   ${cmd}`);
    }
  });
  
  console.log('\n🔧 ÉTAPE 2: Redéploiement');
  console.log('   npx vercel --prod');
  
  console.log('\n🔧 ÉTAPE 3: Vérification');
  console.log(`   Attendez 1-2 minutes puis visitez: https://${CONFIG.PRODUCTION_URL}/auth/login`);
}

async function main() {
  try {
    // Essayer de diagnostiquer la production
    let productionDiag = null;
    try {
      productionDiag = await checkProductionDiagnostics();
      console.log(`✅ Connexion réussie à la production`);
    } catch (error) {
      console.log(`❌ Impossible de se connecter à la production: ${error.message}`);
      console.log(`💡 Modifiez CONFIG.PRODUCTION_URL dans le script avec votre vraie URL`);
    }

    if (productionDiag) {
      console.log('\n📊 ÉTAT DE LA PRODUCTION:');
      console.log(`   Statut: ${productionDiag.status}`);
      console.log(`   Environnement: ${productionDiag.diagnostics.environment}`);
      console.log(`   NextAuth URL: ${productionDiag.diagnostics.nextauth.url || 'MANQUANT'}`);
      console.log(`   NextAuth Secret: ${productionDiag.diagnostics.nextauth.secret}`);
      
      if (productionDiag.diagnostics.issues.length > 0) {
        console.log('\n❌ PROBLÈMES DÉTECTÉS:');
        productionDiag.diagnostics.issues.forEach(issue => {
          console.log(`   • ${issue}`);
        });
        
        displayFixInstructions(productionDiag.diagnostics);
      } else {
        console.log('\n✅ AUCUN PROBLÈME DÉTECTÉ!');
        console.log('   L\'authentification devrait fonctionner correctement.');
        console.log(`   Testez sur: https://${CONFIG.PRODUCTION_URL}/auth/login`);
      }
    }
    
    console.log('\n🎯 RÉSUMÉ:');
    console.log('1. Modifiez CONFIG.PRODUCTION_URL dans ce script avec votre vraie URL');
    console.log('2. Configurez les variables d\'environnement sur Vercel');
    console.log('3. Redéployez l\'application');
    console.log('4. Testez l\'authentification');

  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    console.log('\n💡 Solutions alternatives:');
    console.log('1. Vérifiez manuellement les variables d\'environnement sur Vercel');
    console.log('2. Assurez-vous que NEXTAUTH_URL correspond exactement à votre domaine');
    console.log('3. Régénérez NEXTAUTH_SECRET s\'il est trop court');
  }
}

// Lancer le script
main(); 