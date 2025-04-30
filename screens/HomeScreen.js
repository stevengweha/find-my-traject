import React from 'react';
import { View, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Button title="Voir la carte" onPress={() => navigation.navigate('Map')} />
    </View>
  );
}
