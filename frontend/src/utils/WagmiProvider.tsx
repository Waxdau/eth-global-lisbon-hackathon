"use client";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { arbitrumGoerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ReactNode } from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, arbitrumGoerli],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_GOERLI ?? "",
    }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const WagmiProvider = ({ children }: { children: ReactNode }) => (
  <WagmiConfig config={config}>{children}</WagmiConfig>
);

export default WagmiProvider;
