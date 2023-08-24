import { createPublicClient, http } from "viem";
import { bitkubMainnet, bitkubTestnet } from "~/blockchain/network";

export const publicClient = createPublicClient({
  chain: bitkubMainnet,
  // process.env.NEXT_PUBLIC_network === "Testnet"
  //   ? bitkubTestnet
  //   : bitkubMainnet,
  transport: http(),
});

export const testnetClient = createPublicClient({
  chain: bitkubTestnet,
  transport: http(),
});
