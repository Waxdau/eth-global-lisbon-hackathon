import { solG2 } from '@thehubbleproject/bls/dist/mcl';
import { BLSGroupVerifier__factory } from 'account-abstraction';
import AppContext from './AppContext';

export default async function createWallet(
  ctx: AppContext,
  _publicKeys: solG2[],
) {
  const blsGroupVerifier = await new BLSGroupVerifier__factory(
    ctx?.hhSigner,
  ).deploy();
  await blsGroupVerifier.deployed();

  // TODO Pass in keys, attach group to safe contract
  const setupGroup = await blsGroupVerifier.setupGroup([]);
  await setupGroup.wait();

  return '0x0000006789000000000000000000001234001234';
}
