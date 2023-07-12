/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useBitkubNext } from "~/contexts/bitkubNextContext";

const Callback = () => {
  const { query, replace } = useRouter();
  const { authorize, wallet, isConnected } = useBitkubNext();

  useEffect(() => {
    if (query.code != undefined) {
      console.log("code: ", query.code);
      authorize(query.code as string);
    }

    if (isConnected && wallet != undefined) {
      void replace("/");
    }
  }, [query, isConnected]);

  return (
    <>
      <div>Authenticating</div>
    </>
  );
};

export default Callback;
