"use client";

import NewTransactionButton from "./components/NewTransactionButton";
import { ethers, Wallet } from "ethers";
import { useEffect, useState } from "react";
import { wrapProvider, ERC4337EthersProvider } from "@account-abstraction/sdk";

const privateKey =
  "0x8bc8492537b7a65d3698ada8ab1169964e3880f97c0139359a6f2d7095879bfd";
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

      setAaProvider(tempAaProvider);
      setAddress(await tempAaProvider.getSigner().getAddress());
    };
    getAaProvider();
  }, []);

  return (
    <main className="flex items-center justify-between p-24">
      <div>
        <div>Multi-sig Balance: 1 ETH</div>
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
