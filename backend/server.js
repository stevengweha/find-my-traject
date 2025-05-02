// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seedUsers = require('./utils/seedUsers');
const checkRole = require('./middleware/roleMiddleware');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware pour CORS
app.use(cors({
  origin: 'http://localhost:8081', // Remplace par l'URL de ton frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware pour parser les corps des requêtes en JSON
app.use(express.json());

// Vérification du token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).send('Access denied.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Stocke les informations de l'utilisateur dans la requête
    next();  // Continue avec la route suivante
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes protégées avec vérification du token
app.use('/api/protected', verifyToken, protectedRoutes);

// Routes d'administration avec vérification du token et du rôle
app.use('/api/admin', verifyToken, checkRole('admin'), adminRoutes);

// Route d'accueil
app.get('/', (req, res) => {
  res.send('🚀 API Find-My-Traject up and running!');
});

// Connexion à MongoDB et démarrage du serveur
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connecté');
    await seedUsers();  // Insert des utilisateurs si nécessaire
    app.listen(5001, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur http://localhost:5001`);
    });
  })
  .catch(err => console.error('❌ Erreur MongoDB:', err));
