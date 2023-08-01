/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useEffect, useState } from "react";
import Modal from "../Shared/Modal";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "~/utils/api";

const MemberModalDialog = () => {
  const { wallet, tokens } = useBitkubNext();
  const { data: user } = api.user.get.useQuery({
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
      <div
        className="btn rounded-xl bg-[#55ff34] font-bold text-black"
        onClick={() => window.member_dialog.showModal()}
      >
        {user?.active ? "อนุมัติ" : "ตรวจสอบการอนุมัติ"}
      </div>
      <Modal id="member_dialog">
        <div id="icon-box" className="flex items-center justify-evenly gap-2">
          <div>
            <Image src="/images/step1.png" width={50} height={50} alt="step1" />
            <p className="text-[10px]">กรอกข้อมูล + แจ้งชำระเงิน</p>
          </div>
          <BsThreeDots size={30} />
          <div>
            <Image src="/images/step2.png" width={50} height={50} alt="step2" />
            <p className="text-[10px]">ตรวจสอบชำระเงิน</p>
          </div>
          <BsThreeDots size={30} />
          <div>
            <Image
              src="/images/wait15day.png"
              width={50}
              height={50}
              alt="wait15"
            />
            <p className="text-[10px]">เสนอชื่อ 15 วัน</p>
          </div>
          <BsThreeDots size={30} />
          <div>
            <Image src="/images/step3.png" width={60} height={60} alt="step3" />
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
          <div>DD MM YY</div>
          <div>#9999999999</div>
          <div>ติดต่อสอบถามเพิ่มเติม xxxxxxxxx</div>
        </div>
      </Modal>
    </>
  );
};

export default MemberModalDialog;
