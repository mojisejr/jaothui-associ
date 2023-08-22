/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { api } from "~/utils/api";
import Loading from "../Shared/LoadingIndicator";

const DymamicMap = () => {
  const { data: addresses, isLoading } = api.farm.get.useQuery();
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <MapContainer
          center={[15.736717, 100.523186]}
          zoom={5.7}
          scrollWheelZoom={false}
          className="h-[300px] w-[300px]
      w768:h-[400px]
      w768:w-[500px]
      w1440:h-[400px]
      w1440:w-[700px]
      "
          // style={{ minWidth: "300px", minHeight: "450px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {addresses?.map((addr, index) => (
            <Marker key={index} position={[addr.lat, addr.lon]}>
              <Popup>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={addr.imageUrl as string}
                      width={30}
                      height={30}
                      alt="logo"
                    />
                    <div>
                      <div className="py-2 font-bold">{addr.name}</div>
                      <div>ที่อยู่: {addr.description}</div>
                      <div>โทร: {addr.tel}</div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
};

export default DymamicMap;
