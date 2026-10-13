import type { Rarity } from '@/game/types';

export interface WorldGoal {
  id: string;
  /** Galerías desbloqueadas necesarias para cumplir la meta. */
  shafts: number;
  reward: { amber: number; egg: Rarity };
}

export interface World {
  id: number;
  key: string;
  playable: boolean;
  color: string;
  emoji: string;
  goals: WorldGoal[];
}

/** Los 9 mundos del mapa. Solo el Mundo 1 es jugable en el MVP. */
export const WORLDS: readonly World[] = [
  {
    id: 1,
    key: 'eggValley',
    playable: true,
    color: '#8FD16A',
    emoji: '🥚',
    goals: [
      { id: 'w1-g1', shafts: 3, reward: { amber: 10, egg: 'common' } },
      { id: 'w1-g2', shafts: 6, reward: { amber: 25, egg: 'rare' } },
      { id: 'w1-g3', shafts: 10, reward: { amber: 50, egg: 'epic' } },
    ],
  },
  { id: 2, key: 'jurassicForest', playable: false, color: '#4CAF50', emoji: '🌳', goals: [] },
  { id: 3, key: 'amberMine', playable: false, color: '#F5A623', emoji: '💎', goals: [] },
  { id: 4, key: 'fossilDesert', playable: false, color: '#E0B872', emoji: '🏜️', goals: [] },
  { id: 5, key: 'roaringVolcano', playable: false, color: '#E5533D', emoji: '🌋', goals: [] },
  { id: 6, key: 'floatingIslands', playable: false, color: '#7FC8F8', emoji: '☁️', goals: [] },
  { id: 7, key: 'lostGlacier', playable: false, color: '#A7E3F5', emoji: '🧊', goals: [] },
  { id: 8, key: 'meteorWorld', playable: false, color: '#6C4AB6', emoji: '☄️', goals: [] },
  { id: 9, key: 'legendaryKingdom', playable: false, color: '#F2C94C', emoji: '🏰', goals: [] },
];
