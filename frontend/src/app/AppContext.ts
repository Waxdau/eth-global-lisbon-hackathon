import { once } from '@s-libs/micro-dash';
import { signer } from '@thehubbleproject/bls';
import blsDomain from './blsDomain';
import makeId from '@/utils/makeId';

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
}
