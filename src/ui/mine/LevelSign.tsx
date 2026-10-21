import { Pressable, StyleSheet, View } from 'react-native';
import { formatNumber } from '@/game/format';
import type { StationId } from '@/game/types';
import { upgradeQuote } from '@/game/upgrades';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { GameIcon } from '../GameIcon';
import { GameText } from '../GameText';
import { colors } from '../theme';

/**
 * Letrero de madera clavado en el montón de tierra: nivel del sótano y producción.
 * Se pone verde, con la flecha, cuando alcanza para mejorar. Abre el panel de mejora.
 */
export function LevelSign({ station, level, rate, onPress }: { station: StationId; level: number; rate: number; onPress: () => void }) {
  const { t } = useTranslation();
  const affordable = useGameStore((s) => {
    const quote = upgradeQuote(s.game, station, 1, Date.now());
    return quote.levels > 0 && quote.cost <= s.game.coins;
  });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`upgrade-${station}`}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={styles.wrap}
    >
      <View style={[styles.board, affordable ? styles.ready : styles.idle]}>
        <View style={styles.stitch} />
        <View style={styles.row}>
          {affordable ? <GameIcon name="upgrade" size={16} /> : null}
          <GameText size={11} color={colors.textLight} weight="black" outline>
            {t('common.lvlShort')}
          </GameText>
          <GameText size={16} color={colors.textLight} weight="black" outline>
            {formatNumber(level)}
          </GameText>
        </View>
        <GameText size={10} color={colors.textLight} weight="black" outline center>
          {formatNumber(rate)}/s
        </GameText>
      </View>
      <View style={styles.post} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  board: { minWidth: 64, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 2 },
  stitch: { position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, borderRadius: 6, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(255, 240, 210, 0.6)' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  ready: { backgroundColor: colors.green, borderColor: colors.greenDark },
  idle: { backgroundColor: colors.wood, borderColor: colors.woodDark },
  // Palo que lo clava en la tierra.
  post: { width: 6, height: 12, marginTop: -1, backgroundColor: colors.woodDark, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
});
