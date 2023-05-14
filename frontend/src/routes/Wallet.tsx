import { useEffect, useState } from 'react';
import { solG2 } from '@thehubbleproject/bls/dist/mcl';
import Transaction from '../components/Transaction';
import PaymentChannel, { Payment } from '../PaymentChannel';
import calculateSignaturesNeeded from '../utils/calculateSignaturesNeeded';

export default function Page() {
  const [payment, setPayment] = useState<Payment | undefined>();
  const [publicKeys, setPublicKeys] = useState<solG2[]>([]);

  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');

  useEffect(() => {
    const getPayment = async () => {
      if (!id) return;
      const channel = new PaymentChannel(id);
      const tempPayment = await channel.getPayment();
      const signedTx = await channel.getSignedPayment();
      setPublicKeys(signedTx.publicKeys);
      setPayment(tempPayment);
    };
    getPayment();
  }, [id]);

  const sigsNeeded = payment && calculateSignaturesNeeded(payment);

  let sigsRemaining: number | undefined = undefined;

  if (sigsNeeded !== undefined) {
    sigsRemaining = sigsNeeded - publicKeys.length;
  }

  return (
    <div className="space-y-12">
      <div className="border-b border-white/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-white">Wallet</h2>
        Balance:
      </div>
      {(() => {
        if (
          payment === undefined ||
          sigsNeeded === undefined ||
          sigsRemaining === undefined
        ) {
          return null;
        }

        return (
          <div className="border-b border-white/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-white">
              Recent Transactions:
            </h2>

            <Transaction
              to={payment.to}
              token={payment.token}
              description={payment.description}
              amount={payment.amount}
              numSigned={publicKeys.length}
              sigsNeeded={sigsNeeded}
            />
          </div>
        );
      })()}
    </div>
  );
}
