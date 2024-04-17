import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import MemberCard from "~/components/Member/MemberCard";
import Loading from "~/components/Shared/LoadingIndicator";
import Image from "next/image";

const PublicMemberCard = () => {
  const { query } = useRouter();
  const { data, isLoading, isError, refetch } = api.user.getPublicCard.useQuery(
    {
      wallet: query.wallet as string,
    }
  );

  useEffect(() => {
    void refetch();
  }, [query]);

  const { admin } = useIsAdmin();

  return (
    <>
      <div className="relative flex min-h-screen w-full items-center justify-center">
        {data == undefined ? (
          <Loading />
        ) : (
          <div>
            <div className="flex items-center gap-4 py-2">
              <div className="w-24">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={150}
                  height={150}
                />
              </div>
              <div>
                <h1 className="font-bold">สมาคมอนุรักษ์​ และ พัฒนาควายไทย</h1>
                <p>บัตรประจำตัวสมาชิก</p>
              </div>
            </div>
            <MemberCard
              wallet={data.wallet!}
              name={data.name!}
              avatar={data.avatar!}
              admin={admin}
              isLifeTime={data.isLifeTime!}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PublicMemberCard;
