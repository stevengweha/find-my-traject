import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, FlatList,
} from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState('driving-car');
  const [distanceRemaining, setDistanceRemaining] = useState(null);
  const [directions, setDirections] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef();

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
      mapRef.current.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (newLoc) => {
          setLocation(newLoc.coords);
          mapRef.current.animateToRegion({
            latitude: newLoc.coords.latitude,
            longitude: newLoc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);

          if (routeCoords.length > 0) {
            const remainingDistance = getRemainingDistance(newLoc.coords, routeCoords);
            setDistanceRemaining(remainingDistance);
            const currentDirection = getCurrentDirection(newLoc.coords, routeCoords);
            setDirections(currentDirection);
            Speech.speak(`Il vous reste ${remainingDistance.toFixed(2)} kilomètres. ${currentDirection}`);
          }
        }
      );
    })();
  }, [routeCoords]);

  useEffect(() => {
    if (location && destination) fetchRoute();
  }, [destination, mode]);

  const fetchRoute = async () => {
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/${mode}/geojson`,
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
      const coords = geometry.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));

      setRouteCoords(coords);
      setRouteInfo({
        duration: Math.round(response.data.features[0].properties.summary.duration / 60),
        distance: (response.data.features[0].properties.summary.distance / 1000).toFixed(2),
      });

      Speech.speak(`Votre trajet dure ${Math.round(response.data.features[0].properties.summary.duration / 60)} minutes pour ${response.data.features[0].properties.summary.distance / 1000} kilomètres.`);

      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 100, bottom: 100, left: 50, right: 50 },
        animated: true,
      });
    } catch (err) {
      console.error('Erreur itinéraire:', err);
      Alert.alert('Erreur', 'Échec du calcul de l’itinéraire');
    }
  };

  const getRemainingDistance = (currentLoc, routeCoords) => {
    if (routeCoords.length === 0) return 0;
    const lastPoint = routeCoords[routeCoords.length - 1];
    return calculateDistance(currentLoc, lastPoint);
  };

  const calculateDistance = (point1, point2) => {
    const toRad = (degree) => (degree * Math.PI) / 180;
    const R = 6371;
    const lat1 = toRad(point1.latitude);
    const lon1 = toRad(point1.longitude);
    const lat2 = toRad(point2.latitude);
    const lon2 = toRad(point2.longitude);
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCurrentDirection = (currentLoc, routeCoords) => {
    if (routeCoords.length < 2) return '';
    const nextPoint = routeCoords[1];
    const angle = getBearing(currentLoc, nextPoint);
    if (angle >= 45 && angle < 135) return 'Tournez à gauche';
    if (angle >= 135 && angle < 225) return 'Faites demi-tour';
    if (angle >= 225 && angle < 315) return 'Tournez à droite';
    return 'Continuez tout droit';
  };

  const getBearing = (start, end) => {
    const lat1 = start.latitude * Math.PI / 180;
    const lat2 = end.latitude * Math.PI / 180;
    const lon1 = start.longitude * Math.PI / 180;
    const lon2 = end.longitude * Math.PI / 180;
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const coord = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        setDestination(coord);
        setSuggestions([]);
      } else Alert.alert('Adresse non trouvée');
    } catch {
      Alert.alert('Erreur lors de la recherche');
    }
  };

  const fetchSuggestions = async (text) => {
    setSearchQuery(text);
    if (!text.trim()) return setSuggestions([]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDestination(null);
    setRouteCoords([]);
    setRouteInfo(null);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="location" size={20} color="#555" style={{ marginHorizontal: 8 }} />
        <TextInput
          placeholder="Rechercher une adresse..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={fetchSuggestions}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={clearSearch} style={styles.resetBtn}>
          {searchQuery.length > 0 && <Ionicons name="close" size={20} color="#555" />}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {suggestions.length > 0 && (
        <FlatList
          style={styles.suggestionList}
          data={suggestions}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              setDestination({ latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) });
              setSearchQuery(item.display_name);
              setSuggestions([]);
            }}>
              <Text style={styles.suggestionItem}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {routeCoords.length > 0 && (
        <View style={styles.transportToggle}>
          {['foot-walking', 'cycling-regular', 'driving-car'].map((m) => (
            <TouchableOpacity key={m} onPress={() => setMode(m)} style={[styles.modeBtn, mode === m && styles.selectedMode]}>
              <Text style={{ color: 'white' }}>{m.split('-')[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        onPress={(e) => setDestination(e.nativeEvent.coordinate)}
      >
        {location && <Marker coordinate={location} title="Départ" pinColor="green" />}
        {destination && <Marker coordinate={destination} title="Arrivée" pinColor="blue" />}
        {routeCoords.length > 0 && (
          <>
            <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />
            <Marker coordinate={routeCoords[Math.floor(routeCoords.length / 2)]}>
              <Callout>
                <Text>🕒 {routeInfo?.duration} min | 📏 {routeInfo?.distance} km</Text>
              </Callout>
            </Marker>
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  searchBar: {
    position: 'absolute', top: 40, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 5, zIndex: 2, width: '90%', alignSelf: 'center',
  },
  searchInput: { flex: 1, height: 40 },
  resetBtn: { justifyContent: 'center', paddingHorizontal: 8 },
  searchBtn: { justifyContent: 'center', paddingHorizontal: 8, backgroundColor: '#1e90ff', paddingVertical: 8, borderRadius: 5 },
  suggestionList: { position: 'absolute', top: 90, backgroundColor: 'white', zIndex: 2, width: '90%', alignSelf: 'center', borderRadius: 5, maxHeight: 150 },
  suggestionItem: { padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1 },
  transportToggle: { position: 'absolute', bottom: 80, left: 20, flexDirection: 'row', zIndex: 2 },
  modeBtn: { backgroundColor: '#1e90ff', padding: 10, borderRadius: 5, marginRight: 10 },
  selectedMode: { backgroundColor: '#00bfff' },
});
