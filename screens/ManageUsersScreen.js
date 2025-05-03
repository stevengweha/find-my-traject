import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ManageScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'user',
  });

  // Récupérer tous les utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.115:5001/api/admin/users', {
        headers: {
          Authorization: `Bearer ${yourAuthToken}`, // Remplace par ton token d'authentification
        },
      });

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      Alert.alert('Erreur', 'Impossible de récupérer les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un utilisateur
  const handleAddUser = async () => {
    if (!newUser.nom || !newUser.prenom || !newUser.email || !newUser.telephone) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.115:5001/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${yourAuthToken}`, // Remplace par ton token d'authentification
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (response.ok) {
        setUsers([...users, data]);
        Alert.alert('Succès', 'Utilisateur ajouté avec succès');
        setNewUser({ nom: '', prenom: '', email: '', telephone: '', role: 'user' });
      } else {
        Alert.alert('Erreur', data.message || 'Échec de l\'ajout de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout.');
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://192.168.1.115:5001/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${yourAuthToken}`, // Remplace par ton token d'authentification
        },
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== id));
        Alert.alert('Succès', 'Utilisateur supprimé');
      } else {
        const data = await response.json();
        Alert.alert('Erreur', data.message || 'Impossible de supprimer l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression.');
    }
  };

  // Affichage de la liste des utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Utilisateurs</Text>

      {/* Formulaire d'ajout d'un utilisateur */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={newUser.nom}
          onChangeText={(text) => setNewUser({ ...newUser, nom: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={newUser.prenom}
          onChangeText={(text) => setNewUser({ ...newUser, prenom: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={newUser.email}
          onChangeText={(text) => setNewUser({ ...newUser, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={newUser.telephone}
          onChangeText={(text) => setNewUser({ ...newUser, telephone: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Rôle (admin, moderateur, user)"
          value={newUser.role}
          onChangeText={(text) => setNewUser({ ...newUser, role: text })}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddUser}>
          <Text style={styles.buttonText}>Ajouter un utilisateur</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des utilisateurs */}
      {loading ? (
        <Text>Chargement...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text style={styles.userInfo}>{item.nom} {item.prenom}</Text>
              <Text style={styles.userInfo}>{item.email}</Text>
              <Text style={styles.userInfo}>{item.role}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleDeleteUser(item._id)} style={styles.deleteButton}>
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    elevation: 3,
  },
  userInfo: {
    fontSize: 16,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
});