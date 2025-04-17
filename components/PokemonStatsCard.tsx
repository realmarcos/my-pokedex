import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTypeColor } from './utils/getColor';

interface Stat {
  name: string;
  value: number;
}

interface Props {
  stats: Stat[];
  type: string;
}

const MAX_STAT = 180; // Valor máximo aproximado para base stat

const PokemonStatsCard = ({ stats, type }: Props) => {
  const getLabel = (statName: string) => {
    switch (statName) {
      case 'hp': return 'HP';
      case 'attack': return 'ATK';
      case 'defense': return 'DEF';
      case 'special-attack': return 'STAK';
      case 'special-defense': return 'SDEF';
      case 'speed': return 'SPD';
      default: return statName.toUpperCase();
    }
  };

  return (
    <View>
      <Text style={styles.title}>Status</Text>
      {stats.map((stat) => {
        const percentage = Math.min((stat.value / MAX_STAT) * 100, 100);
        return (
          <View key={stat.name} style={styles.statRow}>
            <Text style={styles.statLabel}>{getLabel(stat.name)}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${percentage}%`, backgroundColor: getTypeColor(type) }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default PokemonStatsCard;

const styles = StyleSheet.create({

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statRow: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    width: 35
  },
  progressBar: {
    backgroundColor: '#3a3a3c',
    height: 10,
    borderRadius: 4,
    width: "90%",
  },
  progress: {
    height: 8,
    borderRadius: 4,
  },
});
