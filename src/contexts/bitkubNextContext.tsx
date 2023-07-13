/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { exchangeAuthorizationCode } from "@bitkub-blockchain/react-bitkubnext-oauth2";
import axios from "axios";
import { useRouter } from "next/router";

const clientId =
  process.env.NODE_ENV == "production"
    ? (process.env.NEXT_PUBLIC_client_id_prod as string)
    : (process.env.NEXT_PUBLIC_client_id_dev as string);
const redirectURI =
  process.env.NODE_ENV == "production"
    ? (process.env.NEXT_PUBLIC_redirect_prod as string)
    : (process.env.NEXT_PUBLIC_redirect_dev as string);

const cookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: true,
  httpOnly: process.env.production == "PROD" ? true : false,
  expires: new Date(Date.now() + 60 * 60 * 24),
  maxAge: 60 * 60 * 24 * 7,
};

//1. define context type
type bitkubNextContextType = {
  isConnected: boolean;
  wallet?: `0x${string}` | undefined;
  tokens?: { access_token?: string; refresh_token?: string };
  message?: string;
  authorize: (code: string) => void;
  signOut: () => void;
};

type AuthTokens = {
  access_token?: string;
  refresh_token?: string;
};

//2. define initial context
const bitkubNextContextInitialState: bitkubNextContextType = {
  isConnected: false,
  authorize: () => {},
  signOut: () => {},
};

//3. define Context
const BitkubNextContext = createContext<bitkubNextContextType>(
  bitkubNextContextInitialState
);

type BitkubNextContextProps = {
  children: ReactNode;
};

export function BitkubNextProvider({ children }: BitkubNextContextProps) {
  const [wallet, setWallet] = useState<`0x${string}`>();
  const [tokens, setTokens] = useState<AuthTokens>({
    access_token: undefined,
    refresh_token: undefined,
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Authenticating..");

  useEffect(() => {
    _getAuthDataFromCookie();
  }, [isConnected]);

  function _getAuthDataFromCookie() {
    const access_token = getCookie("accessToken")?.toString();
    const refresh_token = getCookie("refreshToken")?.toString();
    const wallet = getCookie("wallet")?.toString();

    if (
      access_token != undefined &&
      refresh_token != undefined &&
      wallet != undefined
    ) {
      setWallet(wallet as `0x${string}`);
      setTokens({
        access_token,
        refresh_token,
      });
      setMessage("Authentication Successful.");
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }

  async function _getUserData(accessToken?: string) {
    try {
      const response = await axios.get(
        "https://api.bitkubnext.io/accounts/auth/info",
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken!}`,
          },
        }
      );

      const { wallet_address: wallet, email } = response.data.data;
      setWallet(wallet as `0x${string}`);
      return {
        wallet,
        email,
      };
    } catch (error) {
      throw new Error("Fetching Userdata failed.");
    }
  }

  function _setCookies(
    accessToken: string,
    refreshToken: string,
    wallet: string
  ) {
    setCookie("accessToken", accessToken, cookieOptions);
    setCookie("refreshToken", refreshToken, cookieOptions);
    setCookie("wallet", wallet, cookieOptions);

    setTokens({
      access_token: accessToken,
      refresh_token: redirectURI,
    });
    setWallet(wallet as `0x${string}`);
  }

  function _resetCookies() {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("wallet");
  }

  async function authorize(code: string) {
    //@get access token
    try {
      if (!isConnected) {
        const { access_token: accessToken, refresh_token: refreshToken } =
          (await exchangeAuthorizationCode(
            clientId,
            redirectURI,
            code
          )) as AuthTokens;
        const userData = await _getUserData(accessToken);
        _setCookies(
          accessToken as string,
          refreshToken as string,
          userData.wallet as `0x${string}`
        );
        setIsConnected(true);
        setMessage("Authentication Successful.");
      }
    } catch (error) {
      setIsConnected(false);
      setMessage("Error: Authentication failed, please try again.");
      console.log("authentication error: ", error);
      throw new Error("Authentication failed");
    }
  }

  function signOut() {
    _resetCookies();
    setTokens({
      access_token: undefined,
      refresh_token: undefined,
    });
    setWallet(wallet as `0x${string}`);
    setIsConnected(false);
  }

  const value = {
    tokens,
    isConnected,
    wallet,
    message,
    authorize,
    signOut,
  };

  return (
    <BitkubNextContext.Provider value={value}>
      {children}
    </BitkubNextContext.Provider>
  );
}

export function useBitkubNext() {
  return useContext(BitkubNextContext);
}
