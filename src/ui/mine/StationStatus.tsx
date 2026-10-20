import { StyleSheet, View } from 'react-native';
import { useTranslation } from '@/i18n';
import { GameText } from '../GameText';
import { IconLabel } from '../IconLabel';
import { ProgressBar } from '../ProgressBar';
import { colors } from '../theme';

/** Pie de cada planta: "¡Toca!" si espera al jugador, o la barra del ciclo en curso. */
export function StationStatus({ idle, progress, color }: { idle: boolean; progress: number; color: string }) {
  const { t } = useTranslation();
  if (idle) {
    return (
      <View style={styles.tapHint}>
        <IconLabel icon="tap" size={15}>
          <GameText size={13} color={colors.text} weight="black">
            {t('mine.tap')}
          </GameText>
        </IconLabel>
      </View>
    );
  }
  return <ProgressBar value={progress} height={8} color={color} />;
}

const styles = StyleSheet.create({
  tapHint: { alignSelf: 'center', backgroundColor: colors.gold, borderRadius: 10, paddingHorizontal: 8, borderWidth: 2, borderColor: colors.goldDark },
});
