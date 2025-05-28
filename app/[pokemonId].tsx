import PokemonStatsCard from "@/components/PokemonStatsCard";
import { getTypeColor } from "@/components/utils/getColor";
import { TypeIcon } from "@/components/utils/typeIcons";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pokemon, PokemonClient } from "pokenode-ts";
import { useEffect, useState } from "react";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

type TypeEffectiveness = {
  weaknesses: string[];
  strengths: string[];
};

export default function DetailsScreen() {
  const router = useRouter();
  const { width, height: screenHeight } = useWindowDimensions();
  const { pokemonId } = useLocalSearchParams<{ pokemonId: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [effectiveness, setEffectiveness] = useState<TypeEffectiveness>({ weaknesses: [], strengths: [] });

  useEffect(() => {
    const fetchDetails = async () => {
      const api = new PokemonClient();
      const data = await api.getPokemonById(Number(pokemonId));
      setPokemon(data);
      const pokemonSpecies = await api.getPokemonSpeciesById(Number(pokemonId));
      setDescription(pokemonSpecies.flavor_text_entries[0].flavor_text?.replace(/\n/g, ' '));
      setCategory(pokemonSpecies.genera.find((g: any) => g.language.name === 'en')?.genus || "");

      const types = data.types.map((t) => t.type.name);
      const typeDetails = await Promise.all(types.map((type) => api.getTypeByName(type)));

      const weaknessesSet = new Set<string>();
      const strengthsSet = new Set<string>();

      typeDetails.forEach((type) => {
        type.damage_relations.double_damage_from.forEach((t) => weaknessesSet.add(t.name));
        type.damage_relations.double_damage_to.forEach((t) => strengthsSet.add(t.name));
      });
      setEffectiveness({
        weaknesses: Array.from(weaknessesSet),
        strengths: Array.from(strengthsSet),
      });
    };

    fetchDetails();
  }, []);

  const formatName = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

  if (!pokemon) return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ContentLoader
        backgroundColor="#1f1f1f"
        foregroundColor="#9ca3af"
        viewBox={`0 0 ${width} ${screenHeight}`}
      >
        <Circle cx={width / 2} cy={100} r={96} />
        <Rect x="0" y={250} rx="5" ry="5" width={width} height={125} />
        <Rect x="0" y={380} rx="5" ry="5" width={width} height={125} />
        <Rect x="0" y={500} rx="5" ry="5" width={width} height={125} />
      </ContentLoader>
    </SafeAreaView>

  )

  const height = pokemon.height / 10;
  const weight = pokemon.weight / 10;
  const types = pokemon.types.map((t: any) => t.type.name);
  const genderIcons = ['♂️', '♀️'];
  // const description = '“When it is angered, it immediately discharges the energy stored in the pouches in its cheeks”';

  return (

    <SafeAreaView style={styles.container}>
      <ScrollView >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>

            {formatName(pokemon.name)} #{String(pokemon.id).padStart(3, '0')}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: pokemon.sprites.other?.['official-artwork'].front_default || '' }}
            style={styles.image}
          />
          <Button title="Play Sound" color="#3b99f5"  />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.row}>
            <View style={styles.attribute}>
              <Text style={styles.label}>Altura</Text>
              <Text style={styles.value}>{height >= 1 ? `${height.toFixed(1)} m` : `${height * 100} cm`}</Text>
            </View>
            <View style={styles.attribute}>
              <Text style={styles.label}>Peso</Text>
              <Text style={styles.value}>{weight} kg</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.attribute}>
              <Text style={styles.label}>Categoria</Text>
              <Text style={styles.value}>{formatName(category)}</Text>
            </View>
            <View style={styles.attribute}>
              <Text style={styles.label}>Gênero</Text>
              <Text style={styles.value}>{genderIcons.join('  ')}</Text>
            </View>
          </View>

          <View style={styles.badges}>
            <Text style={styles.label}>Tipo</Text>
            {types.map((type: string) => (
              <View key={type} style={[styles.badge, { backgroundColor: getTypeColor(type) }]}>
                <TypeIcon type={type} />
                <Text style={styles.badgeText}>{formatName(type)}</Text>
              </View>
            ))}
          </View>


        </View>
        <View style={styles.infoCard}>
          <PokemonStatsCard
            type={pokemon.types[0].type.name}
            stats={pokemon.stats.map((s) => ({
              name: s.stat.name,
              value: s.base_stat,
            }))}
          />
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Counter</Text>
          <View style={styles.badges}>
            <Text style={styles.label}>Fraqueza</Text>
            {effectiveness.weaknesses.map((type) => (
              <View key={type} style={[styles.badge, { backgroundColor: getTypeColor(type) }]}>
                <TypeIcon type={type} />
                <Text style={styles.badgeText}>{formatName(type)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.badges}>
            <Text style={styles.label}>Vantagem</Text>
            {effectiveness.strengths.map((type) => (
              <View key={type} style={[styles.badge, { backgroundColor: getTypeColor(type) }]}>
                <TypeIcon type={type} />
                <Text style={styles.badgeText}>{formatName(type)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 180,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: "left"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#aaa',
    fontWeight: 'bold',
    marginRight: 6
  },
  value: {
    color: '#fff',
  },
  attribute: {
    flexDirection: 'row',
    marginBottom: 3
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});