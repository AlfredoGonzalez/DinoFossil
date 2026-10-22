import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet } from 'react-native';

/**
 * Video de la ficha (assets/art/dinos/<id>.mp4): se reproduce una vez, sin sonido, y se queda
 * en el último cuadro. Versión nativa con expo-video; en web, DinoVideo.web.tsx.
 */
export function DinoVideo({ source }: { source: number }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
    p.muted = true;
    p.play();
  });
  return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />;
}
