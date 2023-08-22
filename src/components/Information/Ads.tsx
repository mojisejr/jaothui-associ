import Image from "next/image";
const Advertisement = () => {
  return (
    <>
      <div className="flex w-full justify-center bg-white p-10">
        <div
          className="carousel rounded-box
        gap-2"
        >
          <div className="carousel-item w-full w1024:w-1/2">
            <Image
              className="w-full"
              src="/images/ads/ads1.jpg"
              width={640}
              height={640}
              alt="ads"
            />
          </div>
          <div className="carousel-item w-full w1024:w-1/2">
            <Image
              className="w-full"
              src="/images/ads/ads2.jpg"
              width={640}
              height={640}
              alt="ads"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Advertisement;
