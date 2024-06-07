import { api } from "~/utils/api";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useEffect } from "react";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import Loading from "../Shared/LoadingIndicator";
import ProfileHeader from "./ProfileHeader";
import ProfileMenu from "./ProfileMenu";
import MicrochipSearch from "../Shared/MicrochipSearch";

const ProfileV2 = () => {
  const { wallet, tokens } = useBitkubNext();

  const {
    data: user,
    isLoading: loadingUser,
    refetch,
  } = api.user.get.useQuery({
    wallet: wallet as string,
    accessToken: tokens?.access_token as string,
  });

  const { admin, isLoading: loadingAdmin } = useIsAdmin();

  useEffect(() => {
    void refetch();
  }, [wallet]);

  return (
    <>
      <div
        className="max-h-full min-h-[700px] bg-cover  py-3 text-primary sm:flex  sm:justify-center
      w768:mt-[70px]
      w1024:mt-[100px]
      w1440:mt-[150px]"
      >
        {/* <div
        className="flex max-h-full min-h-[700px] justify-center bg-[url('/images/bgmain.jpg')] bg-cover py-3 text-white
      w1024:pt-[50px]
      w1440:pt-[100px]"
      > */}
        {/* <InformationGridV2 /> */}
        {loadingUser || loadingAdmin ? (
          <div className="mt-10 flex justify-center">
            <Loading />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4">
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
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileV2;
