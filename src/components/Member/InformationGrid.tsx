import { api } from "../../utils/api";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { HiDocumentCheck } from "react-icons/hi2";
import {
  BsThreeDots,
  BsCartCheckFill,
  BsPersonCheckFill,
} from "react-icons/bs";
import { MdEditDocument } from "react-icons/md";
import { useEffect, useState } from "react";
import GridCell from "./GridCell";

const InformationGrid = () => {
  const { wallet, tokens } = useBitkubNext();
  const { data: user } = api.user.get.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (user != undefined) {
      if ((user.payment[0]?.approvedCount as number) >= 3) {
        setProgress(1);
      } else {
        setProgress(0);
      }
    }
  }, [user]);

  return (
    <>
      <div
        className="grid min-w-[320px] grid-cols-5 rounded-md bg-white p-3 text-gray-800 
        shadow-xl
      "
      >
        <div className="col-span-5 w-full pb-3 pt-3">
          <div className="flex items-center justify-between">
            <div className="text-green-500">
              <MdEditDocument size={50} />
            </div>
            <div className="text-green-500">
              <BsThreeDots size={30} />
            </div>
            <div
              className={`${
                progress >= 1 && progress < 2 ? "text-green-500" : ""
              }`}
            >
              <BsCartCheckFill size={50} />
            </div>
            <div
              className={`${
                progress >= 1 && progress < 2 ? "text-green-500" : ""
              }`}
            >
              <BsThreeDots size={30} />
            </div>
            <div>
              <BsPersonCheckFill size={50} />
            </div>
            <div>
              <BsThreeDots size={30} />
            </div>
            <div>
              <HiDocumentCheck size={50} />
            </div>
          </div>
        </div>
        <GridCell
          label="Bitkub Next"
          content={`${wallet?.slice(0, 6) as string}...${
            wallet?.slice(38) as string
          }`}
        />
        <GridCell label="ชื่อ" content={user?.name as string} />
        <GridCell
          label="เบอรโทร"
          content={user?.tel == null ? "N/A" : user?.tel}
        />
        <GridCell
          label="รูปแบบ"
          content={user?.payment[0]?.isLifeTime ? "ตลอดชีพ" : "รายปี"}
        />
        <GridCell
          label="ยืนยันชำระเงิน"
          content={
            user?.payment[0]?.active
              ? `เรียบร้อย (${user?.payment[0]?.approvedCount}/3)`
              : `รอการยืนยัน (${user?.payment[0]?.approvedCount as number}/3)`
          }
        />
        <GridCell
          label="ยันยันสมาชิก"
          content={
            user?.active
              ? `เรียบร้อย (${user?.approved.length}/3)`
              : `รอการยืนยัน (${user?.approved.length as number}/3)`
          }
        />
      </div>
    </>
  );
};

export default InformationGrid;
