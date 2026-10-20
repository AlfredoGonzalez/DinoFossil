import { Pressable, StyleSheet, View } from 'react-native';
import { abilityStatus } from '@/game/managers';
import type { StationId } from '@/game/types';
import { formatDuration } from '@/game/format';
import { useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { GameText } from '../GameText';
import { IconLabel } from '../IconLabel';
import { useNow } from '../hooks';
import { DinoAvatar } from '../Icons';
import { colors } from '../theme';

interface Props {
  station: StationId;
  onPick: () => void;
}

/** Avatar del manager (o hueco vacío) + botón de habilidad Turbo. */
export function ManagerSlot({ station, onPick }: Props) {
  const { t } = useTranslation();
  const now = useNow(500);
  const dinoId = useGameStore((s) => s.game.managers[station]);
  // Selecciona solo datos estables: un selector que crea objetos nuevos provoca renders infinitos.
  const ability = useGameStore((s) => s.game.abilities[station]);
  const status = abilityStatus({ managers: { [station]: dinoId }, abilities: { [station]: ability } }, station, now);

  return (
    <View style={styles.wrap}>
      <Pressable accessibilityRole="button" accessibilityLabel={`manager-${station}`} onPress={onPick}>
        {dinoId ? (
          <DinoAvatar dinoId={dinoId} size={46} ring />
        ) : (
          <View style={styles.empty}>
            <GameText size={20} weight="black" color={colors.textLight} outline>
              +
            </GameText>
            <GameText size={8} color={colors.textLight} weight="black" outline>
              {t('mine.hire').toUpperCase()}
            </GameText>
          </View>
        )}
      </Pressable>
      {status.kind !== 'none' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`turbo-${station}`}
          disabled={status.kind !== 'ready'}
          onPress={() => {
            tapFeedback(true);
            useGameStore.getState().activateAbility(station);
          }}
          style={[
            styles.turbo,
            status.kind === 'ready' && styles.turboReady,
            status.kind === 'active' && styles.turboActive,
          ]}
        >
          <IconLabel icon={status.kind === 'cooldown' ? 'timer' : 'turbo'} size={12}>
            {status.kind === 'ready' ? null : (
              <GameText size={10} color={colors.textLight} weight="black" outline>
                {formatDuration(status.seconds)}
              </GameText>
            )}
          </IconLabel>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 2, width: 54 },
  empty: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turbo: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8, backgroundColor: colors.greyDark },
  turboReady: { backgroundColor: colors.purple },
  turboActive: { backgroundColor: colors.orange },
});
