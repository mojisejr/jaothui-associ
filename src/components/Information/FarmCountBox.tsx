import YellowRoundedBox from "../Shared/YellowRoundedBox";
import Image from "next/image";

const FarmCountBox = () => {
  return (
    <YellowRoundedBox>
      <div className="flex items-center justify-center gap-3 p-3">
        <div>
          <Image
            className="w1440:w-[80px]"
            src="/images/farmicon.png"
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
            ฟาร์มสมาชิก
          </div>
          <div
            style={{ fontFamily: "Kanit" }}
            className="text-[2rem]
          w1440:text-[3rem]"
          >
            XXX
          </div>
        </div>
      </div>
    </YellowRoundedBox>
  );
};

export default FarmCountBox;
