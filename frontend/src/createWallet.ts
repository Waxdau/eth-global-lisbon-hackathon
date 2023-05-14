import { solG2 } from '@thehubbleproject/bls/dist/mcl';
import AppContext from './AppContext';
import { AccountAPI } from './account/AccountAPI';
import { BLSGroupVerifier__factory } from 'account-abstraction';
import { ethers } from 'ethers';

export default async function createWallet(
  ctx: AppContext,
  publicKeys: solG2[],
) {
  const accountApi = ctx.aaProvider?.smartAccountAPI as AccountAPI;
  const provider = ctx.aaProvider;

  const fundAccountTransaction = await ctx.hhSigner.sendTransaction({
    to: await provider.getSigner().getAddress(),
    value: ethers.utils.parseEther('10'),
    data: '0x',
  });
  await fundAccountTransaction.wait();

  const blsVerifier = BLSGroupVerifier__factory.connect(
    await accountApi.eip4337Manager.blsVerifier(),
    provider.getSigner(),
  );

  await blsVerifier.setupGroup(publicKeys);

  await accountApi.getNonce();
  return accountApi.accountContract?.address;
}
