import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

// 🔆 Jauge circulaire pour la luminosité
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CircularGauge({
  size,
  strokeWidth,
  value,
  maxValue,
  color,
}: {
  size: number;
  strokeWidth: number;
  value: number;
  maxValue: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(value);

  useEffect(() => {
    progress.value = withTiming(value, { duration: 800 });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progress.value / maxValue) * circumference,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            stroke="#2d6a4f"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            opacity={0.25}
          />
          <AnimatedCircle
            animatedProps={animatedProps}
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <Text style={styles.gaugeValue}>{Math.round(value)} lux</Text>
    </View>
  );
}

export default function LumiereScreen() {
  const [lightData, setLightData] = useState<number[]>([300, 320, 340, 360, 400, 420, 440]);
  const [currentLight, setCurrentLight] = useState<number>(440);

  // ⚙️ Simulation de nouvelles mesures
  useEffect(() => {
    const interval = setInterval(() => {
      const newLight = Math.floor(300 + Math.random() * 300);
      setLightData(prev => [...prev.slice(1), newLight]);
      setCurrentLight(newLight);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Luminosité ☀️</Text>

        {/* 🔆 Jauge circulaire */}
        <View style={styles.gaugeContainer}>
          <CircularGauge
            size={180}
            strokeWidth={15}
            value={currentLight}
            maxValue={600}
            color="#f9c74f"
          />
          <Text style={styles.gaugeLabel}>Intensité lumineuse</Text>
        </View>

        {/* 📊 Graphique */}
        <Text style={styles.graphTitle}>Évolution de la luminosité</Text>
        <LineChart
          data={{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                data: lightData,
                color: () => '#f9c74f',
                strokeWidth: 2,
              },
            ],
            legend: ['Lumière (lux)'],
          }}
          width={screenWidth - 30}
          height={220}
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  gaugeValue: {
    position: 'absolute',
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  gaugeLabel: {
    marginTop: 10,
    color: '#d8f3dc',
    fontSize: 16,
  },
  graphTitle: {
    color: '#d8f3dc',
    fontSize: 18,
    marginTop: 30,
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
