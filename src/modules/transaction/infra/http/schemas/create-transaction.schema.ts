import { z } from 'zod';

const moneySchema = z
  .number({
    message: 'value must be a number',
  })
  .positive('value must be greater than zero')
  .refine(
    value => Math.abs(value * 100 - Math.round(value * 100)) < 1e-9,
    'value supports at most two decimal places'
  )
  .max(1_000_000, 'value must be lower than or equal to 1000000');

const cardExpirationDateSchema = z
  .string()
  .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'card_expiration_date must use MM/YY format')
  .transform(value => {
    const [month, shortYear] = value.split('/').map(Number);

    const year = 2000 + (shortYear ?? 0);
    const lastDayOfMonth = new Date(Date.UTC(year, month ?? 1, 0));

    return lastDayOfMonth;
  })
  .refine(
    date => date.getTime() >= Date.now(),
    'card_expiration_date must be in the future'
  );

const cardNumberSchema = z.coerce
  .string({ message: 'card_number must be a string of digits' })
  .transform(value => value.replace(/[\s-]/g, ''))
  .pipe(
    z
      .string()
      .regex(/^\d{12,19}$/, 'card_number must have between 12 and 19 digits')
  );

const cardVerificationCodeSchema = z.coerce
  .string({ message: 'card_verification_code must be a string of digits' })
  .pipe(z.string().regex(/^\d{3,4}$/, 'card_verification_code must have 3 or 4 digits'));

export const createTransactionSchema = z.object({
  description: z.string().trim().min(1).max(255).optional(),
  payment_method: z.enum(['debit_card', 'credit_card'], {
    message: "payment_method must be 'debit_card' or 'credit_card'",
  }),
  card_number: cardNumberSchema,
  card_holder_name: z
    .string()
    .trim()
    .min(3, 'card_holder_name must have at least 3 characters')
    .max(100),
  card_expiration_date: cardExpirationDateSchema,
  card_verification_code: cardVerificationCodeSchema,
  value: moneySchema,
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
