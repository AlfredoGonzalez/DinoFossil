import { StyleSheet, View } from 'react-native';
import { formatNumber } from '@/game/format';
import { prestigePreview } from '@/game/prestige';
import { useTranslation } from '@/i18n';
import { playSfx } from '@/services/audio';
import { successFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { ChunkyButton } from '../ChunkyButton';
import { GameModal } from '../GameModal';
import { GameText } from '../GameText';
import { ResourceIcon } from '../Icons';
import { ProgressBar } from '../ProgressBar';
import { colors, radius } from '../theme';

export function PrestigeModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const game = useGameStore((s) => s.game);
  if (!visible) return null;
  const preview = prestigePreview(game);
  const pct = (m: number) => `×${m.toFixed(1)}`;

  return (
    <GameModal visible title={t('prestige.title')} onClose={onClose} testID="prestige-modal">
      <GameText center>{t('prestige.body')}</GameText>
      <GameText size={13} color={colors.muted} center>
        {t('prestige.keep')}
      </GameText>
      <View style={styles.box}>
        <GameText>{t('prestige.gain')}</GameText>
        <View style={styles.row}>
          <ResourceIcon kind="huellas" size={26} />
          <GameText size={26} weight="black">
            +{preview.gain}
          </GameText>
        </View>
      </View>
      <View style={styles.box}>
        <GameText>{t('prestige.multiplier')}</GameText>
        <GameText weight="black">
          {pct(preview.currentMultiplier)} →{' '}
          <GameText weight="black" color={colors.greenDark}>
            {pct(preview.nextMultiplier)}
          </GameText>
        </GameText>
      </View>
      <ProgressBar value={game.runEarnings / preview.nextAt} color={colors.purple} />
      <GameText size={12} color={colors.muted} center>
        {preview.gain > 0
          ? t('prestige.nextAt', { value: formatNumber(preview.nextAt) })
          : t('prestige.notYet', { value: formatNumber(preview.nextAt) })}
      </GameText>
      <ChunkyButton
        testID="confirm-prestige"
        variant="purple"
        label={`🐾 ${t('prestige.confirm')}`}
        disabled={preview.gain < 1}
        onPress={() => {
          if (useGameStore.getState().prestige()) {
            playSfx('prestige');
            successFeedback();
            onClose();
          }
        }}
      />
    </GameModal>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.parchmentDark,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
