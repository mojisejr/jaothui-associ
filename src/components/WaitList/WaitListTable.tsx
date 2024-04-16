import { useState, useEffect, useRef } from "react";
import { api } from "~/utils/api";
import Loading from "../Shared/LoadingIndicator";
import WalletOrId from "../MemberList/WalletOrId";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";

const WaitListTable = () => {
  const [active, setActive] = useState<boolean>(false);
  const { data, isLoading } = api.user.getWaitForApprovementUsers.useQuery();
  const { admin } = useIsAdmin();

  useEffect(() => {
    setActive(true);
  }, []);

  return (
    <div className="grid min-h-screen w-full grid-cols-5">
      <div className="col-span-1"></div>
      <div className="col-span-5 w768:col-span-3">
        <div
          className="flex flex-col items-center justify-center gap-2 py-2
    w768:flex-row
    w768:justify-between
    w768:px-3"
        >
          <div className="py-2">
            <h2 className="text-3xl font-bold">รายชื่อผู้สมัคร</h2>
            <h3 className=" text-gray-800">
              ผู้สมัครที่ได้รับอนุมัติชำระเงินแล้ว รอ 15 วัน
            </h3>
          </div>
        </div>
        <div className="h-[75vh] overflow-auto">
          {active ? (
            <table className="w-full">
              <thead className="bg-gray-300">
                <th className="px-2 py-3">wallet/Id</th>
                <th className="px-2 py-3">name</th>
                <th className="px-2 py-3">type</th>
                <th className="px-2 py-3">registered</th>
                {admin ? <th className="px-2 py-3">tel</th> : null}
              </thead>
              <tbody className="text-center">
                {isLoading ? (
                  <tr>
                    <td className="px-3 py-3">
                      <Loading />
                    </td>
                  </tr>
                ) : (
                  <>
                    {data == undefined || data.length <= 0 ? (
                      <tr>
                        <td className="font-bold">ไม่มีข้อมูล</td>
                      </tr>
                    ) : (
                      <>
                        {data.map((user, index) => (
                          <tr className="hover:bg-gray-100" key={index}>
                            <td>
                              <WalletOrId text={user.wallet} />
                            </td>
                            <td className="px-1 py-2 text-left">{user.name}</td>
                            <td className="px-1 py-2">
                              {user.payment.length <= 0 ? (
                                <>N/A</>
                              ) : (
                                <>
                                  {user.payment[0]?.isLifeTime ? (
                                    <div className="px-1 py-2">ตลอดชีพ</div>
                                  ) : (
                                    <div className="px-1 py-2">รายปี</div>
                                  )}
                                </>
                              )}
                            </td>
                            <td className="px-1 py-2 font-bold text-red-400">
                              {user.daysPassed} of 15
                            </td>
                            {admin ? (
                              <td className="font-bol px-1 py-2">
                                {user.tel == undefined ? "N/A" : user.tel}
                              </td>
                            ) : null}
                          </tr>
                        ))}
                      </>
                    )}
                  </>
                )}
              </tbody>
            </table>
          ) : (
            <div>
              <Loading />
            </div>
          )}
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default WaitListTable;
