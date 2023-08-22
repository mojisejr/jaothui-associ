import YellowRoundedBox from "../Shared/YellowRoundedBox";
import Image from "next/image";
import { api } from "../../utils/api";
import Loading from "../Shared/LoadingIndicator";

const PedigreeCountBox = () => {
  const { data: pedigrees, isLoading } =
    api.pedigrees.totalPedigrees.useQuery();

  return (
    <YellowRoundedBox>
      <div className="flex items-center justify-center gap-3 p-3">
        <div>
          <Image
            className="w1440:w-[80px]"
            src="/images/buffaloicon.png"
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
            ใบพันธุ์ประวัติ
          </div>
          <div
            style={{ fontFamily: "Kanit" }}
            className="text-center 
          text-[2rem] w1440:text-[3rem]"
          >
            {isLoading ? <Loading /> : `${pedigrees!}`}
          </div>
        </div>
      </div>
    </YellowRoundedBox>
  );
};

export default PedigreeCountBox;
