const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware global
app.use(bodyParser.json());
app.use(cors());

// ===================
// Inscription
// ===================
exports.registerUser = async (req, res) => {
  const {
    email,
    password,
    nom,
    prenom,
    telephone,
    adresse,
    codePostal,
    ville,
    dateNaissance,
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      nom,
      prenom,
      telephone,
      adresse,
      codePostal,
      ville,
      dateNaissance,
      role: 'user', // Assigner un rôle par défaut à l'utilisateur

    });

    // Création du token JWT avec l'ID et le rôle
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Réponse avec le token et l'utilisateur
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===================
// Connexion
// ===================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email or password is invalid' });

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email or password is invalid' });

    // Création du token JWT avec l'ID et le rôle
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Réponse avec le token et les informations de l'utilisateur
    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

