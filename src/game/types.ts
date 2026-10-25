export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export const RARITIES: readonly Rarity[] = ['common', 'rare', 'epic', 'legendary', 'mythic'];

/** Estaciones de la mina: galerías (`shaft-0`…`shaft-9`), ascensor y museo. */
export type StationId = `shaft-${number}` | 'elevator' | 'museum';

export type BonusType =
  | 'shaftSpeed' // % producción de galerías
  | 'elevatorCapacity' // % capacidad del ascensor
  | 'museumCapacity' // % capacidad del museo
  | 'coinValue' // % DinoCoins por fósil
  | 'offlineMinutes' // minutos extra de tope offline
  | 'eggChance' // % probabilidad de huevo por viaje del ascensor
  | 'hatchSpeed' // % velocidad de incubación
  | 'upgradeDiscount'; // % descuento en mejoras

export interface ShaftState {
  level: number;
  /** Fósiles acumulados esperando al ascensor. */
  deposit: number;
  /** Progreso del ciclo actual, 0..1. */
  progress: number;
  /** Trabajando (siempre true si hay manager; un ciclo por toque si no). */
  running: boolean;
}

export interface CarrierState {
  level: number;
  progress: number;
  running: boolean;
}

export interface MineState {
  shafts: ShaftState[];
  elevator: CarrierState;
  museum: CarrierState;
  /** Fósiles en la superficie esperando al museo. */
  surface: number;
}

export interface OwnedDino {
  /** Nivel de colección: sube con cada duplicado. */
  level: number;
  /** Copias obtenidas en total. */
  count: number;
}

export interface AbilityState {
  activeUntil: number;
  cooldownUntil: number;
}

export interface IncubatorState {
  rarity: Rarity;
  startedAt: number;
  endsAt: number;
}

export interface Settings {
  sound: boolean;
  music: boolean;
  haptics: boolean;
  /** null = idioma del dispositivo. */
  language: 'es' | 'en' | null;
}

export interface Purchases {
  doubleIncome: boolean;
  dinoPass: boolean;
  starterPack: boolean;
}

export interface GameState {
  version: number;
  coins: number;
  amber: number;
  /** Huellas Antiguas: moneda de prestigio. */
  huellas: number;
  prestigeCount: number;
  /** DinoCoins ganadas desde el último prestigio (base del cálculo de huellas). */
  runEarnings: number;
  lifetimeEarnings: number;
  mine: MineState;
  dinos: Partial<Record<string, OwnedDino>>;
  managers: Partial<Record<StationId, string>>;
  abilities: Partial<Record<StationId, AbilityState>>;
  eggs: Record<Rarity, number>;
  incubator: IncubatorState | null;
  adBoostUntil: number;
  purchases: Purchases;
  goalsClaimed: string[];
  lastActiveAt: number;
  lastDailyAmberAt: number;
  settings: Settings;
  /** Paso del tutorial (índice en TUTORIAL_STEPS); TUTORIAL_FINISHED = terminado o saltado. */
  tutorialStep: number;
}

/** Eventos que produce la simulación para que la UI reaccione (sonidos, toasts). */
export type GameEvent =
  | { type: 'eggFound'; rarity: Rarity }
  | { type: 'sold'; coins: number };
