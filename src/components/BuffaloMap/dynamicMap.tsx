import Image from "next/image";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const addresses = [
  {
    name: "Jaothui Space",
    lat: 16.6955585,
    lon: 103.5079892,
    imageUrl: "/images/thuiLogo.png",
    description: "โนนบุรี ตำบล โนนบุรี อำเภอ สหัสขันธ์ กาฬสินธุ์ 46140",
    tel: "098 505 4265",
  },
  {
    name: "ควายงามฟาร์มดอนมหา",
    lat: 16.0342418,
    lon: 103.1982074,
    imageUrl: "/images/thuiLogo.png",
    description: "ตำบล หนองจิก อำเภอ บรบือ มหาสารคาม 44130",
    tel: "089 965 2867",
  },
  {
    name: "ฅน-ควาย-ควาย ฟาร์ม ควายงามอุดร",
    lat: 17.1887302,
    lon: 103.1095744,
    imageUrl: "/images/thuiLogo.png",
    description:
      "9 หมู่ 15 ถนนหนองหาน-กุมภวาปี ตำบล คอนสาย อำเภอ กู่แก้ว อุดรธานี 41130",
    tel: "095 928 9887",
  },
  {
    name: "นินลนีย์ฟาร์มเขาใหญ่",
    lat: 14.5428113,
    lon: 101.4870147,
    imageUrl: "/images/thuiLogo.png",
    description:
      "บริษัท นินลนีย์ การ์เด้น ฟาร์ม จำกัด ตำบล หมูสี อำเภอปากช่อง นครราชสีมา 30130",
    tel: "N/A",
  },
  {
    name: "อ.ลิงค์ฟาร์มควาย",
    lat: 16.689222,
    lon: 104.087194,
    imageUrl: "/images/thuiLogo.png",
    description: "ตำบล คุ้มเก่า อำเภอ เขาวง กาฬสินธุ์ 46160",
    tel: "N/A",
  },
  {
    name: "ไร่โสภีควายงาม",
    lat: 17.2348288,
    lon: 102.8016696,
    imageUrl: "/images/thuiLogo.png",
    description: "ตำบล ทับกุง อำเภอ หนองแสง อุดรธานี 41340",
    tel: "N/A",
  },
];

const DymamicMap = () => {
  return (
    <MapContainer
      center={[13.736717, 100.523186]}
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
      {addresses.map((addr, index) => (
        <Marker key={index} position={[addr.lat, addr.lon]}>
          <Popup>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Image src={addr.imageUrl} width={30} height={30} alt="logo" />
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
  );
};

export default DymamicMap;
