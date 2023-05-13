import { once } from '@s-libs/micro-dash';
import { signer } from '@thehubbleproject/bls';
import makeId from '@/utils/makeId';
import * as io from 'io-ts';
import blsDomain from './blsDomain';
import { ethers } from 'ethers';
import { solG1 } from '@thehubbleproject/bls/dist/mcl';

const Payment = io.type({
  token: io.string,
  to: io.string,
  amount: io.number,
  description: io.string,
});

type Payment = io.TypeOf<typeof Payment>;

export default class AppContext {
  static getSingleton = once(async () => {
    // Calls mcl.init underneath. Some unrelated operations also need this.
    const signerFactory = await signer.BlsSignerFactory.new();

    let seedId = localStorage.getItem('seed-id');

    if (seedId === null) {
      seedId = makeId();
      localStorage.setItem('seed-id', seedId);
    }

    return new AppContext(signerFactory.getSigner(blsDomain, seedId));
  });

  constructor(public signer: signer.BlsSignerInterface) {}

  /**
   * Aggregate these with:
   *
   * ```ts
   * import { signer } from '@thehubbleproject/bls';
   *
   * const sig1 = ctx.signPayment(payment1);
   * const sig2 = ctx.signPayment(payment2);
   *
   * const aggSig = signer.aggregate([sig1, sig2]);
   * ```
   */
  signPayment(payment: Payment): solG1 {
    const encodedPayment = AppContext.encodePayment(payment);

    return this.signer.sign(ethers.utils.hexlify(encodedPayment));
  }

  private static encodePayment(payment: Payment) {
    // TODO: Get the actual message that needs to be signed
    return new TextEncoder().encode(JSON.stringify(payment));
  }
}
