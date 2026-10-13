import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useGameStore } from '@/store/gameStore';

export type SfxName = 'tap' | 'coins' | 'upgrade' | 'egg' | 'hatch' | 'prestige';

/**
 * Registro de efectos de sonido. Añade aquí los archivos cuando existan, p. ej.:
 *   tap: require('../../assets/sfx/tap.mp3'),
 * Mientras un efecto no tenga archivo, playSfx() no hace nada.
 */
const SFX: Partial<Record<SfxName, number>> = {};

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
