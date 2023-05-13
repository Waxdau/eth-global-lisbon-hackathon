import { JsonRpcProvider } from '@ethersproject/providers';
import {
  EntryPoint__factory,
  EIP4337Manager__factory,
  GnosisSafe__factory,
  GnosisSafeProxyFactory__factory,
  GnosisSafeAccountFactory__factory,
} from 'account-abstraction';
import {
  ClientConfig,
  ERC4337EthersProvider,
  HttpRpcClient,
  DeterministicDeployer,
} from '@account-abstraction/sdk';
import { Signer } from '@ethersproject/abstract-signer';
import Debug from 'debug';

import { AccountAPI } from './AccountAPI';

const debug = Debug('aa.bls.wrapProvider');

/**
 * wrap an existing provider to tunnel requests through Account Abstraction.
 * @param originalProvider the normal provider
 * @param config see ClientConfig for more info
 * @param originalSigner use this signer as the owner. of this wallet. By default, use the provider's signer
 */
export async function wrapProvider(
  originalProvider: JsonRpcProvider,
  config: ClientConfig,
  originalSigner: Signer = originalProvider.getSigner(),
): Promise<ERC4337EthersProvider> {
  const entryPoint = EntryPoint__factory.connect(
    config.entryPointAddress,
    originalProvider,
  );
  const detDeployer = new DeterministicDeployer(originalProvider);
  const eip4337ManagerAddress = await detDeployer.deterministicDeploy(
    new EIP4337Manager__factory(),
    0,
    [entryPoint.address],
  );
  const safeSingletonAddress = await detDeployer.deterministicDeploy(
    new GnosisSafe__factory(),
    0,
    [],
  );
  const proxyFactoryAddress = await detDeployer.deterministicDeploy(
    new GnosisSafeProxyFactory__factory(),
    0,
    [],
  );
  const gnosisSafeAccountFactoryAddress = await detDeployer.deterministicDeploy(
    new GnosisSafeAccountFactory__factory(),
    0,
    [proxyFactoryAddress, safeSingletonAddress, eip4337ManagerAddress],
  );

  const smartAccountAPI = new AccountAPI({
    provider: originalProvider,
    entryPointAddress: entryPoint.address,
    owner: originalSigner,
    eip4337ManagerAddress,
    gnosisSafeAccountFactoryAddress,
    paymasterAPI: config.paymasterAPI,
  });
  debug('config=', config);
  const chainId = await originalProvider
    .getNetwork()
    .then((net) => net.chainId);
  const httpRpcClient = new HttpRpcClient(
    config.bundlerUrl,
    config.entryPointAddress,
    chainId,
  );
  return await new ERC4337EthersProvider(
    chainId,
    config,
    originalSigner,
    originalProvider,
    httpRpcClient,
    entryPoint,
    smartAccountAPI,
  ).init();
}
