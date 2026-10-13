const SUFFIXES = ['', 'K', 'M', 'B', 'T'];

function letterSuffix(tier: number): string {
  // Después de T (10^12) vienen aa, ab, ac… como en la mayoría de idle games.
  const n = tier - SUFFIXES.length;
  const first = String.fromCharCode(97 + Math.floor(n / 26));
  const second = String.fromCharCode(97 + (n % 26));
  return first + second;
}

/** 850 → "850", 1234 → "1.23K", 12400 → "12.4K", 3.4e7 → "34M", 1e15 → "1aa". */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '∞';
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  if (abs < 1000) return sign + (abs < 10 && abs % 1 !== 0 ? abs.toFixed(1) : Math.floor(abs).toString());
  let tier = Math.floor(Math.log10(abs) / 3);
  let scaled = abs / 1000 ** tier;
  // Evita "1000K" por redondeo.
  if (scaled >= 999.5) {
    tier += 1;
    scaled /= 1000;
  }
  const digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  const text = scaled.toFixed(digits).replace(/\.?0+$/, '');
  const suffix = tier < SUFFIXES.length ? SUFFIXES[tier] : letterSuffix(tier);
  return sign + text + suffix;
}

/** 8100 → "2h 15m", 245 → "4m 05s", 35 → "35s". */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, '0')}s`;
  return `${sec}s`;
}
