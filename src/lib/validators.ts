import { z } from 'zod';

export const districtOptions = [
  'Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura',
  'Banke', 'Bara', 'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitwan',
  'Dadeldhura', 'Dailekh', 'Dang', 'Darchula', 'Dhading', 'Dhankuta',
  'Dhanusha', 'Dolakha', 'Dolpa', 'Doti', 'Gorkha', 'Gulmi',
  'Humla', 'Ilam', 'Jajarkot', 'Jhapa', 'Jumla', 'Kailali',
  'Kalikot', 'Kapilvastu', 'Kaski', 'Kathmandu', 'Kavrepalanchok', 'Khotang',
  'Lalitpur', 'Lamjung', 'Mahottari', 'Makwanpur', 'Manang', 'Morang',
  'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi East', 'Nawalparasi West', 'Nuwakot',
  'Okhaldhunga', 'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan',
  'Ramechhap', 'Rasuwa', 'Rautahat', 'Rolpa', 'Rukum East', 'Rukum West',
  'Rupandehi', 'Salyan', 'Sankhuwasabha', 'Saptari', 'Sarlahi', 'Sindhuli',
  'Sindhupalchok', 'Siraha', 'Solukhumbu', 'Sunsari', 'Surkhet', 'Syangja',
  'Tanahu', 'Taplejung', 'Terhathum', 'Udayapur',
] as const;

export type District = (typeof districtOptions)[number];

export const promoCodeSchema = z.union([
  z.literal('CHAI10'),
  z.literal('MIST'),
]);

export type PromoCode = z.infer<typeof promoCodeSchema>;

export const checkoutContactSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  firstName: z.string().trim().min(1, 'First name is required.').max(60),
  lastName: z.string().trim().min(1, 'Last name is required.').max(60),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number is too short.')
    .regex(/^[+\d\s-]{7,20}$/, 'Enter a valid phone number.'),
  address: z.string().trim().min(3, 'Street address is too short.').max(200),
  city: z.string().trim().min(2, 'City is required.').max(80),
  district: z.enum(districtOptions, {
    errorMap: () => ({ message: 'Please select a district.' }),
  }),
  deliveryOption: z.enum(['standard', 'express', 'kathmandu'], {
    errorMap: () => ({ message: 'Please select a delivery option.' }),
  }),
});

export type CheckoutContact = z.infer<typeof checkoutContactSchema>;

export const cardDetailsSchema = z
  .object({
    method: z.enum(['card', 'esewa', 'khalti', 'cod']),
    number: z.string().trim().optional(),
    name: z.string().trim().optional(),
    expiry: z.string().trim().optional(),
    cvc: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.method !== 'card') return;
    if (!val.number || !/^\d{13,19}$/.test(val.number.replace(/\s+/g, ''))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['number'],
        message: 'Enter a valid card number.',
      });
    }
    if (!val.name || val.name.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: 'Cardholder name is required.',
      });
    }
    if (!val.expiry || !/^\d{2}\/\d{2}$/.test(val.expiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expiry'],
        message: 'Use MM / YY format.',
      });
    }
    if (!val.cvc || !/^\d{3,4}$/.test(val.cvc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cvc'],
        message: '3 or 4 digits.',
      });
    }
  });

export type CardDetails = z.infer<typeof cardDetailsSchema>;

export function validatePromoCode(code: string): PromoCode | null {
  const res = promoCodeSchema.safeParse(code.trim().toUpperCase());
  return res.success ? res.data : null;
}
