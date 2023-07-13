import { publicClient } from "../provider";
import { pedAbi, pedAddr } from "./abi";

export async function getTotalPedigrees() {
  const data = await publicClient.readContract({
    address: pedAddr,
    abi: pedAbi,
    functionName: "totalSupply",
  });

  if (data != undefined || data != null) {
    return data as string;
  } else {
    return null;
  }
}
