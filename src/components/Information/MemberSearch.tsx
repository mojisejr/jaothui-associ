import { ImSearch } from "react-icons/im";
import { api } from "~/utils/api";
import { useEffect, useRef } from "react";
import Loading from "../Shared/LoadingIndicator";
import MemberSearchByNameDialog from "../MemberList/MemberSearchByNameDialog";

const MemberSearch = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    data: searchData,
    isLoading: searching,
    isSuccess: searched,
    mutate: search,
  } = api.user.getUsersByName.useMutation();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (window.search_by_name_dialog != undefined) {
      if (searched && !window.search_by_name_dialog.hasAttribute("Open")) {
        window.search_by_name_dialog.showModal();
      }
    }
  }, [searched, searchData]);

  function handleSearch() {
    if (!searchInputRef.current?.value) {
      return;
    } else {
      void search({
        name: searchInputRef.current?.value,
      });
    }
  }

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
            placeholder="Name or Member Id"
            disabled={searching}
            className="input w-full max-w-[420px] rounded-full text-black focus:outline-none disabled:bg-gray-300"
            required
            ref={searchInputRef}
          ></input>
          <button className="text-black" onClick={handleSearch}>
            {searching ? <Loading /> : <ImSearch size={30} />}
          </button>
        </div>
      </div>
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
    </>
  );
};

export default MemberSearch;
