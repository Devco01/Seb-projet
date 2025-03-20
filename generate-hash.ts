import bcrypt from 'bcryptjs';

const password = 'votre_mot_de_passe'; // Remplacez par votre mot de passe souhaité

bcrypt.hash(password, 10).then(hash => {
  console.log('Hash généré :', hash);
}); 