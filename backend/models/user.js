const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
    minlength: 6,
    select: false, // Masquer le mot de passe dans les requêtes par défaut
  },
  nom: { type: String, trim: true },
  prenom: { type: String, trim: true },
  telephone: { type: String },
  adresse: { type: String },
  codePostal: { type: String },
  ville: { type: String },
  dateNaissance: { type: String },

  // Préparation pour gestion des rôles
  role: {
    type: String,
    enum: ['utilisateur', 'moderateur', 'admin'],
    default: 'utilisateur',
  }
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

// 🔐 Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
