import Image from "next/image";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const DymamicMap = () => {
  return (
    <MapContainer
      center={[13.736717, 100.523186]}
      zoom={5.3}
      scrollWheelZoom={false}
      style={{ height: "600px", width: "800px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[13.736717, 100.523186]}>
        <Popup>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" width={30} height={30} alt="logo" />
              <div className="font-bold">สหมงคลฟาร์ม ประเทศไทย</div>
            </div>

            <hr />
            <div>บ้านเลขที่ x หมู่ x ตำบล xxx อำเภอ xxx จังหวัด xxxx</div>
          </div>
        </Popup>
      </Marker>
      <Marker position={[16.736717, 100.523186]}>
        <Popup>Farm Land Farm Love</Popup>
      </Marker>
      <Marker position={[16.736717, 103.523186]}>
        <Popup>ฟาร์มควายงาม บ้านต้นไทร</Popup>
      </Marker>
      <Marker position={[14.736717, 103.523186]}>
        <Popup>บ่าวเขาเงา ฟาร์ฒ</Popup>
      </Marker>
    </MapContainer>
  );
};

export default DymamicMap;
