// utils/seedUsers.js
const mongoose = require('mongoose');
const User = require('../models/user');

const seedUsers = async () => {
  const users = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      nom: 'Admin',
      prenom: 'Root',
      ville: 'Paris',
      adresse: '1 rue de la Paix',
      codePostal: '75001',
      telephone: '0123456789',
      dateNaissance: '1990-01-01',
      role: 'admin',
    },
    {
      email: 'moderateur@example.com',
      password: 'mod123',
      nom: 'Moderateur',
      prenom: 'Modo',
      ville: 'Lyon',
      adresse: '2 rue de la République',
      codePostal: '69001',
      telephone: '0987654321',
      dateNaissance: '1985-05-05',
      role: 'moderateur',
    },
    {
      email: 'user@example.com',
      password: 'user123',
      nom: 'Utilisateur',
      prenom: 'Normal',
      ville: 'Marseille',
      adresse: '3 avenue des Champs',
      codePostal: '13001',
      telephone: '0123456789',
      dateNaissance: '1995-01-01',
      role: 'utilisateur',
    },
  ];

  for (const userData of users) {
    const existing = await User.findOne({ email: userData.email });
    if (!existing) {
      const user = new User(userData); // le mot de passe sera hashé via le middleware .pre('save')
      await user.save();
      console.log(`✅ Utilisateur ${user.email} créé`);
    } else {
      console.log(`ℹ️ Utilisateur ${userData.email} déjà existant`);
    }
  }
};

module.exports = seedUsers;
