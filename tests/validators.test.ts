import { describe, it, expect } from 'vitest';
import { validatePromoCode, checkoutContactSchema, cardDetailsSchema } from '@/lib/validators';

describe('validatePromoCode', () => {
  it('accepts CHAI10 and MIST only', () => {
    expect(validatePromoCode('CHAI10')).toBe('CHAI10');
    expect(validatePromoCode('mist')).toBe('MIST');
    expect(validatePromoCode(' MIST ')).toBe('MIST');
    expect(validatePromoCode('nope')).toBeNull();
    expect(validatePromoCode('')).toBeNull();
  });
});

describe('checkoutContactSchema', () => {
  const valid = {
    email: 'a@b.co',
    firstName: 'Ram',
    lastName: 'Sharma',
    phone: '+977 1 555 01971',
    address: 'Baluwatar 12',
    city: 'Kathmandu',
    district: 'Kathmandu',
    deliveryOption: 'standard' as const,
  };
  it('passes a fully valid contact form', () => {
    const res = checkoutContactSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });
  it('fails an invalid email', () => {
    const res = checkoutContactSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(res.success).toBe(false);
  });
  it('fails an unknown district', () => {
    const res = checkoutContactSchema.safeParse({ ...valid, district: 'Atlantis' });
    expect(res.success).toBe(false);
  });
  it('rejects empty fields', () => {
    const res = checkoutContactSchema.safeParse({ ...valid, firstName: '   ' });
    expect(res.success).toBe(false);
  });
});

describe('cardDetailsSchema', () => {
  it('accepts card with valid fields', () => {
    const res = cardDetailsSchema.safeParse({
      method: 'card',
      number: '4242 4242 4242 4242',
      name: 'Ram Sharma',
      expiry: '12/28',
      cvc: '123',
    });
    expect(res.success).toBe(true);
  });
  it('rejects short card numbers', () => {
    const res = cardDetailsSchema.safeParse({
      method: 'card',
      number: '4242',
      name: 'Ram',
      expiry: '12/28',
      cvc: '12',
    });
    expect(res.success).toBe(false);
  });
  it('ignores card fields when method is not card', () => {
    const res = cardDetailsSchema.safeParse({ method: 'cod' });
    expect(res.success).toBe(true);
  });
});
