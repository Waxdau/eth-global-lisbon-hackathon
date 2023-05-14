import { BigNumber, ethers } from 'ethers';
import { FormEvent } from 'react';
import createWallet from '../createWallet';
import { solG2 } from '@thehubbleproject/bls/dist/mcl';
import AppContext from '../AppContext';

interface CreateWalletFieldProps {
  label: string;
  name: string;
}

export default function Page() {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    const walletAddress = await createWallet(pubKeys);
    AppContext.setWalletAddress(walletAddress);

    location.href = `/wallet?address=${walletAddress}`;
  };

  return (
    <div className="space-y-12">
      <div className="border-b border-white/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-white">Wallet</h2>
        Balance:
      </div>
    </div>
  );
}
