import { useContractRead } from "wagmi";
import { abi, address } from "./testnet";
import { useBitkubNext } from "~/contexts/bitkubNextContext";

export function useIsAdmin() {
  const { wallet } = useBitkubNext();

  const { data, isError, isLoading, isSuccess } = useContractRead({
    address,
    abi,
    functionName: "getStateOf",
    args: [wallet],
  });

  return {
    admin: data != undefined ? (data as [number, number, boolean][2]) : false,
    isSuccess,
    isError,
    isLoading,
  };
}
