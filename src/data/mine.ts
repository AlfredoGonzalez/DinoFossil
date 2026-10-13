/**
 * Balance de la mina del Mundo 1. Todo el tuning numérico vive aquí: cambia
 * estos valores para ajustar el ritmo del juego sin tocar el motor.
 * Las fórmulas están documentadas en docs/GAME_DESIGN.md.
 */
export const MINE_BALANCE = {
  maxShafts: 10,
  shaft: {
    /** Segundos por ciclo de excavación. */
    cycleSeconds: 3,
    /** Fósiles/s de la galería i a nivel 1: baseRate * rateGrowth^i. */
    baseRate: 1.5,
    rateGrowth: 6,
    /** Coste de subir la galería i del nivel 1 al 2: baseCost * costGrowthPerShaft^i. */
    baseCost: 10,
    costGrowthPerShaft: 40,
    /** Factor de coste por nivel. */
    levelCostGrowth: 1.12,
    /** Coste de desbloquear la galería i (i >= 1): unlockBase * unlockGrowth^(i-1). */
    unlockBase: 100,
    unlockGrowth: 45,
    maxLevel: 200,
    /** Niveles en los que la producción se multiplica ×2. */
    milestones: [10, 25, 50, 100, 150, 200],
  },
  elevator: {
    /** Duración de un viaje: base + perShaft * galerías desbloqueadas. */
    baseTripSeconds: 2,
    tripSecondsPerShaft: 0.6,
    baseCapacity: 25,
    capacityGrowth: 1.06,
    baseCost: 15,
    levelCostGrowth: 1.1,
    maxLevel: 800,
  },
  museum: {
    cycleSeconds: 4,
    baseCapacity: 30,
    capacityGrowth: 1.06,
    baseCost: 15,
    levelCostGrowth: 1.1,
    maxLevel: 800,
  },
  /** DinoCoins por fósil vendido en el Mundo 1. */
  coinsPerFossil: 1,
  /** Probabilidad base de encontrar un huevo en cada viaje del ascensor. */
  eggChancePerTrip: 0.02,
  /** Tope base de ganancias offline, en minutos. */
  offlineCapMinutes: 120,
} as const;

export const PRESTIGE = {
  /** Huellas = floor(sqrt(monedasDeLaPartida / divisor)). */
  divisor: 1e6,
  /** Bonus de producción por cada huella. */
  bonusPerHuella: 0.1,
} as const;

export const AD_REWARDS = {
  boostHours: 4,
  maxBoostHours: 12,
  eggSkipMinutes: 30,
  dailyAmber: 5,
} as const;
