import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
     <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Agritech 🌱</Text>

      {/* Bouton de navigation vers humidite.tsx */}
      <Link href="/humidite" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Voir l'humidité du sol</Text>
        </Pressable>
      </Link>
      <Link href="/airTemp" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Voir l'humidité de l'air et la température</Text>
        </Pressable>
      </Link>
      <Link href="/lumiere" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Intensité de la lumière</Text>
        </Pressable>
      </Link>
    </View>
  );
  
}

const styles = StyleSheet.create({
  titleContainer: {
       flex: 1,                  // prend tout l’espace disponible
    justifyContent: 'center', // centre verticalement
    alignItems: 'center',     // centre horizontalement
    backgroundColor: '#1b4332',
  },
  stepContainer: {
   color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  reactLogo: {
    // height: 178,
    // width: 290,
    // bottom: 0,
    // left: 0,
    position: 'absolute',
    backgroundColor:'grey'
  },
   container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b4332',
  },
   title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#74c69d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical:10
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
