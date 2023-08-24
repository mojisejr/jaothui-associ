import {
  abi as mAbi,
  address as mAddress,
} from "~/blockchain/MemberNFT/mainnet";
import {
  abi as tAbi,
  address as tAddress,
} from "~/blockchain/MemberNFT/testnet";
import { testnetClient } from "../provider";

export async function getStateOf(wallet: `0x${string}`) {
  const data = await testnetClient.readContract({
    address:
      process.env.NEXT_PUBLIC_network === "Testnet" ? tAddress : mAddress,
    abi: process.env.NEXT_PUBLIC_network === "Testnet" ? tAbi : mAbi,
    functionName: "getStateOf",
    args: [wallet],
  });

  if (data != undefined || data != null) {
    return data as [number, number, boolean];
  } else {
    return [];
  }
}
