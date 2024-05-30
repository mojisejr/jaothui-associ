import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import Unauthurized from "~/components/Shared/Unauthorized";
import { Layout } from "~/components/Shared/Layout";
import PedigreeRequestForm from "~/components/Member/PedigreeRequestForm";

const Member = () => {
  const { wallet, tokens, isConnected } = useBitkubNext();

  const { data: registered, isSuccess: isRegisterOK } =
    api.user.isRegistered.useQuery({
      accessToken: tokens?.access_token as string,
      wallet: wallet as string,
    });

  const { replace } = useRouter();

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
        <Unauthurized message="กรุณาเชื่อมต่อกระเป๋า Bitkubnext" />
      </>
    );
  }

  //1. search for the buffalo information
  //2. founded then input the additional buffalo information
  //2.1 neeed to search for father mother grandma grandpa id (optional)
  //3. confirm the data
  //4. place the slip
  //5. send request

  return (
    <>
      <Layout>
        <main
          className="m-auto max-w-[1024px] bg-slate-50 w768:mt-[70px]
      w1024:mt-[100px]
      w1440:mt-[150px]"
        >
          <PedigreeRequestForm />
        </main>
      </Layout>
    </>
  );
};

export default Member;
