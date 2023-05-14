import { useEffect, useState } from 'react';
import { solG2 } from '@thehubbleproject/bls/dist/mcl';
import PaymentChannel, { Payment } from '../PaymentChannel';
import calculateSignaturesNeeded from '../utils/calculateSignaturesNeeded';
import { BigNumber, ethers } from 'ethers';
import CompletedTransaction from '../components/CompletedTransaction';

const oneToken = BigNumber.from(10).pow(18);
const BALANCE = oneToken.mul(1000);

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
        Balance:{' '}
        {ethers.utils.formatEther(
          BALANCE.sub(payment ? BigNumber.from(payment.amount) : 0),
        )}
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

            <CompletedTransaction
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
