import { publicClient } from "../provider";
import { metadataAbi, metadataAddress } from "./abi";

export async function getAllMetadata() {
  const pedigrees = await publicClient.readContract({
    address: metadataAddress,
    abi: metadataAbi,
    functionName: "getAllMetadata",
  });

  return pedigrees;
}
