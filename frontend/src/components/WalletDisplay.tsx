import { DocumentDuplicateIcon, WalletIcon } from '@heroicons/react/24/outline';
import AppContext from '../AppContext';

function formatCompactAddress(address: string): string {
  return `0x${address.slice(2, 6)}...${address.slice(-4)}`;
}

const WalletDisplay = () => {
  const appContext = AppContext.use();
  const walletAddress = appContext?.walletAddress;

  if (walletAddress === undefined) {
    return <></>;
  }

  const copyPublicKey = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className="flex flex-col h-16 shrink-0 mt-4">
      <div
        className="flex wallet-side"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          location.href = '/wallet';
        }}
      >
        <WalletIcon className="h-6 w-6 shrink-0 pr-2" aria-hidden="true" />
        Wallet
      </div>

      <div className="flex items-center my-2">
        <span className="bg-gray-800 rounded-lg px-4 py-1 mr-2 text-ellipsis">
          {walletAddress ? formatCompactAddress(walletAddress) : 'Loading...'}
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

export default WalletDisplay;
