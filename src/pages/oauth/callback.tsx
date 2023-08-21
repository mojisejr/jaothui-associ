/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useBitkubNext } from "~/contexts/bitkubNextContext";

const Callback = () => {
  const { query, replace } = useRouter();
  const { authorize, isConnected, message, wallet } = useBitkubNext();

  useEffect(() => {
    if (query.code != undefined) {
      authorize(query.code as string);
    }

    if (isConnected && wallet != undefined) {
      void replace("/");
    }
  }, [query, isConnected]);

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center text-[3rem]">
        {message}
      </div>
    </>
  );
};

export default Callback;
