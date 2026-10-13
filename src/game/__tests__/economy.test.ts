import { MINE_BALANCE } from '@/data/mine';
import { bulkCost, maxAffordable, milestoneMultiplier, shaftFirstCost, shaftRate } from '../economy';
import { formatDuration, formatNumber } from '../format';

describe('economy', () => {
  it('duplica la producción en cada hito', () => {
    expect(milestoneMultiplier(9)).toBe(1);
    expect(milestoneMultiplier(10)).toBe(2);
    expect(milestoneMultiplier(25)).toBe(4);
    expect(shaftRate(0, 10)).toBeCloseTo(MINE_BALANCE.shaft.baseRate * 10 * 2);
  });

  it('los costes crecen geométricamente por nivel', () => {
    const ratio = shaftFirstCost(0, 6) / shaftFirstCost(0, 5);
    expect(ratio).toBeCloseTo(MINE_BALANCE.shaft.levelCostGrowth);
  });

  it('bulkCost coincide con sumar nivel a nivel', () => {
    let sum = 0;
    for (let l = 1; l <= 10; l++) sum += shaftFirstCost(0, l);
    expect(bulkCost(shaftFirstCost(0, 1), MINE_BALANCE.shaft.levelCostGrowth, 10)).toBeCloseTo(sum, 6);
  });

  it('maxAffordable nunca se pasa del presupuesto', () => {
    for (const budget of [5, 10, 99, 1234, 1e6, 1e12]) {
      const n = maxAffordable(10, 1.12, budget, 1000);
      expect(bulkCost(10, 1.12, n)).toBeLessThanOrEqual(budget);
      expect(bulkCost(10, 1.12, n + 1)).toBeGreaterThan(budget);
    }
    expect(maxAffordable(10, 1.12, 1e30, 50)).toBe(50);
  });
});

describe('format', () => {
  it('formatea números grandes', () => {
    expect(formatNumber(850)).toBe('850');
    expect(formatNumber(1234)).toBe('1.23K');
    expect(formatNumber(12400)).toBe('12.4K');
    expect(formatNumber(999_999)).toBe('1M');
    expect(formatNumber(5.2e9)).toBe('5.2B');
    expect(formatNumber(1e15)).toBe('1aa');
    expect(formatNumber(2.5e18)).toBe('2.5ab');
  });

  it('formatea duraciones', () => {
    expect(formatDuration(8100)).toBe('2h 15m');
    expect(formatDuration(245)).toBe('4m 05s');
    expect(formatDuration(35)).toBe('35s');
  });
});
