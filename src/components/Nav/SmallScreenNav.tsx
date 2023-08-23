import Image from "next/image";
import Link from "next/link";
import ConnectBitkubNextButton from "../Shared/BitkubButton";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "../../utils/api";
import { useState, useEffect } from "react";

const SmallScreenNav = () => {
  const [isAdmin, setAdmin] = useState<boolean>(false);
  const { wallet, isConnected, tokens, signOut } = useBitkubNext();
  const { data: registered } = api.user.isRegistered.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  const { data: user } = api.user.get.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  useEffect(() => {
    if (isConnected && user?.role == "ADMIN") {
      setAdmin(true);
    }
  }, [registered, isConnected, isAdmin]);

  return (
    <div className="navbar border-b-2 border-black w768:hidden">
      <div className="navbar-start">
        <Link href="/" className="w-[80px]">
          <Image src="/images/logo.png" width={150} height={150} alt="logo" />
        </Link>
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
            <li className="py-2 hover:bg-slate-200">
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
            <li>
              {registered != undefined && registered ? null : (
                <Link
                  href="#"
                  // href={isConnected ? "/register" : "/"}
                  onClick={() => {
                    // if (!isConnected)
                    //   window.please_connect_wallet_dialog.showModal();
                    window.alert_message_dialog.showModal();
                  }}
                >
                  สมัครสมาชิก
                </Link>
              )}
            </li>
            <li>
              {registered != undefined && registered && isConnected ? (
                <Link
                  href={isConnected ? "/member" : "/"}
                  onClick={() => {
                    if (!isConnected)
                      window.please_connect_wallet_dialog.showModal();
                  }}
                >
                  โปรไฟล์ของฉัน
                </Link>
              ) : null}
            </li>
            <li className="py-2 hover:bg-slate-200">
              <Link href="/member-list">รายชื่อสมาชิก</Link>
            </li>
            {registered && isAdmin ? (
              <li className="py-2 hover:bg-slate-200">
                <Link href="/admin/dashboard">แดชบอร์ด</Link>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SmallScreenNav;
