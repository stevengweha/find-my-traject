// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/roleMiddleware');

// Route réservée aux admins
router.get('/admin-dashboard', checkRole(['admin']), (req, res) => {
  res.status(200).json({ message: 'Bienvenue Admin, voici votre tableau de bord' });
});

// Route réservée aux modérateurs et admins
router.get('/moderator-dashboard', checkRole(['moderateur', 'admin']), (req, res) => {
  res.status(200).json({ message: 'Bienvenue Modérateur, voici votre tableau de bord' });
});

module.exports = router;