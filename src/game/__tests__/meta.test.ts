import { newGame } from '@/test/newGame';
import { claimGoal, claimableGoals, worldStars } from '../goals';
import { amberToFinish, hatch, startIncubation } from '../collection';
import { doPrestige, pendingHuellas } from '../prestige';
import { applyAdBoost, applyPurchase, claimDailyAmber } from '../rewards';
import { migrateSave } from '../state';
import { getModifiers } from '../modifiers';

const T0 = 1_700_000_000_000;
const HOUR = 3600_000;

describe('prestigio', () => {
  it('calcula huellas y conserva lo importante', () => {
    let s = newGame(T0);
    s = { ...s, runEarnings: 4.2e6, coins: 123, amber: 77, managers: { 'shaft-0': 'trex', 'shaft-3': 'trex' } };
    expect(pendingHuellas(s)).toBe(2);
    const p = doPrestige(s)!;
    expect(p.huellas).toBe(2);
    expect(p.coins).toBe(0);
    expect(p.amber).toBe(77);
    expect(p.dinos.trex).toBeDefined();
    expect(p.managers).toEqual({ 'shaft-0': 'trex' });
    expect(getModifiers(p, T0).coinValue).toBeCloseTo(getModifiers(s, T0).coinValue * 1.2);
  });

  it('no permite prestigio sin huellas', () => {
    expect(doPrestige(newGame(T0))).toBeNull();
  });
});

describe('incubadora', () => {
  it('incuba, acelera con ámbar y eclosiona', () => {
    let s = startIncubation(newGame(T0), 'common', T0)!;
    expect(s.eggs.common).toBe(0);
    expect(hatch(s, T0)).toBeNull();
    expect(amberToFinish(s, T0)).toBeGreaterThan(0);
    const r = hatch(s, T0 + HOUR, () => 0.5)!;
    expect(r.state.incubator).toBeNull();
    expect(r.dinoId).not.toBe('trex');
    expect(r.state.dinos[r.dinoId]).toEqual({ level: 1, count: 1 });
    // Un duplicado sube de nivel.
    s = { ...r.state, eggs: { ...r.state.eggs, common: 1 } };
    s = startIncubation(s, 'common', T0)!;
    const dup = hatch(s, T0 + HOUR, () => 0.5)!;
    expect(dup.state.dinos[r.dinoId]?.level).toBe(2);
  });
});

describe('metas y recompensas', () => {
  it('cobra metas al desbloquear galerías', () => {
    let s = newGame(T0);
    s = { ...s, mine: { ...s.mine, shafts: [...s.mine.shafts, ...s.mine.shafts, ...s.mine.shafts] } };
    expect(claimableGoals(s)).toHaveLength(1);
    s = claimGoal(s, 'w1-g1')!;
    expect(worldStars(s)).toBe(1);
    expect(claimGoal(s, 'w1-g1')).toBeNull();
  });

  it('el boost de anuncio se acumula hasta 12 h', () => {
    let s = newGame(T0);
    for (let i = 0; i < 5; i++) s = applyAdBoost(s, T0);
    expect(s.adBoostUntil).toBe(T0 + 12 * HOUR);
  });

  it('ámbar diario una vez cada 24 h', () => {
    const s = claimDailyAmber(newGame(T0), T0)!;
    expect(claimDailyAmber(s, T0 + HOUR)).toBeNull();
    expect(claimDailyAmber(s, T0 + 25 * HOUR)).not.toBeNull();
  });

  it('entrega compras', () => {
    const s = applyPurchase(newGame(T0), 'starter_pack');
    expect(s.amber).toBe(320);
    expect(s.eggs.epic).toBe(2);
    expect(s.purchases.starterPack).toBe(true);
    expect(getModifiers(applyPurchase(s, 'double_income'), T0).coinValue).toBeCloseTo(getModifiers(s, T0).coinValue * 2);
  });
});

describe('migración', () => {
  it('rellena campos de partidas antiguas', () => {
    const migrated = migrateSave({ coins: 50, settings: { sound: false } }, T0);
    expect(migrated.coins).toBe(50);
    expect(migrated.settings.sound).toBe(false);
    expect(migrated.settings.music).toBe(true);
    expect(migrated.mine.shafts).toHaveLength(1);
  });
});
