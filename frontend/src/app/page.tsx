'use client';

import NewTransactionButton from './components/NewTransactionButton';
import { ethers, Wallet } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { ERC4337EthersProvider } from '@account-abstraction/sdk';
import { wrapProvider } from './account/wrapProvider';
import './debug';

const hardHatPrivateKey =
  '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';
const aaPrivateKey =
  '0x8d011e5c49dfeebde11b597b77f1a363968a376bd97c5dc716c3b2c111d1ec56';
const entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const bundlerUrl = 'http://localhost:3000/rpc';
const rpcUrl = 'http://localhost:8545';

export default function Home() {
  const { provider, hhSigner } = useMemo(() => {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
      name: 'localhost',
      chainId: 31337,
    });
    const hhSigner = new Wallet(hardHatPrivateKey, provider);

    return { provider, hhSigner };
  }, []);

  const [aaProvider, setAaProvider] = useState<
    ERC4337EthersProvider | undefined
  >();
  const [address, setAddress] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();
  const [hhBalance, setHhBalance] = useState<string | undefined>();

  useEffect(() => {
    const getAaProvider = async () => {
      const aaSigner = new Wallet(aaPrivateKey, provider);
      const tempAaProvider = await wrapProvider(
        provider,
        {
          entryPointAddress,
          bundlerUrl,
        },
        aaSigner,
      );

      const balance = await tempAaProvider.getBalance(
        await tempAaProvider.getSigner().getAddress(),
      );
      console.log('aabalance address: ', {
        balance,
        address: aaSigner.address,
      });
      const hhBalance = await provider.getBalance(hhSigner.address);
      setHhBalance(hhBalance.toString());
      setBalance(balance.toString());
      setAaProvider(tempAaProvider);
      setAddress(await tempAaProvider.getSigner().getAddress());
    };
    getAaProvider();
  }, [provider, hhSigner]);

  const fundWallet = async () => {
    if (!aaProvider) return;
    const accountAddress = await aaProvider.getSigner().getAddress();
    console.log('Funding wallet', accountAddress);
    const tx = await hhSigner.sendTransaction({
      to: accountAddress,
      value: ethers.utils.parseEther('1.0'),
    });
    await tx.wait();
    console.log('tx complete');
  };

  return (
    <main className="flex items-center justify-between p-24">
      <div>
        <p>Hardhat wallet: {hhSigner.address}</p>
        <p>
          Hardhat balance: {hhBalance ? ethers.utils.formatEther(hhBalance) : 0}
        </p>
        <button onClick={fundWallet}>Fund AA wallet</button>
      </div>
      <div>
        <div>
          Smart Account Balance:{' '}
          {balance ? ethers.utils.formatEther(balance) : 0}
        </div>
        <div>Address: {address}</div>
        <div>
          <NewTransactionButton provider={aaProvider} />
        </div>
      </div>
      <div>
        <h2>Accounts</h2>
        <div>0x1234</div>
        <div>0x1234</div>
        <div>0x1234</div>
      </div>
    </main>
  );
}
