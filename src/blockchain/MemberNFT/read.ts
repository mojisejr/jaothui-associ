import { useContractRead } from "wagmi";
import { abi, address } from "./mainnet";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { checkAdminPeriod } from "~/utils/checkAdminPeriod";

export function useIsAdmin() {
  const { wallet } = useBitkubNext();

  const { data, isError, isLoading, isSuccess } = useContractRead({
    address,
    abi,
    functionName: "getStateOf",
    args: [wallet],
  });

  const isAdmin =
    data == undefined
      ? false
      : checkAdminPeriod(data as [bigint, bigint, boolean]);

  return {
    admin: isAdmin,
    isSuccess,
    isError,
    isLoading,
  };
}
