import { useState } from "react";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { formatDuration, formatNumber } from "@/game/format";
import { claimableGoals } from "@/game/goals";
import { isAdBoostActive } from "@/game/modifiers";
import { canAddAdBoost } from "@/game/rewards";
import { pendingHuellas } from "@/game/prestige";
import { shaftStationId } from "@/game/simulate";
import type { StationId } from "@/game/types";
import { nextShaftUnlockCost } from "@/game/upgrades";
import { useTranslation } from "@/i18n";
import { playSfx } from "@/services/audio";
import { successFeedback, tapFeedback } from "@/services/feedback";
import { watchRewardedAd } from "@/services/rewards";
import { useGameStore } from "@/store/gameStore";
import { getArt } from "@/ui/art";
import { BottomNav } from "@/ui/BottomNav";
import { ChunkyButton } from "@/ui/ChunkyButton";
import { CurrencyBar } from "@/ui/CurrencyBar";
import { GameText } from "@/ui/GameText";
import { GameIcon } from "@/ui/GameIcon";
import { IconLabel } from "@/ui/IconLabel";
import { useNow } from "@/ui/hooks";
import { ResourceIcon } from "@/ui/Icons";
import { BasementFloor, FloorSign } from "@/ui/mine/BasementFloor";
import { FLOOR_HEIGHT } from "@/ui/mine/Floor";
import { Dumbwaiter } from "@/ui/mine/Dumbwaiter";
import { HallFloor } from "@/ui/mine/HallFloor";
import { LabFloor } from "@/ui/mine/LabFloor";
import { Lift } from "@/ui/mine/Lift";
import { ManagerPicker } from "@/ui/mine/ManagerPicker";
import { PrestigeModal } from "@/ui/mine/PrestigeModal";
import { Roof } from "@/ui/mine/Roof";
import { UpgradeSheet } from "@/ui/mine/UpgradeSheet";
import { Screen } from "@/ui/Screen";
import { colors } from "@/ui/theme";

function Header({ onPrestige }: { onPrestige: () => void }) {
  const { t } = useTranslation();
  const now = useNow(1000);
  const boostUntil = useGameStore((s) => s.game.adBoostUntil);
  const canBoost = useGameStore((s) => canAddAdBoost(s.game, now));
  const prestigeReady = useGameStore((s) => pendingHuellas(s.game) > 0);
  const goalsBadge = useGameStore((s) => claimableGoals(s.game).length > 0);
  const boosting = isAdBoostActive(useGameStore.getState().game, now);

  return (
    <View style={styles.header}>
      <ChunkyButton
        testID="boost"
        style={styles.boost}
        size="sm"
        variant={boosting ? "orange" : "blue"}
        disabled={!canBoost}
        icon={boosting ? undefined : <GameIcon name="ad" size={20} />}
        label={
          boosting
            ? t("mine.boost", {
                time: formatDuration((boostUntil - now) / 1000),
              })
            : t("mine.boostCta")
        }
        onPress={async () => {
          if (await watchRewardedAd()) {
            useGameStore.getState().adBoost();
            successFeedback();
          }
        }}
      />
      <ChunkyButton
        testID="prestige"
        size="sm"
        variant={prestigeReady ? "purple" : "wood"}
        icon={<GameIcon name="huellas" size={22} />}
        onPress={onPrestige}
      />
      {/* Misiones: salieron de la barra inferior para dejar el centro al botón de la Casa-Museo. */}
      <View>
        <ChunkyButton
          testID="missions"
          size="sm"
          variant="wood"
          icon={<GameIcon name="nav-missions" size={22} />}
          onPress={() => router.replace("/goals")}
        />
        {goalsBadge ? <View pointerEvents="none" style={styles.badge} /> : null}
      </View>
      <ChunkyButton
        testID="settings"
        size="sm"
        variant="wood"
        icon={<GameIcon name="settings" size={22} />}
        onPress={() => router.push("/settings")}
      />
    </View>
  );
}

