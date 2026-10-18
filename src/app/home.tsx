import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Constants from 'expo-constants';
import { useTranslation } from '@/i18n';
import { ChunkyButton } from '@/ui/ChunkyButton';
import { getArt } from '@/ui/art';
import { GameModal } from '@/ui/GameModal';
import { GameText } from '@/ui/GameText';
import { Logo } from '@/ui/Logo';
import { Screen } from '@/ui/Screen';
import { colors } from '@/ui/theme';

/** Pantalla de inicio / login. */
export default function Home() {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const [modal, setModal] = useState<'news' | 'login' | null>(null);
  const play = () => router.push('/mine');

  const shortcuts = [
    { key: 'settings', icon: '⚙️', art: getArt('ui/icon-settings'), onPress: () => router.push('/settings') },
    { key: 'goals', icon: '🏆', art: getArt('ui/icon-goals'), onPress: () => router.push('/goals') },
    { key: 'shop', icon: '🏪', art: getArt('ui/icon-shop'), onPress: () => router.push('/shop') },
    { key: 'news', icon: '✉️', art: getArt('ui/icon-news'), onPress: () => setModal('news') },
  ] as const;
  const hero = getArt('home/hero') ?? getArt('loading/mascot');

  return (
    <Screen background="sky" backgroundImage={getArt('home/background') ?? getArt('loading/background')}>
      <View style={styles.container}>
        {/* En pantallas bajas (iPhone SE) el logo encoge para dejar sitio al grupo de dinos. */}
        <Logo small={height < 740} />
        <GameText size={20} weight="black" color={colors.textLight} outline center>
          {t('home.subtitle')}
        </GameText>
        {hero ? (
          <Image source={hero} resizeMode="contain" style={styles.heroImage} />
        ) : (
          <View style={styles.hero}>
            <GameText size={70} style={styles.heroSide}>
              🦕
            </GameText>
            <GameText size={110} style={{ lineHeight: 130 }}>
              🦖
            </GameText>
            <GameText size={60} style={styles.heroSide}>
              🥚
            </GameText>
          </View>
        )}
        <View style={styles.buttons}>
          <ChunkyButton testID="play" size="lg" label={t('home.play')} onPress={play} />
          <ChunkyButton variant="blue" label={`G  ${t('home.google')}`} onPress={() => setModal('login')} />
          <ChunkyButton variant="wood" label={t('home.guest')} onPress={play} />
        </View>
        <View style={styles.shortcuts}>
          {shortcuts.map((s) => (
            <Pressable key={s.key} accessibilityRole="button" style={styles.shortcut} onPress={s.onPress}>
              {s.art ? (
                <Image source={s.art} resizeMode="contain" style={styles.shortcutIcon} />
              ) : (
                <GameText size={26} style={{ lineHeight: 32 }}>
                  {s.icon}
                </GameText>
              )}
              <GameText size={12} color={colors.textLight} weight="black" outline>
                {t(`home.${s.key}`)}
              </GameText>
            </Pressable>
          ))}
        </View>
        <GameText size={12} color={colors.textLight} outline center>
          v{Constants.expoConfig?.version ?? '1.0.0'}
        </GameText>
      </View>
      <GameModal visible={modal !== null} title={modal === 'news' ? t('home.newsTitle') : t('home.google')} onClose={() => setModal(null)}>
        <GameText center>{modal === 'news' ? t('home.newsBody') : t('home.loginSoon')}</GameText>
        <ChunkyButton label={t('common.continue')} onPress={() => setModal(null)} />
      </GameModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', gap: 8 },
  hero: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  heroSide: { lineHeight: 90 },
  // flex: se encoge en pantallas bajas (iPhone SE) para que quepan botones y accesos.
  heroImage: { flex: 1, width: '100%', maxWidth: 360, minHeight: 130, maxHeight: 240, alignSelf: 'center' },
  shortcutIcon: { width: 34, height: 34 },
  buttons: { gap: 12, paddingHorizontal: 24 },
  shortcuts: { flexDirection: 'row', justifyContent: 'space-around' },
  shortcut: {
    alignItems: 'center',
    width: 70,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: colors.blueDark,
  },
});
