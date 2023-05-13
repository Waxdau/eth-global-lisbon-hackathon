"use client";

import NewTransactionButton from "./components/NewTransactionButton";
import Channel from "../utils/Channel";
import { ethers, Wallet } from "ethers";
import { useEffect, useState } from "react";
import { wrapProvider, ERC4337EthersProvider } from "@account-abstraction/sdk";

(globalThis as any).Channel = Channel;

const privateKey =
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const bundlerUrl = "http://localhost:3000/rpc";
const rpcUrl = "http://localhost:8545";

export default function Home() {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
    name: "localhost",
    chainId: 31337,
  });
  const signer = new Wallet(privateKey, provider);
  const [aaProvider, setAaProvider] = useState<
    ERC4337EthersProvider | undefined
  >();
  const [address, setAddress] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();

  useEffect(() => {
    const getAaProvider = async () => {
      const tempAaProvider = await wrapProvider(
        provider,
        {
          entryPointAddress,
          bundlerUrl,
        },
        signer
      );

      const balance = await tempAaProvider.getBalance(signer.address);
      console.log(balance.toString());
      setBalance(balance.toString());
      setAaProvider(tempAaProvider);
      setAddress(await tempAaProvider.getSigner().getAddress());
    };
    getAaProvider();
  }, []);

  return (
    <main className="flex items-center justify-between p-24">
      <div>
        <div>Multi-sig Balance: {ethers.utils.formatEther(balance)}</div>
        <div>Address: {address}</div>
        <div>
          <NewTransactionButton provider={aaProvider} />
        </div>
      </div>
      <div>
        <h2>Accounts</h2>
        <div>0x1234</div>
        <div>0x1234</div>
        <div>0x1234</div>
      </div>
    </main>
  );
}
