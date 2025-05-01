import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  const ORS_API_KEY = '5b3ce3597851110001cf6248cebecd89198b4984917cf0bb7410bb0c';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Autorisez la localisation pour continuer');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!location || !destination) return;

      try {
        const response = await axios.post(
          'https://api.openrouteservice.org/v2/directions/foot-walking/geojson',
          {
            coordinates: [
              [location.longitude, location.latitude],
              [destination.longitude, destination.latitude],
            ],
          },
          {
            headers: {
              Authorization: ORS_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        );

        const geometry = response.data.features[0].geometry.coordinates;
        const summary = response.data.features[0].properties.summary;

        const coords = geometry.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));

        setRouteCoords(coords);
        setRouteInfo({
          duration: Math.round(summary.duration / 60), // minutes
          distance: (summary.distance / 1000).toFixed(2), // km
        });
      } catch (err) {
        console.error('Erreur itinéraire:', err.message);
      }
    };

    fetchRoute();
  }, [destination]);

  if (!location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsBuildings
        showsCompass
        pitchEnabled
        rotateEnabled
        onPress={(e) => setDestination(e.nativeEvent.coordinate)}
      >
        {destination && (
          <Marker coordinate={destination} title="Destination" pinColor="blue" />
        )}
        {/* Exemple d'icône de transport simulée */}
        <Marker
          coordinate={{
            latitude: location.latitude + 0.002,
            longitude: location.longitude + 0.002,
          }}
          title="Station Bus"
        >
          
        </Marker>
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />
        )}
      </MapView>

      {routeInfo && (
        <View style={styles.info}>
          <Text>🕒 Temps : {routeInfo.duration} min</Text>
          <Text>📏 Distance : {routeInfo.distance} km</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
});
