import Image from "next/image";

const BigScreenNav = () => {
  return (
    <div className="navbar hidden border-b-2 border-black w768:flex">
      <div className="navbar-start">
        <ul className="flex gap-3 pl-2">
          <li>สมัครสมาชิก</li>
          <li>รายชื่อสมาชิก</li>
        </ul>
      </div>
      <div className="navbar-center">
        <div
          className="relative h-[100px] w-[125px]
        w1024:w-[150px]
        w1440:w-[180px]"
        ></div>
        <Image
          className="absolute top-[3rem] w1024:w-[150px] w1440:w-[180px]"
          src="/images/logo.png"
          width={125}
          height={125}
          alt="logo"
        />
      </div>
      <div className="navbar-end">
        <button className="btn-outline btn rounded-full">Connect Wallet</button>
      </div>
    </div>
  );
};

export default BigScreenNav;
