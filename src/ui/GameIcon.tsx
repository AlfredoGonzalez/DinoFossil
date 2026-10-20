import { Image, type StyleProp, type ImageStyle } from 'react-native';
import { getArt } from './art';
import { GameText } from './GameText';
import { ICONS, type IconName } from './iconNames';

interface Props {
  name: IconName;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

/** Icono con arte final (assets/art/icons/<name>) o, si aún no existe, su emoji. */
export function GameIcon({ name, size = 22, style }: Props) {
  const art = getArt(`icons/${name}`);
  if (art) return <Image source={art} resizeMode="contain" style={[{ width: size, height: size }, style]} />;
  return (
    <GameText size={size * 0.85} style={{ lineHeight: size * 1.1 }}>
      {ICONS[name]}
    </GameText>
  );
}
