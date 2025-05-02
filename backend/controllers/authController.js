const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Fonction d'inscription
exports.registerUser = async (req, res) => {
  console.log('📦 Données reçues dans registerUser :', req.body); // Log pour inspecter les données reçues

  const { email, password, nom, prenom, role, ville, adresse, codePostal, telephone, dateNaissance } = req.body;

  // Validation des champs nécessaires (basique)
  if (!email || !password || !nom || !prenom) {
    return res.status(400).json({ message: 'Tous les champs sont requis (email, mot de passe, nom, prénom)' });
  }

  try {
    // Vérifier si l'email est déjà utilisé
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    // Création d'un nouvel utilisateur
    const newUser = new User({
      email,
      password: hashedPassword, // Hash du mot de passe avant sauvegarde
      nom,
      prenom,
      ville,
      adresse,
      codePostal,
      telephone,
      dateNaissance,
      role: role || 'utilisateur', // Si aucun rôle n'est spécifié, le rôle par défaut est 'utilisateur'
    });

    // Sauvegarde de l'utilisateur
    await newUser.save();

    // Création du token JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Réponse avec le token
    res.status(201).json({ token });

  } catch (err) {
    console.error('💥 Erreur dans registerUser:', err);
    res.status(500).json({ message: 'Erreur du serveur', error: err.message });
  }
};

// Fonction de connexion
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validation des champs nécessaires pour la connexion
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis' });
  }

  try {
    // Chercher l'utilisateur par email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Comparaison du mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Création du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Réponse avec le token
    res.status(200).json({ token });

  } catch (err) {
    console.error('💥 Erreur dans loginUser:', err);
    res.status(500).json({ message: 'Erreur du serveur', error: err.message });
  }
};
