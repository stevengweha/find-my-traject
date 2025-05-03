import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

// Exemple de données statistiques fictives
const stats = {
  users: 150,
  activeUsers: 120,
  revenue: 3500,
  orders: 85,
};

export default function AdminDashboardScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenue, Admin!</Text>

      {/* Section Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Utilisateurs</Text>
          <Text style={styles.statValue}>{stats.users}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Utilisateurs actifs</Text>
          <Text style={styles.statValue}>{stats.activeUsers}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Revenu</Text>
          <Text style={styles.statValue}>${stats.revenue}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Commandes</Text>
          <Text style={styles.statValue}>{stats.orders}</Text>
        </View>
      </View>

      {/* Sections d'actions */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => navigation.navigate('ManageUsers')}
        >
          <Ionicons name="person-add" size={40} color="#fff" />
          <Text style={styles.actionText}>Gérer les utilisateurs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => navigation.navigate('ManageOrders')}
        >
          <FontAwesome5 name="box" size={40} color="#fff" />
          <Text style={styles.actionText}>Gérer les commandes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => navigation.navigate('Reports')}
        >
          <Ionicons name="bar-chart" size={40} color="#fff" />
          <Text style={styles.actionText}>Voir les rapports</Text>
        </TouchableOpacity>
      </View>

      {/* Autres actions */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          // Logique de déconnexion
        }}
      >
        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: '#2563eb',
    padding: 20,
    borderRadius: 10,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
  },
  statTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionBox: {
    backgroundColor: '#4CAF50',
    width: '48%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#e53e3e',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});