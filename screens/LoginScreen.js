import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Afficher un message de chargement pendant l'envoi de la requête
    setLoading(true);
    setError(''); // Réinitialiser l'erreur à chaque tentative

    try {
      console.log("Envoi de la requête de connexion...");

      const res = await fetch('http://192.168.1.115:5000/api/auth/login', {  // Vérifie que l'URL est correcte
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log('Données reçues :', data);  // Affiche la réponse du serveur

      if (res.ok) {
        console.log('Connecté avec succès !');
        // Sauvegarder le token dans le stockage local ou un contexte global si nécessaire
        // Exemple : AsyncStorage.setItem('token', data.token);
        navigation.navigate('Home');  // Redirige vers la page d'accueil
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (err) {
      console.log("Erreur réseau:", err);
      setError('Problème de réseau');
    } finally {
      setLoading(false); // Arrêter l'animation de chargement
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {/* Afficher l'erreur si elle existe */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Formulaire de connexion */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Bouton de connexion */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Connexion en cours...' : "Se connecter"}
        </Text>
      </TouchableOpacity>

      {/* Lien vers la page d'inscription */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});
