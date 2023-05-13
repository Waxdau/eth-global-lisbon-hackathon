'use client';

import NewTransactionButton from './components/NewTransactionButton';
import { ethers } from 'ethers';
import './debug';
import CreateWalletForm from './components/CreateWalletForm';
import AppContext from './AppContext';

import './index.css';

export default function Home() {
  const appContext = AppContext.use();

  if (!appContext) {
    return <div>Loading...</div>;
  }

  const hhBalance = appContext.hhBalance;
  const balance = appContext.balance
    ? ethers.utils.formatEther(appContext?.balance)
    : 0;

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <CreateWalletForm />
      <div className="flex flex-col mt-10">
        <h1 className="text-xl">OLD UI TO TEST BUNDLE</h1>
        <p>Press the fund wallet button and then the new transaction button</p>

        <p className="mt-8">Hardhat wallet: {appContext.hhSigner.address}</p>
        <p>
          Hardhat balance: 
          {/* {hhBalance ? ethers.utils.formatEther(hhBalance) : 0} */}
        </p>
        <button
          onClick={appContext?.fundWallet}
          className="p-2 rounded-lg bg-green-500"
        >
          Fund AA wallet
        </button>
      </div>

      <div className="flex flex-col mt-8">
        <div>
          Smart Account Balance:{' '}
          {/* {balance ? ethers.utils.formatEther(balance) : 0} */}
        </div>
        <div>Address: {appContext.address}</div>
        <div>
          <NewTransactionButton provider={appContext.aaProvider} />
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
