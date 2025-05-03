const User = require('../models/user');  // Import du modèle User

// Fonction pour insérer des utilisateurs de test dans la base de données
const seedUsers = async () => {
  try {
    // Vérifiez si des utilisateurs existent déjà dans la base de données
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Les utilisateurs existent déjà, aucun ajout nécessaire.");
      return;
    }

    // Création d'utilisateurs de test
    const users = [
      {
        email: 'admin@example.com',
        password: 'admin123',  // Mot de passe à hacher plus tard
        nom: 'Admin',
        prenom: 'Test',
        role: 'admin',
        telephone: '1234567890',
        adresse: '1 Rue de l\'Admin',
        codePostal: '75001',
        ville: 'Paris',
        dateNaissance: '1990-01-01',
      },
      {
        email: 'user@example.com',
        password: 'user123',  // Mot de passe à hacher plus tard
        nom: 'User',
        prenom: 'Test',
        role: 'user',
        telephone: '9876543210',
        adresse: '2 Rue du User',
        codePostal: '75002',
        ville: 'Paris',
        dateNaissance: '1995-01-01',
      },
    ];

    // Hachage des mots de passe pour chaque utilisateur
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    for (let user of users) {
      user.password = await bcrypt.hash(user.password, salt);
    }

    // Insertion des utilisateurs dans la base de données
    await User.insertMany(users);
    console.log('Utilisateurs de test insérés avec succès !');
  } catch (err) {
    console.error('Erreur lors de l\'insertion des utilisateurs :', err);
  }
};

module.exports = { seedUsers };  // Export de la fonction
