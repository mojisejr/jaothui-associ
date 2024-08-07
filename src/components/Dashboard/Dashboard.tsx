import { useState, useEffect } from "react";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "../../utils/api";
import MemberCountBox from "../Information/MemberCountBox";
import PedigreeCountBox from "../Information/PedigreeCountBox";
import FarmCountBox from "../Information/FarmCountBox";
import PaymentApproveCard from "./PaymentApproveCard";
import MemberApprovementCard from "./MemberApprovmentCard";
import Loading from "../Shared/LoadingIndicator";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import MicrochipManageTable from "./MicrochipManageTable";
import MemberMintingTable from "./MemberMintingTable";
import UpdateWallet from "./UpdateWallet";
import CertificationApproveTable from "./CertificationApproveTable";

const ApprovementDashBoard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { wallet, tokens, isConnected } = useBitkubNext();

  // const { data: admin } = api.user.get.useQuery({
  //   wallet: wallet as string,
  //   accessToken: tokens?.access_token as string,
  // });

  const {
    data: waitForPaymentUsers,
    isLoading: loadingPayment,
    refetch: fetchwaitForPaymentUsers,
  } = api.admin.getWaitForPaymentApproval.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  const {
    data: waitForActiveUsers,
    isLoading: loadingActive,
    refetch: fetchWaitForActive,
  } = api.admin.getWaitForApprovement.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  const { refetch: fetchMicrochips } =
    api.admin.getNotCompleteMicrochip.useQuery({
      accessToken: tokens?.access_token as string,
      wallet: wallet as string,
    });

  const { admin, isSuccess: adminOK } = useIsAdmin();

  useEffect(() => {
    void fetchwaitForPaymentUsers();
    void fetchWaitForActive();
    void fetchMicrochips();
  }, []);

  useEffect(() => {
    if (isConnected) {
      if (admin && adminOK) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [isAdmin, admin, isConnected, adminOK]);

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
          {/** Member Payment Approve Box */}
          <div className="max-h-[80vh] min-h-[50vh] overflow-y-auto bg-white ">
            <div className="flex justify-around">
              <ul className="flex min-w-[350px] max-w-[400px] flex-col justify-center gap-2 p-2">
                <div className="flex justify-between px-3 py-2 text-lg font-bold">
                  <div>รอยืนยันการชำระเงิน</div>
                  <div>
                    {loadingPayment ? (
                      <Loading />
                    ) : (
                      <>
                        {waitForPaymentUsers == undefined
                          ? "N/A"
                          : waitForPaymentUsers?.length}{" "}
                        คน
                      </>
                    )}
                  </div>
                </div>
                {loadingPayment ? (
                  <Loading />
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

          {/** After 15 days passed approvement */}
          <div className="max-h-[80vh]  min-h-[50vh] overflow-y-auto bg-white">
            <div className="flex justify-around">
              <ul className="flex min-w-[350px] max-w-[400px] flex-col justify-center gap-2 p-2">
                <div className="flex items-start px-3 py-2 text-lg font-bold">
                  <div>ยืนยันสถานะสมาชิก</div>
                  <div>
                    {loadingActive ? (
                      <Loading />
                    ) : (
                      <>
                        {waitForActiveUsers == undefined
                          ? "N/A"
                          : waitForActiveUsers?.length}{" "}
                        คน
                      </>
                    )}
                  </div>
                </div>
                {loadingActive ? (
                  <Loading />
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

          {/** Order management */}
          <div className="max-h-[80vh]  min-h-[50vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 gap-2 px-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-lg font-bold">
                  ระบบจัดการ order microchip
                </div>
              </div>
              <MicrochipManageTable />
            </div>
          </div>

          {/** NFT MINTER management */}
          {/* <div className="max-h-[80vh]  min-h-[50vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 gap-2 px-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-lg font-bold">Member NFT Minter</div>
              </div>
              <MemberMintingTable />
            </div>
          </div> */}

          {/** Update wallet management */}
          <div className="max-h-[80vh]  min-h-[50vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 gap-2 px-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-lg font-bold">Update wallet</div>
              </div>
              <UpdateWallet />
            </div>
          </div>

          {/** Certificate Approvement */}
          <div className="max-h-[80vh]  min-h-[50vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 gap-2 px-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-lg font-bold">Certificate Approvement</div>
              </div>
              <CertificationApproveTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovementDashBoard;
