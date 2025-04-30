// backend/server.js

const express    = require('express');
const mongoose   = require('mongoose');
const dotenv     = require('dotenv');
const cors       = require('cors');         // <- déplacer ici
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// 1️⃣ CORS *avant* les routes
app.use(cors());

// 2️⃣ JSON parsing
app.use(express.json());

// Route de test pour GET /
app.get('/', (req, res) => {
  res.send('🚀 API Find-My-Traject up and running!');
});

// 3️⃣ Routes auth
app.use('/api/auth', authRoutes);

// 4️⃣ Connexion à Mongo + démarrage du serveur
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
