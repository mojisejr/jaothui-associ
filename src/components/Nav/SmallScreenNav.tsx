import Image from "next/image";
import Link from "next/link";
import ConnectBitkubNextButton from "../Shared/BitkubButton";
import { useBitkubNext } from "~/contexts/bitkubNextContext";

const SmallScreenNav = () => {
  const { isConnected, signOut } = useBitkubNext();
  return (
    <div className="navbar border-b-2 border-black w768:hidden">
      <div className="navbar-start">
        <div className="w-[80px]">
          <Image src="/images/logo.png" width={150} height={150} alt="logo" />
        </div>
      </div>
      <div className="navbar-end">
        <div className="dropdown-buttom dropdown-end dropdown">
          <label tabIndex={0} className="btn m-1">
            Menu
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box z-[1] w-52  bg-base-100 text-[1rem] font-bold shadow-lg"
          >
            <li className="border-b-2 p-2 hover:bg-slate-200">
              {!isConnected ? (
                <ConnectBitkubNextButton />
              ) : (
                <button
                  className="w768:btn-outline w768:btn w768:rounded-full"
                  onClick={() => signOut()}
                >
                  ออกจากระบบ
                </button>
              )}
            </li>
            <li className="border-b-2 p-2 hover:bg-slate-200">
              <Link href="/register">สมัครสมาชิก</Link>
            </li>
            <li className="p-2 hover:bg-slate-200">
              <Link href="/member">รายชื่อสมาชิก</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SmallScreenNav;
