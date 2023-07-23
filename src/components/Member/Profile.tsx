import InformationGrid from "./InformationGrid";

const Profile = () => {
  return (
    <>
      <div
        className="flex max-h-[767px] min-h-[600px] justify-center bg-[url('/images/bgmain.jpg')] bg-cover text-white 
  w425:h-[650px]
  w768:h-[767px]
"
      >
        <div className="mt-20 flex max-h-[500px] max-w-[900px] flex-col items-center justify-evenly">
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
            ข้อมูลสมาชิก
          </div>
          <InformationGrid />
        </div>
      </div>
    </>
  );
};

export default Profile;
