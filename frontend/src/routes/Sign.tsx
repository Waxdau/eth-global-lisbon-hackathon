import { useEffect, useState } from 'react';
import { solG2 } from '@thehubbleproject/bls/dist/mcl';
import PaymentChannel, { Payment } from '../PaymentChannel';
import Transaction from '../components/Transaction';
import AppContext from '../AppContext';
import calculateSignaturesNeeded from '../utils/calculateSignaturesNeeded';

export default function Page() {
  const appContext = AppContext.use();
  const [payment, setPayment] = useState<Payment | undefined>();
  const [publicKeys, setPublicKeys] = useState<solG2[]>([]);
  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');

  useEffect(() => {
    const getPaymentData = async () => {
      if (!id) return;
      const channel = new PaymentChannel(id);
      const tempPayment = await channel.getPayment();
      const signedTx = await channel.getSignedPayment();
      setPublicKeys(signedTx.publicKeys);
      setPayment(tempPayment);
    };
    getPaymentData();
  }, []);

  const addSignature = async () => {
    if (!appContext || !payment || !id) return;
    const channel = new PaymentChannel(id);
    await appContext.addSignature(channel, payment);
    window.location.reload();
  };

  const userSigned = publicKeys.find(
    (pk) => pk.join('') === appContext?.signer.pubkey.join(''),
  );

  if (!payment)
    return (
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            No transaction to sign!
          </h2>
        </div>
      </div>
    );

  const sigsNeeded = calculateSignaturesNeeded(payment);

  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-white">
            Sign Group Transaction
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400 pb-6">
            This transaction needs {sigsNeeded} signatures.
          </p>
          <Transaction
            to={payment.to}
            token={payment.token}
            description={payment.description}
            amount={payment.amount}
            numSigned={publicKeys.length}
            sigsNeeded={sigsNeeded}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        {userSigned ? (
          <div>You have already signed!</div>
        ) : (
          <button
            type="submit"
            disabled={!!userSigned}
            onClick={(e) => {
              e.preventDefault();
              addSignature();
            }}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Add signature
          </button>
        )}
      </div>
    </form>
  );
}
