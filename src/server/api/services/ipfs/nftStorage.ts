/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NFTStorage, Blob } from "nft.storage";
const nftstorage = new NFTStorage({
  token: process.env.NEXT_PUBLIC_nft_storage_key as string,
});

export async function storeImageBlob(image: ArrayBuffer) {
  const blob = new Blob([image], { type: "image/png" });
  const output = await nftstorage.storeBlob(blob);
  const baseUrl = `https://nftstorage.link/ipfs/${output as string}`;
  // const baseUrl = `ipfs://${output}`;
  return baseUrl;
}

export async function storeNFT(metadata: string) {
  // const blob = new Blob([JSON.stringify(metadata)], { type: "text/json" });
  const blob = new Blob([metadata], { type: "text/json" });
  const output = await nftstorage.storeBlob(blob);
  const baseUrl = `https://nftstorage.link/ipfs/${output as string}`;
  // const baseUrl = `ipfs://${output}`;
  return baseUrl;
}
