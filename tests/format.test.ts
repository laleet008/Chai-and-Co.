import { describe, it, expect } from 'vitest';
import { formatPrice } from '@/lib/format';

describe('formatPrice', () => {
  it('formats a round number in Nepali rupees with thousands grouping', () => {
    expect(formatPrice(1850)).toContain('1,850');
  });

  it('prepends the NPR currency symbol or code', () => {
    const out = formatPrice(1650);
    expect(out === 'NPR\xa01,650' || out === 'Rs.\xa01,650' || /NPR|₨|Rs/.test(out)).toBe(true);
  });

  it('returns a zero-ish string for negative inputs', () => {
    const out = formatPrice(-5);
    expect(/0/.test(out)).toBe(true);
  });

  it('handles NaN and Infinity gracefully', () => {
    expect(/0/.test(formatPrice(NaN))).toBe(true);
    expect(/0/.test(formatPrice(Infinity))).toBe(true);
  });
});
