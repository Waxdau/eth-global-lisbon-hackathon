import { BigNumber, ethers } from 'ethers';
import { FormEvent } from 'react';
import createWallet from '../createWallet';
import { solG2 } from '@thehubbleproject/bls/dist/mcl';
import AppContext from '../AppContext';

interface CreateWalletFieldProps {
  label: string;
  name: string;
}

const SetupWalletField = ({ label, name }: CreateWalletFieldProps) => (
  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <div className="sm:col-span-4">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <label
            htmlFor={name}
            className="block text-sm font-medium leading-6 text-white"
            style={{ textAlign: 'center', justifyContent: 'center' }}
          >
            {label}
          </label>
        </div>
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <input
            id={name}
            name={name}
            type={name}
            autoComplete={name}
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  </div>
);

export default function Page() {
  const appContext = AppContext.use();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (appContext === undefined) {
      return;
    }

    const pubKey1 = event.currentTarget.elements.namedItem(
      'public-key-1',
    ) as HTMLInputElement;
    const pubKey2 = event.currentTarget.elements.namedItem(
      'public-key-2',
    ) as HTMLInputElement;
    const pubKey3 = event.currentTarget.elements.namedItem(
      'public-key-3',
    ) as HTMLInputElement;
    const pubKey4 = event.currentTarget.elements.namedItem(
      'public-key-4',
    ) as HTMLInputElement;
    const pubKey5 = event.currentTarget.elements.namedItem(
      'public-key-5',
    ) as HTMLInputElement;

    const pubKeyStrings = [
      pubKey1.value,
      pubKey2.value,
      pubKey3.value,
      pubKey4.value,
      pubKey5.value,
    ];

    const pubKeys = pubKeyStrings
      .filter((str) => str !== '')
      .map(
        (str) =>
          ethers.utils.defaultAbiCoder
            .decode(['uint256', 'uint256', 'uint256', 'uint256'], str)
            .map((x: BigNumber) => x.toHexString()) as solG2,
      );

    const walletAddress = await createWallet(appContext, pubKeys);

    AppContext.setWalletAddress(walletAddress);

    location.href = '/wallet';
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            Create a Wallet
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Enter the BLS public keys that should have access to this wallet.
          </p>

          <SetupWalletField name="public-key-1" label="Key 1" />
          <SetupWalletField name="public-key-2" label="Key 2" />
          <SetupWalletField name="public-key-3" label="Key 3" />
          <SetupWalletField name="public-key-4" label="Key 4" />
          <SetupWalletField name="public-key-5" label="Key 5" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-x-6">
        <button
          type="submit"
          className="rounded-xl bg-green-500 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Create
        </button>
      </div>
    </form>
  );
}
