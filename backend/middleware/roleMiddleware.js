// middleware/roleMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkRole = (roles) => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Pas de token, autorisation refusée' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Accès refusé, rôle insuffisant' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
};

module.exports = checkRole;
