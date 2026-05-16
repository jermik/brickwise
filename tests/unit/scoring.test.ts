import { describe, it, expect } from 'vitest';
import {
  scoreColor,
  scoreLabel,
  riskColor,
  valueStatusLabel,
  platformColor,
  calcPaybackYears,
  calcCapRate,
  calcFeeBurden,
  calcMonthlyReturn,
} from '@/lib/scoring';
import type { Property } from '@/lib/types';

const mockProperty: Property = {
  id: 1,
  address: '123 Test St',
  city: 'Detroit',
  country: 'USA',
  platform: 'RealT',
  tokenPrice: 50,
  totalTokens: 100,
  monthlyRent: 1000,
  expectedYield: 12,
  occupancyRate: 95,
  overallScore: 80,
  riskLevel: 'Medium',
  valueStatus: 'fair',
  fees: { propertyTax: 100, insurance: 50, management: 80 },
  lastUpdated: '2026-01-01',
} as Property;

describe('scoreColor', () => {
  it('returns green for score >= 85', () => {
    expect(scoreColor(85)).toBe('#16a34a');
    expect(scoreColor(100)).toBe('#16a34a');
  });

  it('returns amber for score 70–84', () => {
    expect(scoreColor(70)).toBe('#b45309');
    expect(scoreColor(84)).toBe('#b45309');
  });

  it('returns red for score < 70', () => {
    expect(scoreColor(69)).toBe('#dc2626');
    expect(scoreColor(0)).toBe('#dc2626');
  });
});

describe('scoreLabel', () => {
  it.each([
    [90, 'Strong'],
    [85, 'Strong'],
    [75, 'Moderate'],
    [70, 'Moderate'],
    [50, 'Weak'],
  ])('score %i → %s', (score, label) => {
    expect(scoreLabel(score)).toBe(label);
  });
});

describe('riskColor', () => {
  it('maps Low to green', () => expect(riskColor('Low')).toBe('#16a34a'));
  it('maps Medium to amber', () => expect(riskColor('Medium')).toBe('#b45309'));
  it('maps High to red', () => expect(riskColor('High')).toBe('#dc2626'));
});

describe('valueStatusLabel', () => {
  it.each([
    ['undervalued', 'Undervalued'],
    ['fair', 'Fair value'],
    ['overpriced', 'Overpriced'],
  ] as const)('%s → %s', (status, label) => {
    expect(valueStatusLabel(status)).toBe(label);
  });
});

describe('platformColor', () => {
  it('returns blue for RealT', () => expect(platformColor('RealT')).toBe('#3b82f6'));
  it('returns orange for Lofty', () => expect(platformColor('Lofty')).toBe('#f97316'));
  it('falls back to grey for unknown', () => expect(platformColor('Unknown')).toBe('#9ca3af'));
});

describe('calcPaybackYears', () => {
  it('calculates correctly', () => {
    // totalValue = 50 * 100 = 5000; annualIncome = 1000 * 12 * 0.95 = 11400
    const result = calcPaybackYears(mockProperty);
    expect(result).toBeCloseTo(0.4, 0);
  });

  it('returns 99 when no rent income', () => {
    const p = { ...mockProperty, monthlyRent: 0 };
    expect(calcPaybackYears(p as Property)).toBe(99);
  });
});

describe('calcCapRate', () => {
  it('calculates cap rate correctly', () => {
    // totalValue = 5000; annualNOI = (1000 - 100 - 50 - 80) * 12 = 9240
    const result = calcCapRate(mockProperty);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100);
  });

  it('returns 0 for zero property value', () => {
    const p = { ...mockProperty, tokenPrice: 0, totalTokens: 0 };
    expect(calcCapRate(p as Property)).toBe(0);
  });
});

describe('calcFeeBurden', () => {
  it('returns fee burden as percentage of rent', () => {
    // fees = 100 + 50 + 80 = 230; rent = 1000; burden = 23%
    const result = calcFeeBurden(mockProperty);
    expect(result).toBe(23);
  });

  it('returns 0 when no rent', () => {
    const p = { ...mockProperty, monthlyRent: 0 };
    expect(calcFeeBurden(p as Property)).toBe(0);
  });
});

describe('calcMonthlyReturn', () => {
  it('calculates monthly return on investment', () => {
    // 12000 * 12 / 1200 = 120 per month on $12000 at 12% yield
    expect(calcMonthlyReturn(mockProperty, 12000)).toBe(120);
  });

  it('scales linearly with amount', () => {
    const r1 = calcMonthlyReturn(mockProperty, 1000);
    const r2 = calcMonthlyReturn(mockProperty, 2000);
    expect(r2).toBeCloseTo(r1 * 2, 2);
  });
});
