import Image from "next/image";
import { api } from "~/utils/api";
import Loading from "../Shared/LoadingIndicator";

const Advertisement = () => {
  const { data: ads, isLoading } = api.event.getEvents.useQuery();

  return (
    <>
      <div className="flex h-[35vh] w-full justify-center bg-white px-10 py-6">
        <div
          className="carousel rounded-box
        gap-2"
        >
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {ads == undefined ? null : (
                <>
                  {ads?.map((ad) => (
                    <div
                      key={ad._id}
                      className="carousel-item w-full w768:w-1/2 w1024:w-1/2"
                    >
                      <Image
                        className="object-contain"
                        src={ad.images!}
                        width={800}
                        height={600}
                        alt="ads"
                      />
                    </div>
                  ))}
                </>
              )}
            </>
          )}
          {/* <div className="carousel-item w-full w1024:w-1/2">
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
        </div> */}
        </div>
      </div>
    </>
  );
};

export default Advertisement;
