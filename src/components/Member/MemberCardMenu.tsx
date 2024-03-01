import { BsPencilFill } from "react-icons/bs";
import EditProfileModal from "./EditProfileModal";
import AddFarmModal from "./AddFarmModal";
import Link from "next/link";

const MemberCardMenu = () => {
  return (
    <>
      <details className="dropdown-top dropdown-end dropdown  absolute right-4 top-[20rem]">
        <summary className="btn-primary btn-sm btn-circle btn m-1">
          <BsPencilFill size={16} />
        </summary>
        <ul className="z-1 dropdown-content menu w-52 rounded-xl bg-secondary p-2 text-white shadow">
          <li>
            <button
              onClick={() => window.edit_profile_dialog.showModal()}
              className="hover:text-base-200 hover:underline"
            >
              แก้ไขรูปภาพ
            </button>
          </li>
          <li>
            {/* <button
              onClick={() => window.edit_farm_dialog.showModal()}
              className="hover:text-base-200 hover:underline"
            >
              เพิ่มฟาร์ม
            </button> */}
          </li>
          <li>
            <Link href="/member/card">ดูบัตร</Link>
          </li>
        </ul>
      </details>
      <EditProfileModal />
      <AddFarmModal />
    </>
  );
};

export default MemberCardMenu;
