import { once } from '@s-libs/micro-dash';
import { signer } from '@thehubbleproject/bls';
import makeId from '@/utils/makeId';
import blsDomain from './blsDomain';
import { ethers } from 'ethers';
import PaymentChannel, { Payment } from './PaymentChannel';
import { useEffect, useState } from 'react';

export default class AppContext {
  static getSingleton = once(async () => {
    // Calls mcl.init underneath. Some unrelated operations also need this.
    const signerFactory = await signer.BlsSignerFactory.new();

    let seedId = localStorage.getItem('seed-id');

    if (seedId === null) {
      seedId = makeId();
      localStorage.setItem('seed-id', seedId);
    }

    return new AppContext(
      signerFactory.getSigner(
        blsDomain,
        ethers.utils.hexlify(new TextEncoder().encode(seedId)),
      ),
    );
  });

  static use = () => {
    const [appContext, setAppContext] = useState<AppContext>();

    useEffect(() => {
      AppContext.getSingleton().then(setAppContext);
    }, []);

    return appContext;
  };

  constructor(public signer: signer.BlsSignerInterface) {}

  async addSignature(paymentChannel: PaymentChannel, payment: Payment) {
    const encodedPayment = PaymentChannel.encodePayment(payment);

    const signature = this.signer.sign(ethers.utils.hexlify(encodedPayment));

    await paymentChannel.addSignature(this.signer.pubkey, signature);
  }
}
