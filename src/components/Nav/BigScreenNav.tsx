import Image from "next/image";
import Link from "next/link";
import ConnectBitkubNextButton from "../Shared/BitkubButton";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { ToastContainer } from "react-toastify";
import { api } from "../../utils/api";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Loading from "../Shared/LoadingIndicator";

const BigScreenNav = () => {
  const [isAdmin, setAdmin] = useState<boolean>(false);
  const { wallet, isConnected, tokens, signOut } = useBitkubNext();
  const { data: registered } = api.user.isRegistered.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  const { data: user, isLoading: loadingUser } = api.user.get.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  useEffect(() => {
    if (isConnected && user?.role == "ADMIN") {
      setAdmin(true);
    }
  }, [registered, isConnected, isAdmin]);

  return (
    <div className="navbar relative z-10 hidden border-b-2 border-black w768:flex">
      <div className="navbar-start">
        <ul className="flex gap-3 pl-2">
          <li>
            {loadingUser ? (
              <Loading />
            ) : (
              <>
                {registered != undefined && registered ? (
                  <Link href="/member">ข้อมูลสมาชิก</Link>
                ) : (
                  <Link
                    href={isConnected ? "/register" : "/"}
                    onClick={() => {
                      if (!isConnected)
                        window.please_connect_wallet_dialog.showModal();
                    }}
                  >
                    สมัครสมาชิก
                  </Link>
                )}
              </>
            )}
          </li>
          <li>
            <Link href="/member-list">รายชื่อสมาชิก</Link>
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
