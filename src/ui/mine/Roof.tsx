import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from '@/i18n';
import { getArt } from '../art';
import { GameText } from '../GameText';
import { colors } from '../theme';

/** Tejado de la Casa-Museo con el cartel. Arte: museum/roof (el texto del cartel siempre es código). */
export function Roof() {
  const { t } = useTranslation();
  const art = getArt('museum/roof');
  return (
    <View style={styles.wrap}>
      {art ? (
        <Image source={art} resizeMode="cover" style={styles.art} />
      ) : (
        <>
          <View style={styles.chimney} />
          <View style={styles.roof}>
            {Array.from({ length: 9 }, (_, i) => (
              <View key={i} style={styles.tile} />
            ))}
          </View>
        </>
      )}
      <View style={styles.sign}>
        <GameText size={18} weight="black" color={colors.text} center>
          {t('mine.title')}
        </GameText>
        <GameText size={11} color={colors.muted} center>
          {t('worlds.eggValley.name')}
        </GameText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 120, justifyContent: 'flex-end', marginTop: 8 },
  art: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  chimney: {
    position: 'absolute',
    top: 4,
    right: '22%',
    width: 26,
    height: 40,
    backgroundColor: '#9C5B3B',
    borderWidth: 3,
    borderColor: colors.woodDark,
    borderRadius: 4,
  },
  roof: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 86,
    backgroundColor: '#C0623F',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderWidth: 4,
    borderColor: colors.woodDark,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tile: {
    width: 40,
    height: 22,
    marginHorizontal: -2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#D9774F',
    borderWidth: 2,
    borderColor: '#9C4A2E',
  },
  sign: {
    alignSelf: 'center',
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 4,
    backgroundColor: colors.parchment,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.woodDark,
    borderStyle: 'dashed',
  },
});
