import Head from "next/head";
import Profile from "~/components/Member/Profile";
import Navbar from "~/components/Nav";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import Footer from "~/components/Information/Footer";
import Unauthurized from "~/components/Shared/Unauthorized";

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
      <Head>
        <title>สมาคมอนุรักษ์ และพัฒนาควายไทย</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Profile />
      <Footer />
    </>
  );
};

export default Member;