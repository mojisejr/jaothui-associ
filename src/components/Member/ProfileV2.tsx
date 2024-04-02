import { api } from "~/utils/api";
import InformationGridV2 from "./InformatinoGridV2";
import MemberCard from "./MemberCard";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useEffect } from "react";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import Loading from "../Shared/LoadingIndicator";
import ProfileHeader from "./ProfileHeader";
import ProfileMenu from "./ProfileMenu";
import MicrochipSearch from "../Shared/MicrochipSearch";

const ProfileV2 = () => {
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

  const { admin, isSuccess, isLoading: loadingAdmin, isError } = useIsAdmin();

  useEffect(() => {
    void refetch();
  }, []);

  return (
    <>
      <div
        className="block max-h-full min-h-[700px] bg-cover  py-3 text-primary sm:flex  sm:justify-center
      w768:mt-[70px]
      w1024:mt-[100px]
      w1440:mt-[150px]"
      >
        {/* <div
        className="flex max-h-full min-h-[700px] justify-center bg-[url('/images/bgmain.jpg')] bg-cover py-3 text-white
      w1024:pt-[50px]
      w1440:pt-[100px]"
      > */}
        <div className="flex max-w-[900px] flex-col">
          {/* <InformationGridV2 /> */}
          {loadingUser || loadingAdmin ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 gap-2">
              <ProfileHeader
                wallet={wallet as string}
                name={user?.name as string}
                avatar={user?.avatar as string}
                admin={admin}
                isLifeTime={user?.payment[0]?.isLifeTime as boolean}
              />
              <div className="max-w-md px-2">
                <MicrochipSearch />
              </div>
              <ProfileMenu />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileV2;
