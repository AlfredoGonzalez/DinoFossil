import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import type { Settings } from '@/game/types';
import { useTranslation } from '@/i18n';
import { adsAreSimulated, showPrivacyOptions } from '@/services/ads';
import { useGameStore } from '@/store/gameStore';
import { useUiStore } from '@/store/uiStore';
import { ChunkyButton } from '@/ui/ChunkyButton';
import { GameModal } from '@/ui/GameModal';
import { GameText } from '@/ui/GameText';
import { Banner, Panel } from '@/ui/Panel';
import { Screen } from '@/ui/Screen';
import { colors } from '@/ui/theme';

const TOGGLES: (keyof Pick<Settings, 'sound' | 'music' | 'haptics'>)[] = ['sound', 'music', 'haptics'];
const LANGUAGES: { value: Settings['language']; label: string }[] = [
  { value: null, label: 'settings.auto' },
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const settings = useGameStore((s) => s.game.settings);
  const update = useGameStore((s) => s.updateSettings);
  const [confirmReset, setConfirmReset] = useState(false);
  const [loginInfo, setLoginInfo] = useState(false);
  // Modo prueba oculto: 7 toques seguidos a la versión.
  const [versionTaps, setVersionTaps] = useState(0);

  return (
    <Screen background="sky">
      <ScrollView contentContainerStyle={styles.content}>
        <Banner text={t('settings.title')} color={colors.blue} />
        <Panel>
          {TOGGLES.map((key) => (
            <View key={key} style={styles.row}>
              <GameText weight="black">{t(`settings.${key}`)}</GameText>
              <Switch value={settings[key]} onValueChange={(v) => update({ [key]: v })} trackColor={{ true: colors.green }} />
            </View>
          ))}
        </Panel>
        <Panel title={t('settings.language')}>
          <View style={styles.langs}>
            {LANGUAGES.map((lang) => (
              <ChunkyButton
                key={lang.label}
                size="sm"
                style={styles.flex}
                variant={settings.language === lang.value ? 'orange' : 'wood'}
                label={lang.value ? lang.label : t('settings.auto')}
                onPress={() => update({ language: lang.value })}
              />
            ))}
          </View>
        </Panel>
        <Panel title={t('settings.account')}>
          <ChunkyButton variant="blue" label={t('settings.login')} onPress={() => setLoginInfo(true)} />
        </Panel>
        <Panel title={t('settings.news')}>
          <GameText>{t('settings.newsBody')}</GameText>
        </Panel>
        {!adsAreSimulated ? <ChunkyButton variant="wood" label={t('settings.privacy')} onPress={() => void showPrivacyOptions()} /> : null}
        <ChunkyButton variant="red" label={t('settings.reset')} onPress={() => setConfirmReset(true)} />
        <ChunkyButton variant="blue" label={t('common.back')} onPress={() => router.back()} />
        <GameText
          size={12}
          color={colors.text}
          center
          onPress={() => {
            const taps = versionTaps + 1;
            setVersionTaps(taps);
            if (taps === 7) {
              useUiStore.getState().setTestMode(true);
              useUiStore.getState().toast(t('settings.testMode'));
            }
          }}
        >
          {t('settings.version', { version: Constants.expoConfig?.version ?? '1.0.0' })}
        </GameText>
      </ScrollView>
      <GameModal visible={loginInfo} title={t('settings.login')} onClose={() => setLoginInfo(false)}>
        <GameText center>{t('settings.loginSoon')}</GameText>
        <ChunkyButton label={t('common.continue')} onPress={() => setLoginInfo(false)} />
      </GameModal>
      <GameModal visible={confirmReset} title={t('settings.reset')} onClose={() => setConfirmReset(false)}>
        <GameText center>{t('settings.resetConfirm')}</GameText>
        <View style={styles.langs}>
          <ChunkyButton style={styles.flex} variant="wood" label={t('common.cancel')} onPress={() => setConfirmReset(false)} />
          <ChunkyButton
            style={styles.flex}
            variant="red"
            label={t('common.confirm')}
            onPress={() => {
              useGameStore.getState().resetProgress();
              setConfirmReset(false);
              router.replace('/');
            }}
          />
        </View>
      </GameModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  langs: { flexDirection: 'row', gap: 8 },
  flex: { flex: 1 },
});
