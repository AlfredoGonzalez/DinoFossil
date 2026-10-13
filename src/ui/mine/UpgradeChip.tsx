import { Pressable, StyleSheet } from 'react-native';
import type { StationId } from '@/game/types';
import { formatNumber } from '@/game/format';
import { upgradeQuote } from '@/game/upgrades';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { GameText } from '../GameText';
import { colors } from '../theme';

/** Botón pequeño con el nivel y la flecha de mejora; abre el panel de mejora. */
export function UpgradeChip({ station, level, onPress }: { station: StationId; level: number; onPress: () => void }) {
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
      style={[styles.chip, affordable ? styles.ready : styles.idle]}
    >
      <GameText size={11} color={colors.textLight} weight="black" outline>
        {affordable ? '⬆' : ''} {t('common.lvlShort')}
      </GameText>
      <GameText size={18} color={colors.textLight} weight="black" outline>
        {formatNumber(level)}
      </GameText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { alignItems: 'center', minWidth: 54, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12, borderWidth: 2 },
  ready: { backgroundColor: colors.green, borderColor: colors.greenDark },
  idle: { backgroundColor: colors.wood, borderColor: colors.woodDark },
});
