import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { ABILITY, DINO_BY_ID } from '@/data/dinos';
import { DINO_FACTS, type Measure } from '@/data/dinoFacts';
import { dinoBonusValue } from '@/game/modifiers';
import type { OwnedDino } from '@/game/types';
import { dinoFactText, useTranslation } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useGameStore } from '@/store/gameStore';
import { useUiStore } from '@/store/uiStore';
import { getArt, getDinoVideo } from './art';
import { ChunkyButton } from './ChunkyButton';
import { DinoVideo } from './DinoVideo';
import { GameIcon } from './GameIcon';
import { GameText } from './GameText';
import { IconLabel } from './IconLabel';
import type { IconName } from './iconNames';
import { DinoAvatar } from './Icons';
import { colors, radius, rarityColors } from './theme';

const HERO = 168;

type Tab = 'info' | 'stats';

/** 2 · 6–8 · 0.3 (sin ceros de más). */
function formatMeasure(m: Measure): string {
  return typeof m === 'number' ? String(m) : `${m[0]}–${m[1]}`;
}

/**
 * Cabecera: el video de la especie (una vez, se queda en el último cuadro) sobre su retrato,
 * que se ve mientras carga; sin video, el retrato redondo de siempre.
 */
function Hero({ dinoId, owned, color }: { dinoId: string; owned: boolean; color: string }) {
  const video = owned ? getDinoVideo(dinoId) : undefined;
  const portrait = getArt(`dinos/${dinoId}`);
  if (!video) {
    return (
      <View style={styles.avatar}>
        <DinoAvatar dinoId={dinoId} size={110} silhouette={!owned} ring={owned} />
      </View>
    );
  }
  return (
    <View style={[styles.hero, { borderColor: color }]}>
      {/* Ancho y alto explícitos: en web, absoluteFill sola deja la imagen a su tamaño original. */}
      {portrait ? <Image source={portrait} resizeMode="cover" style={styles.poster} /> : null}
      <DinoVideo source={video} />
    </View>
  );
}

/** Un dato de la ficha técnica: icono(s), título pequeño y valor. */
function Fact({ icons, label, children }: { icons: IconName[]; label: string; children: string }) {
  return (
    <View style={styles.fact}>
      <View style={styles.factIcons}>
        {icons.map((icon) => (
          <GameIcon key={icon} name={icon} size={18} />
        ))}
      </View>
      <View style={styles.factText}>
        <GameText size={11} weight="black" color={colors.woodDark}>
          {label}
        </GameText>
        <GameText size={13} weight="bold">
          {children}
        </GameText>
      </View>
    </View>
  );
}

/** Pestañas Info / Mecánicas bajo la cabecera. */
function Tabs({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.tabs}>
      {(['info', 'stats'] as const).map((key) => (
        <Pressable
          key={key}
          accessibilityRole="tab"
          accessibilityLabel={`tab-${key}`}
          accessibilityState={{ selected: tab === key }}
          onPress={() => {
            tapFeedback();
            onChange(key);
          }}
          style={[styles.tab, tab === key && styles.tabOn]}
        >
          <GameText size={13} weight="black" color={tab === key ? colors.textLight : colors.woodDark} outline={tab === key}>
            {t(`collection.tabs.${key}`)}
          </GameText>
        </Pressable>
      ))}
    </View>
  );
}

/**
 * Ficha de una especie en la colección: video (o retrato) · rareza y nivel · dos pestañas:
 * - Info: ficha técnica (dieta, época, tamaño, región) y dato curioso.
 * - Mecánicas: bonus de colección y habilidad de manager (recuadros amarillos).
 * Sin descubrir: silueta, rareza y mecánicas; los datos se guardan como sorpresa.
 */
