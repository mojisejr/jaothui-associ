import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import Footer from "~/components/Information/Footer";
import Unauthurized from "~/components/Shared/Unauthorized";
import { Layout } from "~/components/Shared/Layout";
import ProfileV2 from "~/components/Member/ProfileV2";

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
        <Unauthurized message="กำลังกลับหน้าหลัก..." />
      </>
    );
  }

  return (
    <>
      <Layout>
        <ProfileV2 />
        <Footer />
      </Layout>
    </>
  );
};

export default Member;
