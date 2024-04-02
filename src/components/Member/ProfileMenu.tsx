import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { FaChevronRight } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { HiOutlineChip } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import { useRouter } from "next/router";

const ProfileMenu = () => {
  const [isAdmin, setAdmin] = useState<boolean>(false);
  const { signOut, isConnected } = useBitkubNext();
  const { admin, isSuccess: adminOK, isError: adminErr } = useIsAdmin();
  const { replace } = useRouter();

  function handleSignOut() {
    signOut();
    replace("/");
  }

  useEffect(() => {
    if (isConnected && adminOK && admin) {
      setAdmin(admin);
    } else if (adminErr) {
      setAdmin(false);
    }
  }, [isConnected, isAdmin, adminOK, adminErr]);

  return (
    <div className="grid grid-cols-1 gap-1">
      <Link
        href="/member/card"
        className="flex items-center justify-between border-b-2 border-slate-200  px-3 py-2"
      >
        <div className="flex items-center gap-1">
          <FaRegAddressCard size={18} />
          บัตรสมาชิก
        </div>
        <FaChevronRight size={18} />
      </Link>

      <Link
        href="/member/info"
        className="flex items-center justify-between border-b-2 border-slate-200  px-3 py-2"
      >
        <div className="flex items-center gap-1">
          <MdManageAccounts size={18} /> ข้อมูลสมาชิก
        </div>
        <FaChevronRight size={18} />
      </Link>
      {/* <Link
        href=""
        className="flex items-center justify-between border-b-2 border-slate-200  px-3 py-2"
      >
        <div className="flex items-center gap-1">
          <GiBullHorns size={18} />
          ข้อมูลควาย
        </div>
        <FaChevronRight size={18} />
      </Link> */}
      <Link
        href="/microchip"
        className="flex items-center justify-between border-b-2 border-slate-200  px-3 py-2"
      >
        <div className="flex items-center gap-1">
          <HiOutlineChip size={18} />
          ไมโครชิพ
        </div>
        <FaChevronRight size={18} />
      </Link>
      {admin ? (
        <Link
          href="/admin/dashboard"
          className="flex items-center justify-between border-b-2 border-slate-200  px-3 py-2"
        >
          <div className="flex items-center gap-1">
            <MdOutlineDashboard size={18} />
            แดชบอร์ด
          </div>
          <FaChevronRight size={18} />
        </Link>
      ) : null}
      <button
        onClick={() => handleSignOut()}
        className="btn-error btn mx-2 mt-3"
      >
        ออกจากระบบ
      </button>
    </div>
  );
};

export default ProfileMenu;
