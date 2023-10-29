import { BsPersonPlusFill } from "react-icons/bs";
import EditProfileModal from "./EditProfileModal";

const MemberCardMenu = () => {

   

  return (
  <>
    <details className="dropdown-top dropdown-end dropdown  absolute -bottom-4 -right-4">
      <summary className="btn-primary btn-md btn-circle btn m-1">
        <BsPersonPlusFill size={24} />
      </summary>
      <ul className="z-1 dropdown-content menu w-52 rounded-xl bg-secondary p-2 text-white shadow">
        <li>
          <button onClick={() => window.edit_profile_dialog.showModal()}  className="hover:text-base-200 hover:underline">
            Edit Picture
          </button>
        </li>
      </ul>
    </details>
    <EditProfileModal />
    </>
  );
};

export default MemberCardMenu;
