'use client';
import { ERC4337EthersProvider } from '@account-abstraction/sdk';
import { ethers } from 'ethers';

interface NewTransactionButtonProps {
  provider: ERC4337EthersProvider | undefined;
}

const recipient = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';

const NewTransactionButton = ({ provider }: NewTransactionButtonProps) => {
  const newTransaction = async () => {
    if (!provider) return;
    console.log('Pressed the button');

    const signer = provider.getSigner();
    const transaction = await signer.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther('0.5'),
      data: '0x',
    });
    const reciept = await transaction.wait();
    console.log('reciept', reciept);

    const recieptBalance = await provider.getBalance(recipient);
    console.log('recieptBalance', ethers.utils.formatEther(recieptBalance));
  };

  return (
    <button onClick={newTransaction} className="p-2 rounded-lg bg-green-500">
      New Transaction
    </button>
  );
};
export default NewTransactionButton;
