"use client";
import { ERC4337EthersProvider } from "@account-abstraction/sdk";
import { ethers } from "ethers";

interface NewTransactionButtonProps {
  provider: ERC4337EthersProvider | undefined;
}

const recipient = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Hardhat Account 3/4?

const NewTransactionButton = ({ provider }: NewTransactionButtonProps) => {
  const newTransaction = async () => {
    if (!provider) return;
    console.log("Pressed the button");

    const signer = provider.getSigner();
    const transaction = await signer.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther("0.5"),
      data: '0x'
    });
    const reciept = await transaction.wait();
    console.log("reciept", reciept);
  };

  return (
    <button onClick={newTransaction} className="p-2 rounded-lg bg-green-500">
      New Transaction
    </button>
  );
};
export default NewTransactionButton;
