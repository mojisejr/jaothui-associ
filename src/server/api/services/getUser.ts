/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from "axios";
export const getUser = async (accessToken: string) => {
  try {
    if (accessToken == undefined) {
      throw new Error("access token undefined");
    }
    const response = await axios.get(
      "https://api.bitkubnext.io/accounts/auth/info",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { wallet_address: wallet, email } = response.data.data;
    return {
      wallet,
      email,
    };
  } catch (error) {
    return undefined;
    // throw new Error("Fetching Userdata failed.");
  }
};
