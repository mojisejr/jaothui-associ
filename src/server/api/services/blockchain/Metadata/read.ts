import { publicClient } from "../provider";
import { metadataAbi, metadataAddress } from "./abi";
import { Metadata, MetadataForPedRequest } from "~/interfaces/Metadata";

export async function getAllMetadata() {
  const pedigrees = await publicClient.readContract({
    address: metadataAddress,
    abi: metadataAbi,
    functionName: "getAllMetadata",
  });

  return pedigrees;
}

export async function getMetadataByMicrochip(microchip: string) {
  const metadata = (await publicClient.readContract({
    address: metadataAddress,
    abi: metadataAbi,
    functionName: "getMetadataByMicrochip",
    args: [microchip],
  })) as Metadata;

  if (!metadata) return;

  // const parsed: MetadataForPedRequest = {
  //   name: metadata.name,
  //   microchip: metadata.certify.microchip,
  //   imageUri: metadata.imageUri,
  // };

  const parsed = {
    ...metadata,
    birthdate: +metadata.birthdate.toString(),
    height: +metadata.height.toString(),
    certify: {
      ...metadata.certify,
      issuedAt: +metadata.certify.issuedAt.toString(),
    },
    createdAt: +metadata.createdAt.toString(),
    updatedAt: +metadata.updatedAt.toString(),
  };

  // console.log(parsed);

  return parsed;
}
