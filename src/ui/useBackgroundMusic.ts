import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { setMusicPlaying } from '@/services/audio';
import { useGameStore } from '@/store/gameStore';

/**
 * Suena la música mientras se juega: no en la carga (en web el navegador no deja sonar nada antes
 * del primer toque, que es "Toca para jugar"), ni con la app en segundo plano o la música apagada.
 */
export function useBackgroundMusic() {
  const enabled = useGameStore((s) => s.game.settings.music);
  const pathname = usePathname();
  const [active, setActive] = useState(AppState.currentState !== 'background');

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => setActive(state === 'active'));
    return () => sub.remove();
  }, []);

  const playing = enabled && active && pathname !== '/';
  useEffect(() => {
    setMusicPlaying(playing);
  }, [playing]);
}
