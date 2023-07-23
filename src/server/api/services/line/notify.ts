/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from "axios";
import qs from "qs";

export async function registrationNotify({
  wallet,
  isLifeTime,
  slipUrl,
}: {
  wallet: string;
  isLifeTime: string;
  slipUrl: string;
}) {
  try {
    const token = process.env.line as string;
    const response = await axios.post(
      process.env.line_uri as string,
      qs.stringify({
        message: `${new Date().toLocaleDateString()}:  wallet = ${wallet} สมัครเข้ามาแบบ ${
          isLifeTime == "2" ? "600 บาท ตลอดชีพ" : "100 บาท รายปี"
        } ชื่อ fileslip โอน ${slipUrl} กรุณาตรวจสอบเพื่อ approve`,
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("notification response", response);
    return true;
  } catch (error) {
    console.log("notification error: ", error);
  }
}
