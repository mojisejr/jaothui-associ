import { GrSearch } from "react-icons/gr";
import { useState, useEffect, useRef } from "react";
import { api } from "~/utils/api";
import MemberSearchByNameDialog from "./MemberSearchByNameDialog";
import Loading from "../Shared/LoadingIndicator";
import WalletOrId from "./WalletOrId";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";

const MemberListTable = () => {
  const [active, setActive] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { data, isLoading, refetch } = api.user.getActiveUsers.useQuery({
    page: currentPage,
  });
  // const {
  //   data: searchData,
  //   isLoading: searching,
  //   isSuccess: searched,
  //   mutate: search,
  // } = api.user.getById.useMutation();

  const { admin } = useIsAdmin();

  const {
    data: searchData,
    isLoading: searching,
    isSuccess: searched,
    mutate: search,
  } = api.user.getUsersByName.useMutation();

  useEffect(() => {
    setActive(true);
  }, []);

  useEffect(() => {
    setTotalPages(data?.totalPages as number);
  }, [isLoading]);

  useEffect(() => {
    void refetch();
  }, [currentPage]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (searched && !window.search_by_name_dialog.hasAttribute("Open")) {
      window.search_by_name_dialog.showModal();
    }
  }, [searched]);

  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function handlePrevPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (currentPage <= 0) {
      setCurrentPage(0);
    }
  }

  function handleSearch() {
    if (!searchInputRef.current?.value) {
      return;
    } else {
      search({
        name: searchInputRef.current?.value,
      });
    }
  }

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
          <h2 className="py-2 text-3xl font-bold">รายชื่อสมาชิก</h2>
          <div className="flex items-center gap-2">
            <span className="hidden text-xl font-bold">ค้นหา</span>
            <div className="flex gap-2">
              <input
                ref={searchInputRef}
                className="rounded-md bg-gray-200 px-2 py-2"
                type="text"
                placeholder="name or member Id"
                disabled={searching}
              ></input>
              <button type="submit" onClick={handleSearch} disabled={searching}>
                {searching ? <Loading /> : <GrSearch size={30} />}
              </button>
            </div>
          </div>
        </div>
        <div className="h-[75vh] overflow-auto">
          {active ? (
            <table className="w-full">
              <thead className="bg-gray-300">
                <th className="px-2 py-3">wallet/Id</th>
                <th className="px-2 py-3">name</th>
                <th className="px-2 py-3">type</th>
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
                    {data == undefined || data.users.length <= 0 ? (
                      <tr>
                        <td className="font-bold">ไม่มีข้อมูล</td>
                      </tr>
                    ) : (
                      <>
                        {data.users.map((user, index) => (
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
                            {admin ? <td>{user.tel}</td> : null}
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

        <div className="flex justify-end py-3">
          <div className="join">
            <button className="join-item btn" onClick={handlePrevPage}>
              {"<<"}
            </button>
            <button className="join-item btn">{`Page ${
              currentPage + 1
            }`}</button>
            <button className="join-item btn" onClick={handleNextPage}>
              {">>"}
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-1"></div>
      <MemberSearchByNameDialog
        users={
          searchData != undefined
            ? searchData?.map((s) => ({
                name: s.name as string,
                wallet: s.wallet,
                type: s.payment[0]?.isLifeTime as boolean,
              }))
            : []
        }
      />
    </div>
  );
};

export default MemberListTable;
