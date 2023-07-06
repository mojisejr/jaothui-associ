import Image from "next/image";
import Link from "next/link";

const BigScreenNav = () => {
  return (
    <div className="navbar relative z-10 hidden border-b-2 border-black w768:flex">
      <div className="navbar-start">
        <ul className="flex gap-3 pl-2">
          <li>
            <Link href="/register">สมัครสมาชิก</Link>
          </li>
          <li>
            <Link href="/member">รายชื่อสมาชิก</Link>
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
        <button className="btn-outline btn rounded-full">Connect Wallet</button>
      </div>
    </div>
  );
};

export default BigScreenNav;
