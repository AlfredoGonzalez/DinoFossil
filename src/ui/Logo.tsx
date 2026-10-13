import { Image, StyleSheet, View } from 'react-native';
import { getArt } from './art';
import { GameText } from './GameText';
import { colors, radius } from './theme';

/** Logo ilustrado (assets/art/loading/logo.png) o, si aún no existe, el tipográfico. */
export function Logo({ small }: { small?: boolean }) {
  const scale = small ? 0.7 : 1;
  const art = getArt('loading/logo');
  if (art) {
    // Caja 16:10 como el lienzo pedido (1200×750); "contain" respeta otras proporciones.
    return <Image source={art} resizeMode="contain" style={[styles.image, { width: 300 * scale, height: 188 * scale }]} />;
  }
  return (
    <View style={styles.wrap}>
      <GameText size={58 * scale} weight="black" color={colors.green} style={styles.word} center>
        DINO
      </GameText>
      <GameText size={50 * scale} weight="black" color={colors.gold} style={[styles.word, { marginTop: -16 * scale }]} center>
        FOSSIL
      </GameText>
      <View style={styles.plate}>
        <GameText size={24 * scale} weight="black" color={colors.text} center>
          TYCOON
        </GameText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginTop: 8 },
  image: { alignSelf: 'center', marginTop: 8 },
  word: {
    textShadowColor: colors.woodDark,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 1,
    letterSpacing: 2,
  },
  plate: {
    marginTop: -6,
    paddingHorizontal: 18,
    paddingVertical: 2,
    backgroundColor: colors.parchment,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: colors.woodDark,
  },
});
