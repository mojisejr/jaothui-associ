/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useEffect, useState } from "react";
import Modal from "../Shared/Modal";
import { BsThreeDots } from "react-icons/bs";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "~/utils/api";
import { FaWpforms } from "react-icons/fa6";
import { FaSearchDollar } from "react-icons/fa";
import { MdFactCheck, MdOutlineApproval } from "react-icons/md";
import Link from "next/link";
import Loading from "../Shared/LoadingIndicator";

const MemberModalDialog = () => {
  const { wallet, tokens } = useBitkubNext();
  const { data: user, isLoading: userLoading } = api.user.get.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (user != undefined && !user.active) {
      if ((user.payment[0]?.approvedCount as number) >= 3) {
        setMessage("อยู่ระหว่างรอเสนอชื่อ 15 วัน");
      } else {
        setMessage("อยู่ระหว่างรอตรวจสอบชำระเงิน");
      }
    } else if (user != undefined && user.active) {
      setMessage("อนุมัติสมาชิกเรียบร้อยแล้ว");
    }
  }, [user]);
  return (
    <>
      {!userLoading ? (
        <div className="flex gap-3">
          <div
            className={`btn rounded-xl ${
              user?.active ? "bg-[#55ff34]" : "bg-[#fe0]"
            } font-bold text-black`}
            onClick={() => window.member_dialog.showModal()}
          >
            {user?.active ? "อนุมัติ" : "ตรวจสอบการอนุมัติ"}
          </div>
          {user?.active ? (
            <Link
              href="/member/card"
              className="btn rounded-xl bg-[#55ff34] font-bold text-black"
            >
              บัตรสมาชิก
            </Link>
          ) : null}
        </div>
      ) : (
        <Loading />
      )}

      <Modal id="member_dialog">
        <div id="icon-box" className="flex items-center justify-evenly gap-2">
          <div className="flex flex-col items-center">
            {/* <Image src="/images/step1.png" width={50} height={50} alt="step1" /> */}
            <div className="text-green-500">
              <FaWpforms size={60} />
            </div>
            <p className="text-[10px]">กรอกข้อมูล + แจ้งชำระเงิน</p>
          </div>
          <BsThreeDots size={30} />
          <div>
            <div className="text-green-500">
              <FaSearchDollar size={60} />
            </div>
            <p className="text-[10px]">ตรวจสอบชำระเงิน</p>
          </div>
          <BsThreeDots size={30} />
          <div>
            <div
              className={`${
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
                user?.payment[0]?.approvedCount! >= 3
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              <MdFactCheck size={60} />
            </div>
            <p className="text-[10px]">เสนอชื่อ 15 วัน</p>
          </div>
          <BsThreeDots size={30} />
          <div>
            <div
              className={`${
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
                user?.payment[0]?.approvedCount! >= 3 && user?.active
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              <MdOutlineApproval size={60} />
            </div>
            <p className="text-[10px]">อนุมัติสมาชิก</p>
          </div>
        </div>
        <div className="my-2 text-center text-xl">
          {message == undefined ? "Loading .." : message}
        </div>
        <div
          id="description-box"
          className="my-2 flex flex-col items-center justify-center bg-gray-400 py-2"
        >
          <div className="font-bold">{`${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}</div>
          <div className="font-bold text-white">คุณ {user?.name}</div>
          <div>ติดต่อสอบถามเพิ่มเติม 062-565-4989</div>
        </div>
      </Modal>
    </>
  );
};

export default MemberModalDialog;
