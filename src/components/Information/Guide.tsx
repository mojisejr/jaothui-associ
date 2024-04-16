import YouTube from "react-youtube";
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
              <YouTube
                videoId="h5XWQWDSF9A"
                opts={{
                  height: "200",
                  width: "300",
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />
              <div style={{ fontFamily: "Kanit" }}>วิธีสมัครสมาชิกสมาคม</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <YouTube
                videoId="Es8ulDG9VzU"
                opts={{
                  height: "200",
                  width: "300",
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />
              <div style={{ fontFamily: "Kanit" }}>วิธีอัพเดดบัตรสมาชิก</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guide;
