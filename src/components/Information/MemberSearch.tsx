import { ImSearch } from "react-icons/im";

const MemberSearch = () => {
  return (
    <>
      <div
        className="flex flex-col gap-2
      w768:mt-3
      w768:flex-row
      w1024:gap-5
      w1440:mt-10"
      >
        <div className="text-[2rem] text-white" style={{ fontFamily: "Kanit" }}>
          ตรวจสอบรายชื่อสมาชิก
        </div>
        <div
          className="flex gap-3 rounded-full border-2 border-black bg-white pr-3
        "
        >
          <input
            type="text"
            placeholder="MEMBER ID..."
            className="input w-full max-w-[420px] rounded-full text-black focus:outline-none"
          ></input>
          <button className="text-black">
            <ImSearch size={30} />
          </button>
        </div>
      </div>
    </>
  );
};

export default MemberSearch;
