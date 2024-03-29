import React from "react";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

function MemberPedigreeCard() {
  return (
    <div className="flex min-w-[180px] max-w-[300px] flex-col items-center justify-center gap-2 rounded-md border-[1px] border-primary bg-white px-2 py-2 text-black hover:shadow-xl">
      <div className="flex flex-col items-center justify-center">
        <HiOutlineClipboardDocumentList size={60} />
        <span>ควายที่มีใบรับรอง</span>
      </div>
      <div className="text-2xl font-bold">??</div>
      <div className="flex flex-col gap-2">
        <div>ยังไม่เปิดใช้งาน</div>
        {/* <Link className="rounded-md bg-green-600 px-2 py-2" href="/">
          ขอใบรับรองควาย
        </Link>
        <Link className="rounded-md bg-gray-800 px-2 py-2 text-white" href="/">
          ดูรายละเอียด
        </Link> */}
      </div>
    </div>
  );
}

export default MemberPedigreeCard;
