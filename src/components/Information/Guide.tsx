const Guide = () => {
  return (
    <>
      <div>
        <div>
          <div
            style={{ fontFamily: "Kanit" }}
            className="mb-2 text-center
            text-[2rem]"
          >
            วิธีการใช้งานต่างๆ
          </div>
          <div
            className="flex flex-col gap-3 pb-2
          w1024:flex-row"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="h-[200px] min-w-[250px] bg-black"></div>
              <div style={{ fontFamily: "Kanit" }}>วิธีสมัครสมาชิกสมาคม</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-[200px] min-w-[250px]  bg-black"></div>
              <div style={{ fontFamily: "Kanit" }}>วิธีการขึ้นทะเบียนควาย</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-[200px] min-w-[250px]  bg-black"></div>
              <div style={{ fontFamily: "Kanit" }}>
                วิธีการขอใบรับรองพันธุ์ประวัติ
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guide;
