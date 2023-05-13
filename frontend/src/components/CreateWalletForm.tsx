interface CreateWalletFieldProps {
  label: string;
  name: string;
}

const CreateWalletField = ({ label, name }: CreateWalletFieldProps) => (
  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <div className="sm:col-span-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-white"
      >
        {label}
      </label>
      <div className="mt-2">
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
);

export default function Page() {
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            Create Multi-sig
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Create a Multi-sig wallet with a list of addresses and a threshold
          </p>

          <CreateWalletField name="address" label="Signer public key 1" />
          <CreateWalletField name="address" label="Signer public key 2" />
          <CreateWalletField name="address" label="Signer public key 3" />
          <CreateWalletField name="address" label="Signer public key 4" />
          <CreateWalletField name="address" label="Signer public key 5" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-xl bg-green-500 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Create Wallet
        </button>
      </div>
    </form>
  );
}