function UnlockRow() {
  const { t } = useTranslation();
  const cost = useGameStore((s) => nextShaftUnlockCost(s.game));
  const affordable = useGameStore((s) => cost !== null && s.game.coins >= cost);
  if (cost === null) {
    return (
      <View style={styles.unlock}>
        <GameText color={colors.textLight} weight="black" outline center>
          🏆 {t("mine.allShafts")}
        </GameText>
      </View>
    );
  }
  return (
    <View style={styles.unlock}>
      <ChunkyButton
        testID="unlock-shaft"
        variant="gold"
        disabled={!affordable}
        onPress={() => {
          if (useGameStore.getState().unlockShaft()) {
            playSfx("upgrade");
            successFeedback();
          }
        }}
      >
        <IconLabel icon="station-basement" size={18}>
          <GameText size={16} color={colors.textLight} weight="black" outline>
            {t("mine.newShaft")}
          </GameText>
        </IconLabel>
        <View style={styles.cost}>
          <ResourceIcon kind="coins" size={18} />
          <GameText size={15} color={colors.textLight} weight="black" outline>
            {formatNumber(cost)}
          </GameText>
        </View>
      </ChunkyButton>
    </View>
  );
}

/** Cimientos bajo el último sótano (arte: museum/foundation). */
function Foundation() {
  const art = getArt("museum/foundation");
  return (
    <View style={styles.foundation}>
      {art ? (
        <Image source={art} resizeMode="cover" style={styles.fill} />
      ) : null}
    </View>
  );
}

/** Pantalla principal: la Casa-Museo (sótanos → laboratorio → sala de exposición). */
export default function MineScreen() {
  const { t } = useTranslation();
  const shaftCount = useGameStore((s) => s.game.mine.shafts.length);
  const [upgrading, setUpgrading] = useState<StationId | null>(null);
  const [picking, setPicking] = useState<StationId | null>(null);
  const [prestigeOpen, setPrestigeOpen] = useState(false);

  return (
    <Screen
      background="sky"
      backgroundImage={getArt("museum/sky") ?? getArt("loading/background")}
      edges={["top"]}
    >
      <CurrencyBar />
      <Header onPrestige={() => (tapFeedback(), setPrestigeOpen(true))} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Roof />
        {/* Sala + laboratorio + sótanos: el montaplatos se dibuja encima de la sala y el laboratorio. */}
        <View>
          <HallFloor
            onUpgrade={() => setUpgrading("museum")}
            onPickManager={() => setPicking("museum")}
          />
          <View>
            <LabFloor
              onUpgrade={() => setUpgrading("elevator")}
              onPickManager={() => setPicking("elevator")}
            />
            {Array.from({ length: shaftCount }, (_, i) => (
              <BasementFloor
                key={i}
                index={i}
                onUpgrade={() => setUpgrading(shaftStationId(i))}
                onPickManager={() => setPicking(shaftStationId(i))}
              />
            ))}
            <Lift />
            {/* Tablitas centradas sobre las uniones: "Laboratorio" (sala/lab) y "Sótanos" (lab/sótanos). */}
            <FloorSign
              icon="station-lab"
              label={t("mine.elevator")}
              top={-14}
            />
            {shaftCount > 0 ? (
              <FloorSign
                icon="station-basement"
                label={t("mine.basements")}
                top={FLOOR_HEIGHT - 14}
              />
            ) : null}
          </View>
          <Dumbwaiter />
        </View>
        <UnlockRow />
        <Foundation />
      </ScrollView>
      <BottomNav />
      <UpgradeSheet station={upgrading} onClose={() => setUpgrading(null)} />
      <ManagerPicker station={picking} onClose={() => setPicking(null)} />
      <PrestigeModal
        visible={prestigeOpen}
        onClose={() => setPrestigeOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
  boost: { flex: 1 },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: "#fff",
  },
  scroll: { flex: 1 },
  // flexGrow + cimientos con flex: la casa siempre llega hasta la barra inferior.
  content: { flexGrow: 1 },
  // Bajo el último sótano: tierra con el botón de excavar uno nuevo.
  unlock: {
    marginHorizontal: 10,
    padding: 12,
    backgroundColor: "#4A2F19",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderColor: colors.woodDark,
  },
  // Mismo ancho que las plantas (margen 10 + pared de madera de 6): la casa no se ensancha abajo.
  foundation: {
    flexGrow: 1,
    minHeight: 70,
    marginHorizontal: 10,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderColor: colors.woodDark,
    backgroundColor: "#3A2412",
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  cost: { flexDirection: "row", alignItems: "center", gap: 4 },
});
