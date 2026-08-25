import { PaymentMethod } from '@/modules/transaction/domain/entities/transaction/transaction';

export const CREDIT_INSTALLMENTS = 4;

export const FEE_RATE_BY_PAYMENT_METHOD: Record<PaymentMethod, number> = {
  debit_card: 0.03,
  credit_card: 0.05,
};
