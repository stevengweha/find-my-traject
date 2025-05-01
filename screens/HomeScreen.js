import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚀 Les Bienfaits du Transport Intelligent</Text>

      <View style={styles.sectionContainer}>
        <Ionicons name="time" size={24} color="#4CAF50" style={styles.icon} />
        <Text style={styles.section}>⏱️ 1. Gain de temps précieux</Text>
        <Text style={styles.text}>
          Un itinéraire optimisé permet de réduire les temps de trajet, éviter les embouteillages et arriver plus rapidement à destination.
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Ionicons name="leaf" size={24} color="#4CAF50" style={styles.icon} />
        <Text style={styles.section}>🌍 2. Réduction de l’empreinte carbone</Text>
        <Text style={styles.text}>
          En favorisant la marche, le vélo ou les transports en commun, vous limitez votre impact écologique.
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Ionicons name="happy" size={24} color="#4CAF50" style={styles.icon} />
        <Text style={styles.section}>🧠 3. Moins de stress, plus de sérénité</Text>
        <Text style={styles.text}>
          Savoir où aller et comment y arriver diminue l’anxiété liée aux trajets imprévus.
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Ionicons name="wallet" size={24} color="#4CAF50" style={styles.icon} />
        <Text style={styles.section}>💰 4. Économies financières</Text>
        <Text style={styles.text}>
          Réduisez vos frais de carburant, de péage ou de stationnement en optimisant vos trajets.
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Ionicons name="walk" size={24} color="#4CAF50" style={styles.icon} />
        <Text style={styles.section}>🏃‍♂️ 5. Santé physique et bien-être</Text>
        <Text style={styles.text}>
          Favoriser les déplacements actifs améliore votre santé tout en découvrant votre environnement.
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Ionicons name="globe" size={24} color="#4CAF50" style={styles.icon} />
        <Text style={styles.section}>📱 6. Découverte et enrichissement personnel</Text>
        <Text style={styles.text}>
          Explorer de nouveaux itinéraires peut vous faire découvrir des endroits inattendus et intéressants.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
          <Text style={styles.buttonText}>Voir la carte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
