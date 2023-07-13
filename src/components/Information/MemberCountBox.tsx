import YellowRoundedBox from "../Shared/YellowRoundedBox";
import Image from "next/image";
import { api } from "../../utils/api";
import { useEffect } from "react";

const MemberCountBox = () => {
  const { data: member, isLoading, refetch } = api.user.userCount.useQuery();

  useEffect(() => {
    void refetch();
  }, [isLoading, member]);
  return (
    <YellowRoundedBox>
      <div className="flex items-center justify-center gap-3 p-3">
        <div>
          <Image
            className="w1440:w-[80px]"
            src="/images/membericon.png"
            width={60}
            height={60}
            alt="member"
          />
        </div>
        <div>
          <div
            style={{ fontFamily: "Kanit" }}
            className="text-[1rem]
          w1440:text-[2rem]"
          >
            สมาชิกสมาคม
          </div>
          <div
            style={{ fontFamily: "Kanit" }}
            className="text-center
          text-[2rem] w1440:text-[3rem]"
          >
            {isLoading ? "XXX" : member}
          </div>
        </div>
      </div>
    </YellowRoundedBox>
  );
};

export default MemberCountBox;
