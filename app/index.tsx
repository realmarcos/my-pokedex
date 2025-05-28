import { Fragment, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { PokemonClient } from 'pokenode-ts';
import { Link } from 'expo-router';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useNetworkState } from 'expo-network';
const banner = require("../assets/images/banner.jpeg");
import AsyncStorage from '@react-native-async-storage/async-storage';
// import pokemonLogo from "../assets/images/Pokemon-Logo-PNG.png";

type PokemonDetails = {
  id: number;
  name: string;
  imageUrl: string;
  types?: string[];
};

const STORAGE_KEY = '@pokemons';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { isConnected } = useNetworkState();
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const api = new PokemonClient();
  const cardWidth = (width - 45) / 3; // Espaçamento entre os cards
  const cardHeight = 154;
  const gap = 5;


  useEffect(() => {

    if (!isConnected) {
      return;
    } else if (pokemonList.length === 0) {
      // fetchPokemons();
      loadStoredPokemons();
    }
  }, [isConnected]);

  const fetchPokemons = async () => {
    try {
      const data = await api.listPokemonSpecies(0, 1333);
      const results = data.results.map((pokemon, index) => {
        return {
          id: index + 1,
          name: capitalize(pokemon.name),
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
        };
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(results));
      setPokemonList(results);
      console.log('Pokémons carregados da api!');
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

    const loadStoredPokemons = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setPokemonList(JSON.parse(stored));
        setLoading(false);
        console.log('Pokémons carregados do AsyncStorage!');
      } else {
        await fetchPokemons();
      }
    } catch (error) {
      console.error('Erro ao carregar Pokémons:', error);
    }
  };

  const formatPokemonNunber = (value: number) => {
    return value.toString().padStart(3, '0');
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <Text style={styles.logo}>Pokedex</Text>
        <TouchableOpacity accessible accessibilityLabel="Notificações" style={styles.bellButton}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroContainer}>
          <Image
            source={banner}
            style={styles.heroImage}
            accessibilityLabel="Imagem de grupo de Pokémons com fundo de arco-íris e céu azul"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>
              Descubra um novo{'\n'}mundo com a Pokedex
            </Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="🔍"
                placeholderTextColor="#9ca3af"
                // value={searchText}
                // onChangeText={setSearchText}
                accessibilityLabel="Buscar pokémon"
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.searchButton} onPress={() => { }}>
                <Text style={styles.searchButtonText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Todos os pokémons</Text>
        {loading ? (
          <ContentLoader
            backgroundColor="#1f1f1f"
            foregroundColor="#9ca3af"
          >
            <View style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>

              {Array.from({ length: 3 }).map((_, rowIndex) =>
                Array.from({ length: 3 }).map((_, colIndex) => {
                  const x = colIndex * (cardWidth + gap);
                  const y = rowIndex * (cardHeight + gap);
                  return (
                    <Rect
                      key={`${rowIndex}-${colIndex}`}
                      x={x}
                      y={y}
                      rx={10}
                      ry={10}
                      width={cardWidth}
                      height={cardHeight}
                    />
                  );
                })
              )}
            </View>

          </ContentLoader>
        ) : (
          <View style={styles.pokemonContainer}>
            {(isConnected && pokemonList.length === 0) ? (
              <Text style={styles.errorText}>Sem conexão com a internet</Text>
            ) : (
              <Fragment>
                {pokemonList.map((item) => (
                  <Link style={styles.pokemonCard} href={{ pathname: "/[pokemonId]", params: { pokemonId: item.id } }} key={item.id} >
                    <View key={item.id} accessible accessibilityLabel={`${item.name}`}>
                      <View style={styles.pokemonCardHeader}>
                        <Text style={styles.pokemonNumber}>#{formatPokemonNunber(item.id || 0)}</Text>
                        <Text style={styles.pokemonName}>{item.name}</Text>
                      </View>
                      <View style={styles.pokemonCardContent}>
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={styles.pokemonImage}
                          accessibilityLabel={item.name}
                        />

                      </View>
                    </View>
                  </Link>

                ))}
              </Fragment>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    backgroundColor: '#000',
    borderBottomColor: '#111',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 24,
    fontFamily: 'monospace',
  },
  bellButton: {
    padding: 8,
  },
  bellIcon: {
    color: '#fff',
    fontSize: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 12,
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#000',
    borderColor: '#4b9ce2',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#3b99f5',
    borderRadius: 6,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pokemonContainer: {
    paddingBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#000'
  },
  pokemonCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    padding: 8,
    width: '30%',
    margin: 4,
  },
  pokemonNumber: {
    color: '#9ca3af',
    fontWeight: '700',
    fontSize: 12,
  },
  pokemonName: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  pokemonCardHeader: {
    alignItems: 'flex-start',
  },
  pokemonCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pokemonImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
