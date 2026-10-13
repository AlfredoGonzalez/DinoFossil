import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AD_REWARDS } from '@/data/mine';
import { AMBER_EGG_PRICES, IAP_PRODUCTS, type IapProduct, type ProductId } from '@/data/shop';
import { canAddAdBoost, canClaimDailyAmber } from '@/game/rewards';
import type { Rarity } from '@/game/types';
import { useTranslation } from '@/i18n';
import { successFeedback } from '@/services/feedback';
import { getPrices, purchase, restore } from '@/services/purchases';
import { watchRewardedAd } from '@/services/rewards';
import { useGameStore } from '@/store/gameStore';
import { useUiStore } from '@/store/uiStore';
import { BottomNav } from '@/ui/BottomNav';
import { ChunkyButton } from '@/ui/ChunkyButton';
import { CurrencyBar } from '@/ui/CurrencyBar';
import { GameText } from '@/ui/GameText';
import { useNow } from '@/ui/hooks';
import { EggIcon, ResourceIcon } from '@/ui/Icons';
import { Banner, Panel } from '@/ui/Panel';
import { Screen } from '@/ui/Screen';
import { colors, radius } from '@/ui/theme';

const PRODUCT_ICON: Record<ProductId, string> = {
  starter_pack: '🎁',
  amber_small: '🔶',
  amber_medium: '💰',
  amber_large: '👑',
  double_income: '✖️2',
  dino_pass: '🎟️',
};

function isOwned(product: IapProduct, purchases: { doubleIncome: boolean; dinoPass: boolean; starterPack: boolean }) {
  if (product.kind === 'consumable') return false;
  return (
    (product.id === 'double_income' && purchases.doubleIncome) ||
    (product.id === 'dino_pass' && purchases.dinoPass) ||
    (product.id === 'starter_pack' && purchases.starterPack)
  );
}

function Row({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>{icon}</View>
      <View style={styles.flex}>
        <GameText weight="black">{title}</GameText>
        {desc ? (
          <GameText size={12} color={colors.muted}>
            {desc}
          </GameText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** Tienda: compras reales (RevenueCat), huevos con Ámbar y recompensas por anuncio. */
export default function ShopScreen() {
  const { t } = useTranslation();
  const now = useNow(1000);
  const purchases = useGameStore((s) => s.game.purchases);
  const amber = useGameStore((s) => s.game.amber);
  const dailyReady = useGameStore((s) => canClaimDailyAmber(s.game, now));
  const boostReady = useGameStore((s) => canAddAdBoost(s.game, now));
  const [prices, setPrices] = useState<Partial<Record<ProductId, string>>>({});
  const [busy, setBusy] = useState<ProductId | null>(null);
  const toast = useUiStore((s) => s.toast);

  useEffect(() => {
    getPrices()
      .then(setPrices)
      .catch(() => undefined);
  }, []);

  const buy = async (id: ProductId) => {
    setBusy(id);
    try {
      if (await purchase(id)) {
        useGameStore.getState().grantPurchase(id);
        successFeedback();
        toast(t('shop.thanks'), '🎉');
      }
    } catch {
      toast(t('shop.failed'), '⚠️');
    } finally {
      setBusy(null);
    }
  };

  const productRow = (product: IapProduct) => {
    const owned = isOwned(product, purchases);
    const name = t(`shop.${product.id}.name`);
    return (
      <Row key={product.id} icon={<GameText size={26}>{PRODUCT_ICON[product.id]}</GameText>} title={name} desc={t(`shop.${product.id}.desc`)}>
        <ChunkyButton
          testID={`buy-${product.id}`}
          size="sm"
          variant="green"
          disabled={owned || busy !== null}
          label={owned ? t('common.owned') : (prices[product.id] ?? product.fallbackPrice)}
          onPress={() => buy(product.id)}
        />
      </Row>
    );
  };

  const starter = IAP_PRODUCTS.find((p) => p.id === 'starter_pack');

  return (
    <Screen background="sunset" edges={['top']}>
      <CurrencyBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Banner text={t('shop.title')} color={colors.orange} />
        {starter && !purchases.starterPack ? <Panel title={t('shop.offers')}>{productRow(starter)}</Panel> : null}
        <Panel title={t('shop.freebies')}>
          <Row icon={<ResourceIcon kind="amber" size={28} />} title={t('shop.dailyAmber', { amount: AD_REWARDS.dailyAmber })}>
            <ChunkyButton
              testID="daily-amber"
              size="sm"
              variant="blue"
              disabled={!dailyReady}
              label={dailyReady ? '📺' : t('shop.claimed')}
              onPress={async () => {
                if (await watchRewardedAd()) {
                  useGameStore.getState().dailyAmber();
                  successFeedback();
                }
              }}
            />
          </Row>
          <Row icon={<GameText size={26}>⚡</GameText>} title={boostReady ? t('shop.boost') : t('shop.boostMaxed')}>
            <ChunkyButton
              size="sm"
              variant="blue"
              disabled={!boostReady}
              label="📺"
              onPress={async () => {
                if (await watchRewardedAd()) {
                  useGameStore.getState().adBoost();
                  successFeedback();
                }
              }}
            />
          </Row>
        </Panel>
        <Panel title={t('shop.amber')}>{IAP_PRODUCTS.filter((p) => p.id.startsWith('amber_')).map(productRow)}</Panel>
        <Panel title={t('shop.permanent')}>{IAP_PRODUCTS.filter((p) => p.id === 'double_income' || p.id === 'dino_pass').map(productRow)}</Panel>
        <Panel title={t('shop.eggs')}>
          {(Object.entries(AMBER_EGG_PRICES) as [Rarity, number][]).map(([rarity, price]) => (
            <Row key={rarity} icon={<EggIcon rarity={rarity} size={34} />} title={t('shop.eggPrice', { rarity: t(`rarity.${rarity}`) })}>
              <ChunkyButton
                testID={`buy-egg-${rarity}`}
                size="sm"
                variant="orange"
                disabled={amber < price}
                label={`🔶 ${price}`}
                onPress={() => {
                  if (useGameStore.getState().buyEgg(rarity)) successFeedback();
                  else toast(t('shop.notEnoughAmber'), '🔶');
                }}
              />
            </Row>
          ))}
        </Panel>
        <ChunkyButton
          variant="wood"
          size="sm"
          label={t('shop.restore')}
          onPress={async () => {
            const owned = await restore();
            useGameStore.getState().restorePurchases(owned);
            toast(t('shop.restored'), '✅');
          }}
        />
      </ScrollView>
      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.parchmentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
});
