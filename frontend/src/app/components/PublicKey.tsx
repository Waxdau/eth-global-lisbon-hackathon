'use client';
import { UserIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface PublicKeyProps {
  publicKey: string;
}

const PublicKey = ({ publicKey }: PublicKeyProps) => {
  const copyPublicKey = () => {
    navigator.clipboard.writeText(publicKey);
  };

  return (
    <div className="flex flex-col h-16 shrink-0 mt-4">
      <div className="flex">
        <UserIcon className="h-6 w-6 shrink-0 pr-2" aria-hidden="true" />
        BLS Public Key
      </div>

      <div className="flex items-center my-2">
        <span className="bg-gray-800 rounded-lg px-4 py-1 mr-2">
          {publicKey}
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
