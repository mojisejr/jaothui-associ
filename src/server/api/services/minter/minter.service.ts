import axios from "axios";
import { type Address } from "viem";
import { Mintable } from "~/interfaces/Mintable";
const url = process.env.minter_url as string;

export const getMintableWallet = async () => {
  try {
    const mintable = await axios.get<Mintable>(`${url}/member/mintable`, {
      headers: {
        Authorization: `Bearer ${process.env.bkey!}`,
      },
    });
    return mintable.data;
  } catch (error) {
    console.log("error", error);
    return undefined;
  }
};

export const mintNFT = async (to: Address, mintingKey: string) => {
  try {
    const minted = await axios.post<{ wallet: string; result: boolean }>(
      `${url}/member/mint`,
      {
        to,
        minting_key: mintingKey,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.bkey!}`,
        },
      }
    );

    return minted.data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
