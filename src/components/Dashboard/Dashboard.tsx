import { useState, useEffect } from "react";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "../../utils/api";
import MemberCountBox from "../Information/MemberCountBox";
import PedigreeCountBox from "../Information/PedigreeCountBox";
import FarmCountBox from "../Information/FarmCountBox";
import PaymentApproveCard from "./PaymentApproveCard";
import MemberApprovementCard from "./MemberApprovmentCard";

const ApprovementDashBoard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { wallet, tokens, isConnected } = useBitkubNext();
  const { data: admin } = api.user.get.useQuery({
    wallet: wallet as string,
    accessToken: tokens?.access_token as string,
  });
  const { data: waitForPaymentUsers, refetch: fetchwaitForPaymentUsers } =
    api.admin.getWaitForPaymentApproval.useQuery({
      accessToken: tokens?.access_token as string,
      wallet: wallet as string,
    });

  const { data: waitForActiveUsers, refetch: fetchWaitForActive } =
    api.admin.getWaitForApprovement.useQuery({
      accessToken: tokens?.access_token as string,
      wallet: wallet as string,
    });

  useEffect(() => {
    void fetchwaitForPaymentUsers();
    void fetchWaitForActive();
  }, []);

  useEffect(() => {
    if (isConnected) {
      if (admin?.role === "ADMIN") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [isAdmin, admin, isConnected]);

  return (
    <>
      <div className="min-h-screen w-full bg-gray-100">
        <div
          className="flex flex-col items-center justify-center gap-2 p-3
        w768:flex-row
        w768:pt-20
        w1024:pt-[120px]"
        >
          <MemberCountBox />
          <PedigreeCountBox />
          <FarmCountBox />
        </div>
        <div
          className="grid grid-cols-1 gap-2 px-5 py-3
        w768:grid-cols-2"
        >
          <div className="max-h-[80vh] min-h-[50vh] overflow-y-auto bg-white ">
            <div className="flex justify-around">
              <ul className="flex min-w-[350px] max-w-[400px] flex-col justify-center gap-2 p-2">
                <div className="flex justify-between px-3 py-2 text-lg font-bold">
                  <div>รอยืนยันการชำระเงิน</div>
                  <div>
                    {waitForPaymentUsers == undefined
                      ? "N/A"
                      : waitForPaymentUsers?.length}{" "}
                    คน
                  </div>
                </div>
                {waitForPaymentUsers == undefined ? (
                  <div>ไม่มีข้อมูล</div>
                ) : (
                  <>
                    {waitForPaymentUsers?.map((user) => (
                      <PaymentApproveCard
                        key={user.wallet}
                        wallet={user.wallet}
                        name={user.User?.name as string}
                        payment={user.isLifeTime}
                        slipUrl={user.slipUrl}
                        start={user.start}
                      />
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="max-h-[80vh]  min-h-[50vh] overflow-y-auto bg-white">
            <div className="flex justify-around">
              <ul className="flex min-w-[350px] max-w-[400px] flex-col justify-center gap-2 p-2">
                <div className="flex justify-between px-3 py-2 text-lg font-bold">
                  <div>รอยืนยันหลัง 15 วัน</div>
                  <div>
                    {waitForActiveUsers == undefined
                      ? "N/A"
                      : waitForActiveUsers?.length}
                    คน
                  </div>
                </div>
                {waitForActiveUsers == undefined ? (
                  <div>ไม่มีข้อมูล</div>
                ) : (
                  <>
                    {waitForActiveUsers?.map((user) => (
                      <MemberApprovementCard
                        key={user.wallet}
                        wallet={user.wallet}
                        name={user.name as string}
                        dayPassed={user.daysPassed}
                      />
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovementDashBoard;
