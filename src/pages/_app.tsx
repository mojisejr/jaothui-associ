import type { AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { BitkubNextProvider } from "~/contexts/bitkubNextContext";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { bitkubMainnet, bitkubTestnet } from "~/blockchain/network";

const { publicClient, webSocketPublicClient } = configureChains(
  [
    process.env.NEXT_PUBLIC_network === "Testnet"
      ? bitkubTestnet
      : bitkubMainnet,
  ],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <BitkubNextProvider>
      <WagmiConfig config={config}>
        <Component {...pageProps} />
      </WagmiConfig>
    </BitkubNextProvider>
  );
};

export default api.withTRPC(MyApp);
