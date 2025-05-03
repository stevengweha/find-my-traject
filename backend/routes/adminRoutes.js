const express = require('express');
const User = require('../models/user');
const checkRole = require('../middleware/roleMiddleware'); // Le middleware qui vérifie le rôle
const router = express.Router();

// Récupérer tous les utilisateurs (READ)
router.get('/users', checkRole(['admin', 'moderateur']), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Créer un utilisateur (CREATE)
router.post('/users', checkRole(['admin']), async (req, res) => {
  const { nom, prenom, email, telephone, role } = req.body;

  try {
    const newUser = new User({ nom, prenom, email, telephone, role: role || 'user' });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Mettre à jour un utilisateur (UPDATE)
router.put('/users/:id', checkRole(['admin', 'moderateur']), async (req, res) => {
  const { nom, prenom, email, telephone, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { nom, prenom, email, telephone, role },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Supprimer un utilisateur (DELETE)
router.delete('/users/:id', checkRole(['admin']), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

module.exports = router;