import { BigNumber, ethers } from 'ethers';

const statuses = {
  green: 'text-green-700 bg-green-50 ring-green-600/20',
  gray: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  red: 'text-red-700 bg-red-50 ring-red-600/10',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <img
          src="./transaction.svg"
          alt={token}
          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
        />
        <div className="flex-auto">
          <div className="text-sm font-medium leading-6 text-gray-900">
            Token: {token}
          </div>
          <div className="text-xs font-medium leading-6 text-gray-900">
            {description}
          </div>
        </div>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">To:</dt>
          <dd className="text-gray-700">
            <p>{to}</p>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Amount</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900">
              {ethers.utils.formatEther(BigNumber.from(amount))}
            </div>
            <div
              className={classNames(
                (statuses as any)[numSigned < sigsNeeded ? 'red' : 'green'],
                'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset',
              )}
            >
              {numSigned}/{sigsNeeded} signed
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
}
