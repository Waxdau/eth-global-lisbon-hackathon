import { BigNumber } from 'ethers';
import { Payment } from '../PaymentChannel';

const oneToken = BigNumber.from(10).pow(18);

export default function calculateSignaturesNeeded(payment: Payment) {
  const amount = BigNumber.from(payment.amount);

  if (amount.lt(oneToken.mul(50))) {
    return 1;
  }

  if (amount.lt(oneToken.mul(500))) {
    return 2;
  }

  return 3;
}
