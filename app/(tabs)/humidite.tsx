// humidite.tsx

import React, { JSX, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';



const { width: SCREEN_W } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_W - 48;

type DataPoint = { time: string; value: number };

export default function HumiditeScreen(): JSX.Element {
  const [data, setData] = useState<DataPoint[]>(() => generateInitialData());
  const [current, setCurrent] = useState<number>(Math.round(average(data)));

  useEffect(() => {
    const t = setInterval(() => {
      const next = nextValue(data[data.length - 1]?.value ?? 50);
      const now = new Date();
      const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const nextPoint = { time, value: next };
      setData(prev => [...prev.slice(-23), nextPoint]);
      setCurrent(next);
    }, 5000);
    return () => clearInterval(t);
  }, [data]);

  const min = Math.min(...data.map(d => d.value));
  const max = Math.max(...data.map(d => d.value));
  const avg = Math.round(data.reduce((s, d) => s + d.value, 0) / data.length) || 0;


  const MAX_LABELS = 6;

const limitedLabels = data
  .map(d => d.time)
  .filter((_, i) => i % Math.ceil(data.length / MAX_LABELS) === 0);

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView 
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        >
      <View style={styles.header}> 
        <View style={styles.logoBox}><Text style={styles.logoIcon}>💧</Text></View>
        <Text style={styles.title}>Humidité du sol</Text>
        <Text style={styles.subtitle}>Données en temps réels</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>📍 Zone A - Secteur 1</Text>
          <Text style={styles.infoText}>🔋 Batterie: 87%</Text>
        </View>
        <View style={[styles.infoRow, { marginTop: 10 }]}> 
          <Text style={styles.infoText}>🕒 MAJ: 20:20</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>Optimal</Text></View>
        </View>
      </View>

      <View style={styles.gaugeContainer}>
        <CircularGauge size={260} strokeWidth={20} value={current} />
      </View>

      <Text style={styles.sectionTitle}>Taux d'humidité du sol</Text>
      <View style={styles.statBox}>
        <View style={styles.statItem}><Text style={styles.statLabel}>Minimum</Text><Text style={styles.statValue}>{min}%</Text></View>
        <View style={styles.statItem}><Text style={styles.statLabel}>Moyenne</Text><Text style={styles.statValue}>{avg}%</Text></View>
        <View style={styles.statItem}><Text style={styles.statLabel}>Maximum</Text><Text style={styles.statValue}>{max}%</Text></View>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Dernières 24 heures</Text>
      <View style={styles.chartCard}>
        <LineChart
            data={{
    labels: limitedLabels,
    datasets: [{ data: data.map(d => d.value) }],
  }}
          width={CHART_WIDTH}
          height={220}
          yAxisSuffix="%"
          withDots
          withShadow={false}
          withInnerLines
          chartConfig={{
            backgroundGradientFrom: '#2f5f4a',
            backgroundGradientTo: '#244b39',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(129, 216, 233, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255,255,255, ${opacity * 0.7})`,
            propsForDots: { r: '4' },
          }}
          
          style={{ borderRadius: 12 }}
        />
        <View style={styles.legendRow}>
          <View style={styles.legendItem}><View style={styles.legendSwatch} /><Text style={styles.legendText}>Humidité mesurée</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendSwatch, { backgroundColor: '#9bd7b9' }]} /><Text style={styles.legendText}>Niveau optimal (50%)</Text></View>
        </View>
      </View>

      <Text style={styles.footer}>Capteur: SM-2401 | Profondeur: 15cm</Text>
    </ScrollView>
    </SafeAreaView>
  );
}
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
function CircularGauge({ size, strokeWidth, value }: { size: number; strokeWidth: number; value: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
//   const AnimatedCircle = Animated.createAnimatedComponent(Circle as any);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(value / 100, { duration: 700 });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: circumference * (1 - progress.value) }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation='-90' origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={`rgba(255,255,255,0.12)`} strokeWidth={strokeWidth} fill='none' />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`rgb(128,219,245)`}
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            strokeDasharray={`${circumference} ${circumference}`}
            animatedProps={animatedProps}
            fill='none'
          />
        </G>
      </Svg>
      <View style={styles.gaugeLabel}><Text style={styles.gaugeValue}>{Math.round(value)}%</Text><Text style={styles.gaugeSmall}>actuel</Text></View>
    </View>
  );
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

function generateInitialData(): DataPoint[] {
  const now = new Date();
  const arr: DataPoint[] = [];
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const t = `${pad(d.getHours())}:00`;
    const v = 40 + Math.round(Math.sin(i / 3) * 8 + Math.random() * 8);
    arr.push({ time: t, value: clamp(v, 10, 95) });
  }
  return arr;
}

function nextValue(prev = 50) {
  const drift = (50 - prev) * 0.05;
  const noise = (Math.random() - 0.5) * 8;
  return clamp(Math.round(prev + drift + noise), 5, 95);
}

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

function average(arr: DataPoint[]) { if (!arr.length) return 0; return arr.reduce((s, d) => s + d.value, 0) / arr.length; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#234c3d', alignItems: 'center', paddingTop: 24 },
  header: { alignItems: 'center', marginBottom: 8 },
  logoBox: { width: 84, height: 84, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 36 },
  title: { color: '#eaf6ef', fontSize: 22, marginTop: 12, fontWeight: '600' },
  subtitle: { color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  infoCard: { width: SCREEN_W - 36, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 14, marginTop: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoText: { color: '#cfeee1' },
  badge: { backgroundColor: '#c9f4d9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
  badgeText: { color: '#0b2f18', fontWeight: '700' },
  gaugeContainer: { marginTop: 14, alignItems: 'center', justifyContent: 'center' },
  gaugeLabel: { position: 'absolute', alignItems: 'center' },
  gaugeValue: { color: '#fff', fontSize: 48, fontWeight: '700' },
  gaugeSmall: { color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  sectionTitle: { color: '#eaf6ef', fontWeight: '600', marginTop: 18 },
  statBox: { width: SCREEN_W - 36, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 8, flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  statItem: { alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.6)' },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 6 },
  chartCard: { width: SCREEN_W - 36, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 12, marginTop: 12 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendSwatch: { width: 16, height: 10, backgroundColor: 'rgb(129,216,233)', marginRight: 8, borderRadius: 2 },
  legendText: { color: 'rgba(255,255,255,0.8)' },
  footer: { color: 'rgba(255,255,255,0.5)', marginTop: 8, marginBottom: 18 },
   scroll: {
    alignItems: 'center',
    paddingVertical: 30,
  },
});
