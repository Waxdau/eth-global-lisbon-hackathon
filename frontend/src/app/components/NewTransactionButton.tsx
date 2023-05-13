"use client";
import { ERC4337EthersProvider } from "@account-abstraction/sdk";
import { ethers } from "ethers";

interface NewTransactionButtonProps {
  provider: ERC4337EthersProvider | undefined;
}

const entryPointAddress = "";
const chainId = 31337;
const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Hardhat Account 2
const factoryAddress = "";

const NewTransactionButton = ({ provider }: NewTransactionButtonProps) => {
  const newTransaction = async () => {
    console.log("Pressed the button");

    // FIXME: non null assertion when provider could be null
    const signer = provider!.getSigner();
    const transaction = await signer.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther("1"),
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
