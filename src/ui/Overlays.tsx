import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { useTranslation } from '@/i18n';
import { useUiStore } from '@/store/uiStore';
import { GameText } from './GameText';
import { colors } from './theme';

export function Toasts() {
  const toasts = useUiStore((s) => s.toasts);
  return (
    <View pointerEvents="none" style={styles.toasts}>
      {toasts.map((toast) => (
        <Animated.View key={toast.id} entering={FadeInUp} exiting={FadeOut} style={styles.toast}>
          {toast.icon ? <GameText size={18}>{toast.icon}</GameText> : null}
          <GameText size={15} color={colors.textLight} weight="black" outline>
            {toast.text}
          </GameText>
        </Animated.View>
      ))}
    </View>
  );
}

/** Pantalla negra de "anuncio" para el modo simulado (web, Expo Go). */
export function FakeAdOverlay() {
  const { t } = useTranslation();
  const playing = useUiStore((s) => s.fakeAdPlaying);
  if (!playing) return null;
  return (
    <View style={styles.ad}>
      <GameText size={48}>📺</GameText>
      <GameText size={22} color={colors.textLight} weight="black" center>
        {t('ad.playing')}
      </GameText>
      <GameText size={14} color="#bbb" center>
        {t('ad.hint')}
      </GameText>
    </View>
  );
}

const styles = StyleSheet.create({
  toasts: { position: 'absolute', top: 70, left: 0, right: 0, alignItems: 'center', gap: 6 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(30,20,10,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  ad: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
});
