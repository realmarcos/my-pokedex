import { MaterialCommunityIcons } from '@expo/vector-icons';

export const getTypeIconName = (type: string): string => {
  const icons: Record<string, string> = {
    normal: 'circle-outline',
    fire: 'fire',
    water: 'water',
    electric: 'flash',
    grass: 'leaf',
    ice: 'snowflake',
    fighting: 'sword-cross',
    poison: 'biohazard',
    ground: 'earth',
    flying: 'weather-windy',
    psychic: 'eye',
    bug: 'ladybug',
    rock: 'diamond-stone',
    ghost: 'ghost',
    dark: 'weather-night',
    dragon: 'dragon',
    steel: 'shield-half-full',
    fairy: 'magic-staff',
  };

  return icons[type] || 'help-circle-outline';
};

export const TypeIcon = ({ type, size = 16, color = '#fff' }: { type: string; size?: number; color?: string }) => {
  const iconName = getTypeIconName(type);
  return (
    <MaterialCommunityIcons
      name={iconName as any}
      size={size}
      color={color}
      style={{ marginRight: 4 }}
    />
  );
};