export function DinoProfile({ dinoId, owned }: { dinoId: string; owned: OwnedDino | undefined }) {
  const { t } = useTranslation();
  const testMode = useUiStore((s) => s.testMode);
  const [tab, setTab] = useState<Tab>('info');
  const species = DINO_BY_ID[dinoId];
  if (!species) return null;
  const facts = DINO_FACTS[dinoId];
  const texts = dinoFactText(dinoId);
  const rarityColor = rarityColors[species.rarity];
  const ability = ABILITY[species.rarity];
  const hasInfo = !!owned && !!facts && !!texts;
  const shown: Tab = hasInfo ? tab : 'stats';

  const size = facts
    ? [
        facts.height !== undefined ? t('collection.height', { value: formatMeasure(facts.height) }) : null,
        facts.length !== undefined ? t('collection.length', { value: formatMeasure(facts.length) }) : null,
        facts.wingspan !== undefined ? t('collection.wingspan', { value: formatMeasure(facts.wingspan) }) : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : '';
  const dietIcons: IconName[] =
    facts?.diet === 'omnivore' ? ['diet-herbivore', 'diet-carnivore'] : facts?.diet === 'carnivore' ? ['diet-carnivore'] : ['diet-herbivore'];

  return (
    <>
      <Hero dinoId={dinoId} owned={!!owned} color={rarityColor} />
      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: rarityColor }]}>
          <GameText size={12} weight="black" color={colors.textLight} outline>
            {t(`rarity.${species.rarity}`)}
          </GameText>
        </View>
        {owned ? (
          <View style={[styles.badge, styles.levelBadge]}>
            <GameText size={12} weight="black" color={colors.textLight} outline>
              {t('common.level', { level: owned.level })}
            </GameText>
          </View>
        ) : null}
        {owned ? (
          <GameText size={12} weight="bold">
            {t('collection.copies', { count: owned.count })}
          </GameText>
        ) : null}
      </View>

      {hasInfo ? <Tabs tab={shown} onChange={setTab} /> : <GameText size={13} center>{t('collection.locked')}</GameText>}

      {shown === 'info' && facts && texts ? (
        <>
          <View style={styles.sheet}>
            <Fact icons={dietIcons} label={t('collection.diet')}>
              {t(`collection.diets.${facts.diet}`)}
            </Fact>
            <Fact icons={['fact-era']} label={t('collection.era')}>
              {`${t(`collection.periods.${facts.period}`)} · ${t('collection.mya', { count: facts.mya })}`}
            </Fact>
            <Fact icons={['fact-size']} label={t('collection.size')}>
              {size}
            </Fact>
            <Fact icons={['fact-region']} label={t('collection.region')}>
              {texts.region}
            </Fact>
          </View>
          <View style={styles.funFact}>
            <IconLabel icon="fact-curious" size={16}>
              <GameText size={12} weight="black" color={colors.woodDark}>
                {t('collection.funFact')}
              </GameText>
            </IconLabel>
            <GameText size={13} style={styles.quote}>
              “{texts.fact}”
            </GameText>
          </View>
        </>
      ) : (
        <>
          <View style={styles.infoBox}>
            <GameText size={13} weight="black">
              {t('collection.bonus')}
            </GameText>
            <GameText size={14}>{t(`bonus.${species.bonus}`, { value: Math.round(dinoBonusValue(species, owned?.level ?? 1)) })}</GameText>
          </View>
          <View style={styles.infoBox}>
            <GameText size={13} weight="black">
              {t('collection.ability')}
            </GameText>
            <IconLabel icon="turbo" size={14}>
              <GameText size={14}>{t('managers.turbo', { mult: ability.multiplier, seconds: ability.seconds })}</GameText>
            </IconLabel>
          </View>
          {testMode ? <ChunkyButton size="sm" variant="green" label={t('collection.testUnlock')} onPress={() => useGameStore.getState().grantDino(dinoId)} /> : null}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignSelf: 'center',
    width: HERO,
    height: HERO,
    borderRadius: radius.md,
    borderWidth: 4,
    overflow: 'hidden',
    backgroundColor: colors.parchmentDark,
  },
  poster: { position: 'absolute', top: 0, left: 0, width: HERO - 8, height: HERO - 8 },
  avatar: { alignItems: 'center' },
  badges: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  badge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 2 },
  levelBadge: { backgroundColor: colors.blue },
  tabs: { flexDirection: 'row', padding: 3, gap: 4, borderRadius: radius.md, backgroundColor: colors.parchmentDark },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: radius.sm },
  tabOn: { backgroundColor: colors.wood, borderWidth: 2, borderColor: colors.woodDark },
  sheet: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  fact: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: 8,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1.5,
    borderColor: 'rgba(122, 74, 36, 0.25)',
  },
  factIcons: { flexDirection: 'row', marginTop: 2 },
  factText: { flex: 1 },
  funFact: {
    padding: 10,
    gap: 4,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(122, 74, 36, 0.4)',
  },
  quote: { fontStyle: 'italic' },
  infoBox: { padding: 10, borderRadius: radius.sm, backgroundColor: colors.parchmentDark, gap: 2 },
});
