import { ImSearch } from "react-icons/im";
import MicrochipSearch from "../Shared/MicrochipSearch";

const Hero = () => {
  return (
    <>
      <div
        className="flex max-h-[767px] min-h-[600px] justify-center bg-[url('/images/bgmain.jpg')] bg-cover
        text-white
        w425:h-[650px]
        w768:h-[767px]
      "
      >
        <div className="mt-10 flex max-h-[500px] max-w-[900px] flex-col items-center justify-evenly">
          <div
            style={{ fontFamily: "Kanit" }}
            className="
            text-center text-[2rem]
            font-[700]
            w425:pl-2
            w425:pr-2
            w425:text-[2.5rem]
            w768:text-[3rem]
            w1440:text-[3rem]
            "
          >
            สมาคมอนุรักษ์ และพัฒนาควายไทย
          </div>
          <div className="flex flex-col items-center gap-3">
            <div
              style={{ fontFamily: "Kanit" }}
              className="text-[1.5rem]
            w768:text-[2rem]"
            >
              ตรวจสอบพันธุ์ประวัติควาย
            </div>
            <MicrochipSearch />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
