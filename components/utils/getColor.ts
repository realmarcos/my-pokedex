export const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    fairy: '#EE99AC',
    poison: '#A040A0',
    normal: '#A8A878',
    psychic: '#F85888',
    bug: '#A8B820',
    dark: '#705848',
    ghost: '#705898',
    steel: '#B8B8D0',
    dragon: '#7038F8',
    ground: '#E0C068',
    rock: '#B8A038',
    flying: '#A890F0',
    fighting: '#C03028',
    ice: '#98D8D8',
  };
  return colors[type] || '#666';
};