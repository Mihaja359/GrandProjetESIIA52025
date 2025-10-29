import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

// ⚙️ Largeur de l'écran
const screenWidth = Dimensions.get('window').width;

export default function AirTempScreen() {
  const [humidityData, setHumidityData] = useState<number[]>([60, 62, 61, 63, 65, 66, 64]);
  const [tempData, setTempData] = useState<number[]>([24, 25, 23, 26, 27, 28, 26]);

  // ⏱️ Simulation de données temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setHumidityData(prev => [...prev.slice(1), Math.floor(60 + Math.random() * 10)]);
      setTempData(prev => [...prev.slice(1), Math.floor(23 + Math.random() * 6)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Humidité de l’air 💧 & Température 🌡️</Text>

        {/* 🌫️ Bloc Humidité de l'air */}
        <View style={styles.card}>
          <Text style={styles.label}>Humidité de l’air</Text>
          <Text style={styles.value}>{humidityData[humidityData.length - 1]}%</Text>
        </View>

        {/* 🌡️ Bloc Température */}
        <View style={styles.card}>
          <Text style={styles.label}>Température</Text>
          <Text style={styles.value}>{tempData[tempData.length - 1]}°C</Text>
        </View>

        {/* 📊 Graphique combiné */}
        <Text style={styles.graphTitle}>Évolution récente</Text>
        <LineChart
          data={{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              { data: humidityData, color: () => '#74c69d', strokeWidth: 2 },
              { data: tempData, color: () => '#ffb703', strokeWidth: 2 },
            ],
            legend: ['Humidité (%)', 'Température (°C)'],
          }}
          width={screenWidth - 30}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#1b4332',
            backgroundGradientTo: '#1b4332',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: () => '#fff',
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
          }}
          bezier
          style={styles.chart}
        />

        {/* 🌱 Message final */}
        <Text style={styles.footer}>
          Données simulées — mise à jour automatique toutes les 5 secondes.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1b4332',
  },
  scroll: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    color: '#fff',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '70%',
    backgroundColor: '#40916c',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontSize: 18,
    color: '#d8f3dc',
    marginBottom: 5,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  graphTitle: {
    color: '#d8f3dc',
    fontSize: 18,
    marginTop: 25,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  footer: {
    color: '#b7e4c7',
    fontSize: 14,
    marginTop: 20,
  },
});
