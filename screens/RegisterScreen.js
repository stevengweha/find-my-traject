import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://192.168.1.115:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nom,
          prenom,
          telephone,
          adresse,
          codePostal,
          ville,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token;
        const user = data.user;  // Récupérer les informations de l'utilisateur

        if (!token) {
          setError("Token manquant dans la réponse.");
          return;
        }

        // Sauvegarder le token et les informations de l'utilisateur dans AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        // Redirection en fonction du rôle
        if (user.role === 'admin') {
          navigation.navigate('AdminDashboard');
        } else if (user.role === 'moderateur') {
          navigation.navigate('ModeratorDashboard');
        } else {
          navigation.navigate('Home');
        }
      } else {
        setError(data.message || 'Erreur d\'inscription');
      }
    } catch (err) {
      setError('Problème de réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nom"
        placeholderTextColor="#888"
        value={nom}
        onChangeText={setNom}
      />

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        placeholderTextColor="#888"
        value={prenom}
        onChangeText={setPrenom}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        placeholderTextColor="#888"
        value={telephone}
        onChangeText={setTelephone}
      />

      <TextInput
        style={styles.input}
        placeholder="Adresse"
        placeholderTextColor="#888"
        value={adresse}
        onChangeText={setAdresse}
      />

      <TextInput
        style={styles.input}
        placeholder="Code Postal"
        placeholderTextColor="#888"
        value={codePostal}
        onChangeText={setCodePostal}
      />

      <TextInput
        style={styles.input}
        placeholder="Ville"
        placeholderTextColor="#888"
        value={ville}
        onChangeText={setVille}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Inscription en cours...' : "S'inscrire"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
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
