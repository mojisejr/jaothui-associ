import sharp from "sharp";
import { storeImageBlob } from "../services/ipfs/nftStorage";

export const resizeAndMakeIpfs = async (file: ArrayBuffer) => {
  const resizedImage = await sharp(file)
    .resize({
      width: 6000 * 0.5,
      height: 4000 * 0.5,
    })
    .toFormat("png")
    .toBuffer();

  return await storeImageBlob(resizedImage);
};
