// middleware/roleMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.header('Authorization');  // Récupère le header Authorization

    // Vérification de la présence de l'en-tête Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou invalide' });
    }

    // Extraire le token du header
    const token = authHeader.replace('Bearer ', '');

    try {
      // Vérification et décodage du token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Décoder le token pour récupérer l'ID et le rôle

      // Récupérer l'utilisateur à partir de son ID
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      // Vérification du rôle de l'utilisateur
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
      }

      // L'utilisateur est authentifié et autorisé à accéder à la route
      req.user = user;
      next();
    } catch (err) {
      // Gérer l'erreur de token invalide ou expiré
      console.error('Erreur lors de la vérification du token:', err);
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  };
};

module.exports = checkRole;
