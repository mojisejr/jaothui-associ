import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import MemberCard from "~/components/Member/MemberCard";
import Loading from "~/components/Shared/LoadingIndicator";

const PublicMemberCard = () => {
  const { query } = useRouter();
  const { data, refetch } = api.user.getPublicCard.useQuery({
    wallet: query.wallet as string,
  });

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
