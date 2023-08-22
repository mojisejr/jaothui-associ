import InformationGridV2 from "./InformatinoGridV2";

const Profile = () => {
  return (
    <>
      <div
        className="flex max-h-full min-h-[700px] justify-center bg-[url('/images/bgmain.jpg')] bg-cover py-3 text-white
      w1024:pt-[50px]
      w1440:pt-[100px]"
      >
        <div className="flex max-w-[900px] flex-col items-center justify-evenly">
          <div
            style={{ fontFamily: "Kanit" }}
            className="
      text-center text-[2rem]
      font-[700]
      w425:pl-2
      w425:pr-2
      w425:text-[2.5rem]
      w768:text-[3rem]
      w1440:text-[3rem]
      "
          >
            โปรไฟล์ของฉัน
          </div>
          <InformationGridV2 />
        </div>
      </div>
    </>
  );
};

export default Profile;
