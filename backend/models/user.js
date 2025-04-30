const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nom: String,
  prenom: String,
  telephone: String,
  adresse: String,
  codePostal: String,
  ville: String,
  dateNaissance: String,
});

module.exports = mongoose.model('User', userSchema);
