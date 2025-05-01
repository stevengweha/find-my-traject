const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  // Déplacez l'importation de cors ici, avant de l'utiliser
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());  // Maintenant, cors peut être utilisé ici
// Test route
app.get('/', (req, res) => {
  res.send('🚀 API Find-My-Traject up and running!');
});

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5001, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:5001`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
