import { newGame } from '@/test/newGame';
import { shaftCycleSeconds, shaftCycleYield, shaftRate } from '../economy';
import { activateAbility, assignManager } from '../managers';
import { applyOfflineProgress } from '../offline';
import { tapStation, tick } from '../simulate';
import type { GameState } from '../types';
import { buyUpgrade, unlockShaft, upgradeQuote } from '../upgrades';

const T0 = 1_700_000_000_000;
const noEggs = () => 0.99;

function run(state: GameState, seconds: number, step = 0.1, start = T0): GameState {
  let s = state;
  for (let t = 0; t < seconds; t += step) s = tick(s, step, start + (t + step) * 1000, noEggs).state;
  return s;
}

function fullyManaged(): GameState {
  let s = newGame(T0);
  s = { ...s, dinos: { ...s.dinos, stegosaurus: { level: 1, count: 1 }, triceratops: { level: 1, count: 1 } } };
  s = assignManager(s, 'shaft-0', 'trex');
  s = assignManager(s, 'elevator', 'stegosaurus');
  return assignManager(s, 'museum', 'triceratops');
}

describe('tick', () => {
  it('sin managers no produce nada hasta que se toca', () => {
    const s = run(newGame(T0), 30);
    expect(s.coins).toBe(0);
  });

  it('un toque hace un solo ciclo y la cadena lo lleva hasta el museo', () => {
    let s = newGame(T0);
    s = tapStation(s, 'shaft-0');
    s = run(s, 5);
    expect(s.mine.shafts[0]?.deposit).toBeCloseTo(6 * 1.02); // 1.5/s × 4 s, +2 % del T-Rex inicial
    expect(s.mine.shafts[0]?.running).toBe(false);
    s = tapStation(s, 'elevator');
    s = run(s, 5);
    expect(s.mine.surface).toBeCloseTo(6 * 1.02);
    s = tapStation(s, 'museum');
    s = run(s, 5);
    expect(s.coins).toBeCloseTo(6 * 1.02);
  });

  it('las galerías profundas tardan más por ciclo pero rinden más por segundo', () => {
    expect(shaftCycleSeconds(0)).toBe(4);
    expect(shaftCycleSeconds(1)).toBe(6);
    expect(shaftRate(1, 1)).toBeGreaterThan(shaftRate(0, 1));
    expect(shaftCycleYield(1, 1) / shaftCycleSeconds(1)).toBeCloseTo(shaftRate(1, 1));
  });

  it('con managers produce de forma continua', () => {
    const s = run(fullyManaged(), 60);
    expect(s.coins).toBeGreaterThan(50);
    expect(s.runEarnings).toBe(s.coins);
  });

  it('la habilidad Turbo acelera la estación', () => {
    const base = fullyManaged();
    const turbo = activateAbility(base, 'shaft-0', T0);
    expect(turbo).not.toBeNull();
    const a = run(base, 20);
    const b = run(turbo!, 20);
    const dep = (s: GameState) => s.mine.shafts[0]!.deposit + s.mine.surface + s.coins;
    expect(dep(b)).toBeGreaterThan(dep(a));
  });

  it('encuentra huevos en los viajes del ascensor', () => {
    let s = fullyManaged();
    let found = 0;
    for (let i = 0; i < 300; i++) {
      const r = tick(s, 0.5, T0 + i * 500, () => 0.001);
      s = r.state;
      found += r.events.filter((e) => e.type === 'eggFound').length;
    }
    expect(found).toBeGreaterThan(0);
    expect(s.eggs.common).toBeGreaterThan(1);
  });
});

describe('upgrades', () => {
  it('compra niveles y desbloquea galerías', () => {
    let s = { ...newGame(T0), coins: 1e6 };
    const quote = upgradeQuote(s, 'shaft-0', 10, T0);
    s = buyUpgrade(s, 'shaft-0', 10, T0)!;
    expect(s.mine.shafts[0]?.level).toBe(11);
    expect(s.coins).toBeCloseTo(1e6 - quote.cost);
    s = unlockShaft(s)!;
    expect(s.mine.shafts).toHaveLength(2);
  });

  it('no deja comprar sin dinero', () => {
    expect(buyUpgrade(newGame(T0), 'museum', 1, T0)).toBeNull();
    expect(unlockShaft(newGame(T0))).toBeNull();
  });

  it('MAX compra todo lo asequible', () => {
    const s = { ...newGame(T0), coins: 5000 };
    const quote = upgradeQuote(s, 'elevator', 'max', T0);
    expect(quote.levels).toBeGreaterThan(10);
    expect(quote.cost).toBeLessThanOrEqual(5000);
  });

  it('"hasta el hito" compra justo los niveles que faltan para el siguiente ×2', () => {
    let s = { ...newGame(T0), coins: 1e9 };
    expect(upgradeQuote(s, 'shaft-0', 'milestone', T0).levels).toBe(9);
    s = buyUpgrade(s, 'shaft-0', 'milestone', T0)!;
    expect(s.mine.shafts[0]?.level).toBe(10);
    expect(upgradeQuote(s, 'shaft-0', 'milestone', T0).levels).toBe(15);
    // El laboratorio y la sala no tienen hitos.
    expect(upgradeQuote(s, 'elevator', 'milestone', T0).levels).toBe(0);
    expect(buyUpgrade(s, 'elevator', 'milestone', T0)).toBeNull();
  });
});

describe('offline', () => {
  it('se aproxima a simular tick a tick', () => {
    const start = run(fullyManaged(), 30);
    const seconds = 600;
    const online = run(start, seconds, 0.25, T0 + 30_000);
    const offline = applyOfflineProgress({ ...start, lastActiveAt: T0 + 30_000 }, T0 + 30_000 + seconds * 1000);
    const onlineGain = online.coins - start.coins;
    expect(offline.coins).toBeGreaterThan(onlineGain * 0.9);
    expect(offline.coins).toBeLessThan(onlineGain * 1.1);
  });

  it('respeta el tope de horas y no produce sin managers', () => {
    const s = fullyManaged();
    const day = applyOfflineProgress(s, T0 + 24 * 3600 * 1000);
    expect(day.seconds).toBeLessThan(24 * 3600);
    const idle = applyOfflineProgress(newGame(T0), T0 + 3600 * 1000);
    expect(idle.coins).toBe(0);
  });
});
