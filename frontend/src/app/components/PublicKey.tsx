'use client';
import { UserIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import AppContext from '../AppContext';
import { ethers } from 'ethers';

const PublicKey = () => {
  const appContext = AppContext.use();

  const publicKey =
    appContext &&
    ethers.utils.defaultAbiCoder.encode(
      ['uint256', 'uint256', 'uint256', 'uint256'],
      appContext.signer.pubkey,
    );

  const copyPublicKey = () => {
    if (publicKey === undefined) {
      return;
    }

    navigator.clipboard.writeText(publicKey);
  };

  return (
    <div className="flex flex-col h-16 shrink-0 mt-4">
      <div className="flex">
        <UserIcon className="h-6 w-6 shrink-0 pr-2" aria-hidden="true" />
        BLS Public Key
      </div>

      <div className="flex items-center my-2">
        <span className="bg-gray-800 rounded-lg px-4 py-1 mr-2 text-ellipsis">
          {publicKey ?? 'Loading...'}
        </span>

        <button onClick={copyPublicKey}>
          <DocumentDuplicateIcon
            className="h-6 w-6 shrink-0 pr-2"
            aria-hidden="true"
            cursor="pointer"
          />
        </button>
      </div>
    </div>
  );
};

export default PublicKey;
