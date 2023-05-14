import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { BigNumber, ethers } from 'ethers';

export default function Transaction({
  token,
  to,
  amount,
  description,
  numSigned,
  sigsNeeded,
}: {
  token: string;
  to: string;
  amount: string;
  description: string;
  numSigned: number;
  sigsNeeded: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
      style={{ filter: 'invert(0.9)' }}
    >
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <CheckCircleIcon className="h-12 w-12 text-black" aria-hidden="true" />
        <div className="flex-auto">
          <div className="text-md font-medium leading-6 text-gray-900">
            {description}
          </div>
          <div className="text-gray-900" style={{ marginTop: '1rem' }}>
            -{ethers.utils.formatEther(BigNumber.from(amount))}
          </div>
          <div
            className="text-sm font-medium leading-6 text-gray-900"
            style={{ marginTop: '1rem' }}
          >
            <span style={{ display: 'inline-block', width: '3.5rem' }}>
              Token:{' '}
            </span>
            <span style={{ fontFamily: 'monospace' }}>{token}</span>
          </div>

          <div className="text-sm font-medium leading-6 text-gray-900">
            <span style={{ display: 'inline-block', width: '3.5rem' }}>
              To:{' '}
            </span>
            <span style={{ fontFamily: 'monospace' }}>{to}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
