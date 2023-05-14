import { solG2 } from '@thehubbleproject/bls/dist/mcl';
import AppContext from './AppContext';
import { AccountAPI } from './account/AccountAPI';

export default async function createWallet(
  ctx: AppContext,
  _publicKeys: solG2[],
) {
  const accountApi = ctx.aaProvider?.smartAccountAPI as AccountAPI;
  await accountApi.eip4337Manager.blsVerifier.setupGroup(_publicKeys);

  await accountApi.getNonce();
  return accountApi.accountContract?.address;
}
