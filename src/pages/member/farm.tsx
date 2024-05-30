import { useRouter } from "next/router";
import React, { useEffect } from "react";
import FarmMenu from "~/components/Farm/FarmMenu";
import FarmTable from "~/components/Farm/FarmTable";
import { Layout } from "~/components/Shared/Layout";
import Unauthurized from "~/components/Shared/Unauthorized";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "~/utils/api";

const MyFarm = () => {
  const { replace } = useRouter();
  const { isConnected, tokens, wallet } = useBitkubNext();
  const { data: registered, isSuccess: isRegisterOK } =
    api.user.isRegistered.useQuery({
      accessToken: tokens?.access_token as string,
      wallet: wallet as string,
    });

  useEffect(() => {
    if (isRegisterOK) {
      if (!isConnected || !registered) {
        void replace("/");
      }
    }
  }, [isConnected, registered, isRegisterOK]);

  if (!isConnected) {
    return (
      <>
        <Unauthurized message="กำลังกลับหน้าหลัก..." />
      </>
    );
  }

  return (
    <>
      <Layout>
        <div className="mt-[90px] h-[90vh] w-full">
          <div className="grid grid-cols-1 gap-2 px-2 xl:px-10">
            <div className="place-self-end">
              <FarmMenu />
            </div>
            <FarmTable />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MyFarm;
