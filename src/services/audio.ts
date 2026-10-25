import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useGameStore } from '@/store/gameStore';
import { SOUNDS } from '@/ui/art.generated';

/**
 * Efectos de sonido. Cada uno se carga de assets/sfx/<nombre>.(mp3|m4a|wav|ogg) (lo registra
 * scripts/generate-art.mjs); mientras no exista el archivo, playSfx() no hace nada.
 * Ficha con qué suena cada uno y dónde conseguirlos: docs/art/06-sonidos.md.
 */
export type SfxName = 'tap' | 'coins' | 'upgrade' | 'fly' | 'lift' | 'egg' | 'hatch' | 'prestige';

const SFX = SOUNDS as Partial<Record<SfxName, number>>;

const players = new Map<SfxName, AudioPlayer>();

export function playSfx(name: SfxName) {
  const source = SFX[name];
  if (source === undefined || !useGameStore.getState().game.settings.sound) return;
  let player = players.get(name);
  if (!player) {
    player = createAudioPlayer(source);
    players.set(name, player);
  }
  void player.seekTo(0);
  player.play();
}
