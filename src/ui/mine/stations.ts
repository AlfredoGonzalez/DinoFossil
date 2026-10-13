import type { TFunction } from 'i18next';
import type { StationId } from '@/game/types';

export function stationName(t: TFunction, station: StationId): string {
  if (station === 'elevator') return t('mine.elevator');
  if (station === 'museum') return t('mine.museum');
  return t('mine.shaft', { n: Number(station.slice('shaft-'.length)) + 1 });
}

export function shaftIndex(station: StationId): number | null {
  return station.startsWith('shaft-') ? Number(station.slice('shaft-'.length)) : null;
}
