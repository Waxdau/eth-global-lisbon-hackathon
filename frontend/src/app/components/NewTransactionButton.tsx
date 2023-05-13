"use client";
import { ERC4337EthersProvider } from "@account-abstraction/sdk";
import { ethers } from "ethers";

interface NewTransactionButtonProps {
  provider: ERC4337EthersProvider | undefined;
}

const entryPointAddress = "";
const chainId = 31337;
const recipient = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Hardhat Account 3/4?
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
