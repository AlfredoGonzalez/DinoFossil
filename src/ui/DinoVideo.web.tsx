/**
 * Web: un <video> directo. Los navegadores solo dejan arrancar solo un video silenciado, y
 * `muted` debe estar puesto en el elemento antes de llamar a play() (React no lo pone como
 * atributo), así que se fija en el ref. Una sola vez; al terminar se queda en el último cuadro.
 */
export function DinoVideo({ source }: { source: number | string }) {
  return (
    <video
      src={String(source)}
      autoPlay
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      ref={(el) => {
        if (!el || el.dataset.started) return;
        el.dataset.started = '1';
        el.muted = true;
        void el.play().catch(() => {});
      }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
