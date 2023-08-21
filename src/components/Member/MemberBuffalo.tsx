import React from "react";
import { FaCow } from "react-icons/fa6";

function MemberBuffaloCard() {
  return (
    <div className="flex min-w-[180px] max-w-[300px] flex-col items-center justify-center gap-2 rounded-md bg-white py-2 text-black">
      <div className="flex flex-col items-center justify-center">
        <FaCow size={60} />
        <span>จำนวนควาย</span>
      </div>
      <div className="text-2xl font-bold">??</div>
      <div className="flex flex-col gap-2">
        <div>ยังไม่เปิดใช้งาน</div>
        {/* <Link className="rounded-md bg-green-600 px-2 py-2" href="/">
          ขอขึ้นทะเบียนควาย
        </Link> */}
        {/* <Link className="rounded-md bg-gray-800 px-2 py-2 text-white" href="/">
          ติดตามการขึ้นทะเบียน
        </Link> */}
      </div>
    </div>
  );
}

export default MemberBuffaloCard;
