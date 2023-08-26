import Image from "next/image";
import Link from "next/link";
import ConnectBitkubNextButton from "../Shared/BitkubButton";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { ToastContainer } from "react-toastify";
import { api } from "../../utils/api";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";

const BigScreenNav = () => {
  const [isAdmin, setAdmin] = useState<boolean>(false);
  const { wallet, isConnected, tokens, signOut } = useBitkubNext();
  const { data: registered } = api.user.isRegistered.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  const { admin, isSuccess: adminOK, isError: adminErr } = useIsAdmin();

  useEffect(() => {
    if (isConnected && adminOK && admin) {
      setAdmin(adminOK);
    } else if (adminErr) {
      setAdmin(false);
    }
  }, [registered, isConnected, isAdmin, adminOK, adminErr]);

  return (
    <div className="navbar relative z-10 hidden border-b-2 border-black w768:flex">
      <div className="navbar-start">
        <ul className="flex gap-3 pl-2">
          <li>
            {registered != undefined && registered ? null : (
              <Link
                // href="#"
                href={isConnected ? "/register" : "/"}
                onClick={() => {
                  if (!isConnected)
                    window.please_connect_wallet_dialog.showModal();
                  // window.alert_message_dialog.showModal();
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
          <li>
            <Link href="/member-list">รายชื่อสมาชิก</Link>
          </li>
          <li>
            <Link href="/wait-list">รายชื่อผู้สมัคร</Link>
          </li>
          <li>
            {registered && isAdmin ? (
              <Link href="/admin/dashboard">แดชบอร์ด</Link>
            ) : null}
          </li>
        </ul>
      </div>
      <div className="navbar-center">
        <div
          className="relative h-[100px] w-[125px]
        w1024:w-[150px]
        w1440:w-[180px]"
        ></div>
        <Link className="absolute top-[3rem]" href="/">
          <Image
            className="w1024:w-[150px] w1440:w-[180px]"
            src="/images/logo.png"
            width={125}
            height={125}
            alt="logo"
          />
        </Link>
      </div>
      <div className="navbar-end">
        {!isConnected ? (
          <ConnectBitkubNextButton />
        ) : (
          <div>
            <button
              className="btn-outline btn rounded-full"
              onClick={() => signOut()}
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default BigScreenNav;
