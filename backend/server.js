const express = require('express');
const jwt = require('jsonwebtoken');  // Ajout de l'import de JWT
const bcrypt = require('bcryptjs');  // Ajout de l'import de bcrypt
const User = require('./models/user');  // Modèle utilisateur
const bodyParser = require('body-parser');  // Middleware pour parser le corps des requêtes
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Import des routes d'authentification
const protectedRoutes = require('./routes/protectedRoutes');
const adminRoutes = require('./routes/adminRoutes');
const checkRole = require('./middleware/roleMiddleware'); // Middleware de vérification des rôles
const { seedUsers } = require('./utils/seedUsers');  // Optionnel pour insérer des utilisateurs

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());  // Active CORS
app.use(bodyParser.json());  // Middleware pour parser le corps des requêtes JSON

// Test route
app.get('/', (req, res) => {
  res.send('🚀 API Find-My-Traject up and running!');
});

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extraire le token du header

  if (!token) {
    console.log("Token manquant dans l'en-tête Authorization");
    return res.status(403).json({ message: 'Access denied: Token missing' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Décoder le token
    console.log("Token validé, ID utilisateur:", decoded.id);

    req.user = decoded;  // Ajouter les infos utilisateur au request
    next();  // Passer au middleware suivant
  } catch (err) {
    console.error('Erreur lors de la vérification du token:', err);
    return res.status(400).json({ message: 'Invalid  token retry' });  // Token invalide
  }
};


// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes protégées (ex: page protégée pour utilisateur authentifié)
app.use('/api/protectedRoutes', verifyToken, protectedRoutes);

// Routes d'administration (avec vérification du rôle admin)
app.use('/api/adminRoutes', verifyToken, checkRole(['admin']), adminRoutes);

// Connexion à MongoDB et démarrage du serveur
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connecté');
    await seedUsers();  // Insertion des utilisateurs si nécessaire
    app.listen(5001, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur http://localhost:5001`);
    });
  })
  .catch(err => console.error('❌ Erreur MongoDB:', err));
