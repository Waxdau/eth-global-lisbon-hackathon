export default function Page() {
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            Sign Group Transaction?
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400 pb-6">
            This transaction needs 3 of 5 signatures.
          </p>
          <Transaction />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Add signature
        </button>
      </div>
    </form>
  );
}

const statuses = {
  green: 'text-green-700 bg-green-50 ring-green-600/20',
  gray: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  red: 'text-red-700 bg-red-50 ring-red-600/10',
};
const transaction = {
  id: 1,
  name: 'Transaction id: 1',
  txIcon: './transaction.svg',
  txData: {
    to: 'December 13, 2022',
    amount: '1.0',
    status: 'red',
    statusText: '1/5 signed',
  },
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
const Transaction = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <img
          src={transaction.txIcon}
          alt={transaction.name}
          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
        />
        <div className="text-sm font-medium leading-6 text-gray-900">
          {transaction.name}
        </div>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">To:</dt>
          <dd className="text-gray-700">
            <p>0x6E60714FCC05a958803B2C0AB9Ae65acFfead135</p>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Amount</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900">
              {transaction.txData.amount}
            </div>
            <div
              className={classNames(
                (statuses as any)[transaction.txData.status],
                'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset',
              )}
            >
              {transaction.txData.statusText}
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
};
