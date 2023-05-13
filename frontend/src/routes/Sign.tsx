import { useEffect, useState } from 'react';
import PaymentChannel, { Payment } from '../PaymentChannel';
import Transaction from '../components/Transaction';
import AppContext from '../AppContext';

export default function Page() {
  const appContext = AppContext.use();
  const [payment, setPayment] = useState<Payment | undefined>();
  const channel = new PaymentChannel('kn68khjqqm3bf473tkrbd1633');

  useEffect(() => {
    const getPaymentData = async () => {
      const tempPayment = await channel.getPayment();
      setPayment(tempPayment);
    };
    getPaymentData();
  }, []);

  const addSignature = async () => {
    if (!appContext || !payment) return;
    appContext.addSignature(channel, payment);
  };

  if (!payment) return null;

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
          <Transaction
            to={payment.to}
            token={payment.token}
            description={payment.description}
            amount={payment.amount}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          onClick={addSignature}
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Add signature
        </button>
      </div>
    </form>
  );
}
