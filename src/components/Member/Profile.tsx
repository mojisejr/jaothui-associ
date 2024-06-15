import { api } from "~/utils/api";
import InformationGridV2 from "./InformatinoGridV2";
import MemberCard from "./MemberCard";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useEffect } from "react";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import Loading from "../Shared/LoadingIndicator";

const Profile = () => {
  const { wallet, tokens } = useBitkubNext();
  const {
    data: user,
    isLoading: loadingUser,
    refetch,
  } = api.user.get.useQuery({
    wallet: wallet as string,
    accessToken: tokens?.access_token as string,
  });

  const { admin, isSuccess, isLoading: loadingAdmin, isError } = useIsAdmin();

  useEffect(() => {
    void refetch();
  }, []);

  return (
    <>
      <div
        className="flex max-h-full min-h-[700px] justify-center  bg-cover py-3 text-primary 
      w768:mt-[70px]
      w1024:mt-[100px]
      w1440:mt-[150px]"
      >
        {/* <div
        className="flex max-h-full min-h-[700px] justify-center bg-[url('/images/bgmain.jpg')] bg-cover py-3 text-white
      w1024:pt-[50px]
      w1440:pt-[100px]"
      > */}
        <div className="flex max-w-[900px] flex-col items-center justify-evenly">
          {/* <InformationGridV2 /> */}
          {loadingUser || loadingAdmin ? (
            <Loading />
          ) : (
            <div className="grid-col-1 grid gap-4">
              <MemberCard
                wallet={wallet as string}
                name={user?.name as string}
                avatar={user?.avatar as string}
                admin={admin}
                isLifeTime={user?.payment[0]?.isLifeTime as boolean}
                isPublic={false}
              />
              <InformationGridV2 />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
