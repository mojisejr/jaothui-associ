import About from "./About";
import HeaderTitle from "../Shared/HeaderTitle";
import FarmCountBox from "./FarmCountBox";
import MemberCountBox from "./MemberCountBox";
import MemberSearch from "./MemberSearch";
import PedigreeCountBox from "./PedigreeCountBox";
import Guide from "./Guide";
import Advertisement from "./Ads";
import Footer from "./Footer";

const Information = () => {
  return (
    <>
      <div className="relative h-full">
        <svg
          className="absolute -bottom-10"
          id="visual"
          viewBox="0 0 960 540"
          version="1.1"
        >
          <path
            d="M0 369L32 370.7C64 372.3 128 375.7 192 386.2C256 396.7 320 414.3 384 421.7C448 429 512 426 576 408.3C640 390.7 704 358.3 768 345.7C832 333 896 340 928 343.5L960 347L960 541L928 541C896 541 832 541 768 541C704 541 640 541 576 541C512 541 448 541 384 541C320 541 256 541 192 541C128 541 64 541 32 541L0 541Z"
            fill="#73A82E"
            strokeLinecap="round"
            strokeLinejoin="miter"
          ></path>
        </svg>
        <div
          className="absolute top-2 flex w-full flex-col items-center justify-center gap-3 bg-[#73A82E]
        w1024:-top-10"
        >
          <HeaderTitle text="ข้อมูลสมาคม" />
          <div
            className="flex flex-col gap-3
          w768:flex-row
          w768:gap-[4rem]"
          >
            <MemberCountBox />
            <PedigreeCountBox />
            <FarmCountBox />
          </div>
          <MemberSearch />
          <About />
          <Guide />
          <Advertisement />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Information;
