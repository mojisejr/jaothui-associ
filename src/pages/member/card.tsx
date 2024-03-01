import Head from "next/head";
import Navbar from "~/components/Nav";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import Unauthurized from "~/components/Shared/Unauthorized";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import MemberCard from "~/components/Member/MemberCard";
import Loading from "~/components/Shared/LoadingIndicator";
import { Layout } from "~/components/Shared/Layout";

const Card = () => {
  const { wallet, tokens, isConnected } = useBitkubNext();
  const { data: registered } = api.user.isRegistered.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  const {
    data: user,
    isLoading: loadingUser,
    refetch,
  } = api.user.get.useQuery({
    wallet: wallet as string,
    accessToken: tokens?.access_token as string,
  });

  const { replace } = useRouter();

  const { admin, isSuccess, isLoading: loadingAdmin, isError } = useIsAdmin();

  useEffect(() => {
    void refetch();
  }, []);

  useEffect(() => {
    if (!isConnected || !registered) {
      void replace("/");
    }
  }, [isConnected, registered]);

  if (!isConnected) {
    return (
      <>
        <Unauthurized message="กำลังกลับหน้าหลัก..." />
      </>
    );
  }

  return (
    <>
      <div className="relative flex min-h-screen w-full items-center justify-center">
        {loadingUser || loadingAdmin ? (
          <Loading />
        ) : (
          <MemberCard
            wallet={wallet as string}
            name={user?.name as string}
            avatar={user?.avatar as string}
            admin={admin}
            isLifeTime={user?.payment[0]?.isLifeTime as boolean}
          />
        )}
      </div>
    </>
  );
};

export default Card;
