const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Générer une clé secrète aléatoire
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Créer un token JWT simple (simulation)
const createToken = (secret) => {
  // Créer un header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // Créer un payload avec une expiration de 1 an
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: 'blob',
    iat: now,
    exp: now + 31536000, // 1 an en secondes
    permissions: {
      read: true,
      write: true
    }
  };

  // Encoder header et payload en base64
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=+$/, '');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=+$/, '');

  // Créer la signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac('sha256', secret)
    .update(signatureInput)
    .digest('base64')
    .replace(/=+$/, '');

  // Combiner pour former le token
  return `vercel_blob_rw_${encodedHeader}.${encodedPayload}.${signature}`;
};

// Générer un token
const secret = generateSecret();
const token = createToken(secret);

console.log('\n=== Token Vercel Blob Temporaire ===');
console.log(token);
console.log('\nCe token est généré localement et peut être utilisé pour des tests.');
console.log('Pour la production, vous devriez obtenir un vrai token depuis Vercel.\n');

// Mettre à jour le fichier .env
const envPath = path.resolve(process.cwd(), '.env');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('Erreur lors de la lecture du fichier .env:', error);
  process.exit(1);
}

// Remplacer ou ajouter le token
if (envContent.includes('BLOB_READ_WRITE_TOKEN=')) {
  envContent = envContent.replace(
    /BLOB_READ_WRITE_TOKEN=.*/,
    `BLOB_READ_WRITE_TOKEN=${token}`
  );
} else {
  envContent += `\n# Vercel Blob Storage\nBLOB_READ_WRITE_TOKEN=${token}\n`;
}

// Écrire le fichier .env mis à jour
try {
  fs.writeFileSync(envPath, envContent);
  console.log('Le token a été ajouté au fichier .env');
} catch (error) {
  console.error('Erreur lors de l\'écriture du fichier .env:', error);
  process.exit(1);
}

// Mise à jour du fichier blob.json
const blobConfigDir = path.resolve(process.cwd(), '.vercel');
const blobConfigPath = path.resolve(blobConfigDir, 'blob.json');

// S'assurer que le répertoire existe
if (!fs.existsSync(blobConfigDir)) {
  fs.mkdirSync(blobConfigDir, { recursive: true });
}

// Créer le contenu du fichier blob.json
const blobConfig = {
  token: token
};

// Écrire le fichier blob.json
try {
  fs.writeFileSync(blobConfigPath, JSON.stringify(blobConfig, null, 2));
  console.log('Le token a été ajouté au fichier .vercel/blob.json');
} catch (error) {
  console.error('Erreur lors de l\'écriture du fichier blob.json:', error);
}

console.log('\nUtilisez ce token pour tester le téléchargement de fichiers vers Vercel Blob.');
console.log('Note: Ce token n\'est pas validé par Vercel et ne fonctionnera que pour des tests locaux.'); 