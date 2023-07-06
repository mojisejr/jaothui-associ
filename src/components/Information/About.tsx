import Image from "next/image";

const About = () => {
  return (
    <>
      <div className="h-full w-full bg-white p-10">
        <div
          className="flex flex-col items-center gap-3
        w768:flex-row
        w768:gap-[2rem]
        w1024:justify-evenly
        w1440:justify-center
        w1440:gap-[5rem]"
        >
          <Image
            className="w-[150px] max-w-[300px]
            w768:w-[200px]
            w768:flex-grow
            "
            src="/images/logo.png"
            width={100}
            height={100}
            alt="logo"
          />
          <p
            style={{ fontFamily: "Kanit", fontWeight: "300" }}
            className="max-w-[600px] text-[1.2rem]
            w1024:w-[450px]
            w1024:text-[1.6rem]
            w1440:w-[550px]
            w1440:text-[1.8rem]
            "
          >
            <span className="font-bold">สมาคมอนุรักษ์ และพัฒนาควายไทย</span>{" "}
            ก่อกำเนิดขึ้นในงาน กระบือแห่งขาติ ครั้งที่ 7 ตรงกับวันที่ 1 มีนาคม
            2544 ณ ศูนย์วิจัยและพัฒนากระบือ จังหวัดสุรินทร์ ซึ่งถือเป็น
            สถานที่รวมพลคนรักควายได้มาพบกันทุกปี ซึ่งมี
            ท่านศาสตราจารย์เกียรติคุณ ดร.จรัญ จันทลักขณา เป็นนายกสมาคมผู้ก่อตั้ง
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
