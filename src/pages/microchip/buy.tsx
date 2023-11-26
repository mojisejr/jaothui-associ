/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import BuyMicrochipAndInstallHere from "~/components/Microchip/InstallHereForm";
import BuyMicrochipOnline from "~/components/Microchip/InstallOnlineForm";
import { useBitkubNext } from "~/contexts/bitkubNextContext";

const BuyMicrochip = () => {
  const { query, replace } = useRouter();
  const { isConnected } = useBitkubNext();

  useEffect(() => {
    if (!isConnected) {
      void replace("/");
    }
  }, [isConnected]);

  return (
    <>
      {query?.installHere == "true" ? (
        <BuyMicrochipAndInstallHere />
      ) : (
        <BuyMicrochipOnline />
      )}
    </>
  );
};

export default BuyMicrochip;
