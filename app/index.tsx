import { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface IPokemon {
    id: number;
    name: string;
    image: string;
}

export default function HomeScreen() {
    const [pokemons, setPokemons] = useState<IPokemon[]>([]);
    const [searchPokemon, setSearchPokemon] = useState('');
    const [allPokemons, setAllPokemons] = useState<IPokemon[]>([]);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50&offset=0', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                const formattedData: IPokemon[] = data.results.map((pokemon: any, index: number) => ({
                    id: index + 1,
                    name: pokemon.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
                }))
                setPokemons(formattedData);
                setAllPokemons(formattedData);
            } catch (error) {
                console.error("Erro ao consultar api.", error);
            }
        }

        fetchPokemon();
    }, []);

    const handleChangeInputSearch = (value: string) => {
        setSearchPokemon(value);
        if (value === '') setPokemons(allPokemons);
    }

    const filter = () => {
        const filteredPokemons = allPokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(searchPokemon.toLowerCase()));
        setPokemons(filteredPokemons);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pokédex</Text>
                <Text style={styles.subtitle}>
                    Procure o Pokémon pelo nome.
                </Text>
                <View style={styles.searchContainer}>
                    <TextInput style={styles.input} placeholder="Nome" onChange={(event) => handleChangeInputSearch(event.nativeEvent.text)} />
                    <TouchableOpacity style={styles.button} onPress={() => filter()}>
                        <Text style={styles.buttonText}>Filtrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.grid}>
                {pokemons.map((pokemon) => (
                    <View style={styles.card} key={pokemon.id}>
                        <Image
                            source={{ uri: pokemon.image }}
                            style={styles.image}
                        />
                        <Text style={styles.pokemonName}>{pokemon.name}</Text>
                        <Text style={styles.pokemonNumber}>{pokemon.id}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D9D7D7',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        marginTop: 25,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: '#65BFA6',
        borderRadius: 8
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        width: '100%',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 14,
        color: '#4B5563',
        marginTop: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    input: {
        flex: 1,
        padding: 8,
        borderColor: '#65BFA6',
        borderWidth: 1,
        borderRadius: 8,
        marginRight: 8,
        backgroundColor: "#F3F4F6"
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        marginHorizontal: 8,
    },
    image: {
        width: 100,
        height: 100,
    },
    pokemonName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 8,
    },
    pokemonNumber: {
        fontSize: 14,
        color: '#4B5563',
    },
});
